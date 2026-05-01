import SwiftUI
import SwiftData

struct SummaryView: View {
    @Query(sort: \JournalEntry.eventStartSnapshot, order: .reverse)
    private var entries: [JournalEntry]

    private let cal = Calendar.current

    private var thisWeekEntries: [JournalEntry] {
        let start = cal.dateInterval(of: .weekOfYear, for: .now)?.start ?? .now
        return entries.filter { $0.eventStartSnapshot >= start }
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
        var weekStart = cal.dateInterval(of: .weekOfYear, for: .now)?.start ?? .now
        for i in 0..<4 {
            let weekEnd = cal.date(byAdding: .weekOfYear, value: 1, to: weekStart)!
            let count = entries.filter { $0.eventStartSnapshot >= weekStart && $0.eventStartSnapshot < weekEnd }.count
            let label = i == 0 ? "今週" : weekStart.formatted(.dateTime.month().day()) + "〜"
            result.append((label: label, count: count))
            weekStart = cal.date(byAdding: .weekOfYear, value: -1, to: weekStart)!
        }
        return result
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
}
