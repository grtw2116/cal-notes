import SwiftUI
import SwiftData

struct SummaryView: View {
    @Query(sort: \JournalEntry.eventStartSnapshot, order: .reverse)
    private var entries: [JournalEntry]

    @Query(sort: \AISummary.createdAt, order: .reverse)
    private var aiSummaries: [AISummary]

    @Environment(\.modelContext) private var modelContext
    @AppStorage("anthropicAPIKey") private var apiKey = ""
    @AppStorage("aiModel") private var model = "claude-haiku-4-5-20251001"

    @State private var isGenerating = false
    @State private var generateError: String?

    private let cal = Calendar.current

    private var thisWeekStart: Date {
        cal.dateInterval(of: .weekOfYear, for: .now)?.start ?? .now
    }

    private var thisWeekEntries: [JournalEntry] {
        let end = cal.date(byAdding: .weekOfYear, value: 1, to: thisWeekStart)!
        return entries.filter { $0.eventStartSnapshot >= thisWeekStart && $0.eventStartSnapshot < end }
    }

    private var thisMonthEntries: [JournalEntry] {
        let start = cal.dateInterval(of: .month, for: .now)?.start ?? .now
        return entries.filter { $0.eventStartSnapshot >= start }
    }

    private var topTags: [(tag: String, count: Int)] {
        var counts: [String: Int] = [:]
        for entry in entries {
            for tag in entry.tags { counts[tag, default: 0] += 1 }
        }
        return counts.sorted { $0.value > $1.value }.prefix(5).map { (tag: $0.key, count: $0.value) }
    }

    private var moodCounts: [(mood: String, count: Int)] {
        var counts: [String: Int] = [:]
        for entry in entries {
            if let mood = entry.mood { counts[mood, default: 0] += 1 }
        }
        return counts.sorted { $0.value > $1.value }.map { (mood: $0.key, count: $0.value) }
    }

    private var weeklyGroups: [(label: String, count: Int)] {
        var result: [(label: String, count: Int)] = []
        var weekStart = thisWeekStart
        for i in 0..<4 {
            let weekEnd = cal.date(byAdding: .weekOfYear, value: 1, to: weekStart)!
            let count = entries.filter { $0.eventStartSnapshot >= weekStart && $0.eventStartSnapshot < weekEnd }.count
            let label = i == 0 ? "今週" : weekStart.formatted(.dateTime.month().day()) + "〜"
            result.append((label: label, count: count))
            weekStart = cal.date(byAdding: .weekOfYear, value: -1, to: weekStart)!
        }
        return result
    }

    private var latestWeeklySummary: AISummary? {
        aiSummaries.first { $0.summaryType == "weekly" && $0.rangeStart >= thisWeekStart }
    }

    var body: some View {
        NavigationStack {
            Group {
                if entries.isEmpty {
                    ContentUnavailableView(
                        "データなし",
                        systemImage: "chart.bar",
                        description: Text("日記を書くとまとめが表示されます")
                    )
                } else {
                    List {
                        statsSection
                        weeklySection
                        aiSummarySection
                        if !topTags.isEmpty { tagSection }
                        if !moodCounts.isEmpty { moodSection }
                    }
                }
            }
            .navigationTitle("まとめ")
        }
    }

    private var statsSection: some View {
        Section("記録") {
            LabeledContent("合計", value: "\(entries.count)件")
            LabeledContent("今週", value: "\(thisWeekEntries.count)件")
            LabeledContent("今月", value: "\(thisMonthEntries.count)件")
        }
    }

    private var weeklySection: some View {
        Section("直近4週") {
            ForEach(weeklyGroups, id: \.label) { group in
                HStack {
                    Text(group.label)
                    Spacer()
                    if group.count > 0 {
                        HStack(spacing: 2) {
                            ForEach(0..<min(group.count, 10), id: \.self) { _ in
                                Circle()
                                    .fill(Color.accentColor)
                                    .frame(width: 8, height: 8)
                            }
                            if group.count > 10 {
                                Text("+\(group.count - 10)")
                                    .font(.caption2)
                                    .foregroundStyle(.secondary)
                            }
                        }
                    }
                    Text("\(group.count)件")
                        .foregroundStyle(.secondary)
                        .font(.callout)
                        .monospacedDigit()
                }
            }
        }
    }

    @ViewBuilder
    private var aiSummarySection: some View {
        Section {
            if isGenerating {
                HStack(spacing: 10) {
                    ProgressView()
                    Text("AIサマリーを生成中…")
                        .foregroundStyle(.secondary)
                }
            } else {
                Button {
                    Task { await generateWeeklySummary() }
                } label: {
                    Label("今週のAIサマリーを生成", systemImage: "sparkles")
                }
                .disabled(apiKey.isEmpty || thisWeekEntries.isEmpty)
            }

            if let error = generateError {
                Text(error)
                    .font(.caption)
                    .foregroundStyle(.red)
            }
        } header: {
            Text("AI サマリー")
        } footer: {
            if apiKey.isEmpty {
                Text("設定タブでAPIキーを入力してください")
            } else if thisWeekEntries.isEmpty {
                Text("今週の日記エントリがありません")
            }
        }

        if let summary = latestWeeklySummary {
            Section {
                VStack(alignment: .leading, spacing: 6) {
                    Text(summary.body)
                        .font(.body)
                    Text("生成: \(summary.createdAt.formatted(date: .abbreviated, time: .shortened))")
                        .font(.caption2)
                        .foregroundStyle(.tertiary)
                }
                .padding(.vertical, 4)
            } header: {
                Text("今週のサマリー")
            }
        }
    }

    private var tagSection: some View {
        Section("よく使うタグ") {
            ForEach(topTags, id: \.tag) { item in
                LabeledContent("#\(item.tag)", value: "\(item.count)件")
            }
        }
    }

    private var moodSection: some View {
        Section("気分の記録") {
            ForEach(moodCounts, id: \.mood) { item in
                HStack {
                    Text(item.mood)
                        .font(.title3)
                    Spacer()
                    Text("\(item.count)件")
                        .foregroundStyle(.secondary)
                }
            }
        }
    }

    private func generateWeeklySummary() async {
        guard !apiKey.isEmpty else { return }
        isGenerating = true
        generateError = nil
        defer { isGenerating = false }

        let service = AnthropicAIService(apiKey: apiKey, model: model)
        let weekEnd = cal.date(byAdding: .weekOfYear, value: 1, to: thisWeekStart)!

        do {
            let text = try await service.generateWeeklySummary(entries: thisWeekEntries, weekStart: thisWeekStart)
            let summary = AISummary(
                rangeStart: thisWeekStart,
                rangeEnd: weekEnd,
                summaryType: "weekly",
                sourceEntryIds: thisWeekEntries.map(\.id),
                body: text
            )
            modelContext.insert(summary)
        } catch {
            generateError = error.localizedDescription
        }
    }
}
