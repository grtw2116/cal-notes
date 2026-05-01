import SwiftUI
import SwiftData

struct JournalListView: View {
    @Query(sort: \JournalEntry.eventStartSnapshot, order: .reverse)
    private var entries: [JournalEntry]

    private var monthGroups: [(key: String, sortDate: Date, entries: [JournalEntry])] {
        let cal = Calendar.current
        var buckets: [Date: [JournalEntry]] = [:]
        for entry in entries {
            let comps = cal.dateComponents([.year, .month], from: entry.eventStartSnapshot)
            let monthStart = cal.date(from: comps)!
            buckets[monthStart, default: []].append(entry)
        }
        let currentYear = cal.component(.year, from: .now)
        return buckets.map { (month, ents) -> (key: String, sortDate: Date, entries: [JournalEntry]) in
            let year = cal.component(.year, from: month)
            let key = year == currentYear
                ? month.formatted(.dateTime.month())
                : month.formatted(.dateTime.year().month())
            return (key: key, sortDate: month, entries: ents.sorted { $0.eventStartSnapshot > $1.eventStartSnapshot })
        }.sorted { $0.sortDate > $1.sortDate }
    }

    var body: some View {
        NavigationStack {
            Group {
                if entries.isEmpty {
                    ContentUnavailableView(
                        "日記なし",
                        systemImage: "book.closed",
                        description: Text("予定を選んで日記を書いてみましょう")
                    )
                } else {
                    List {
                        ForEach(monthGroups, id: \.key) { group in
                            Section(group.key) {
                                ForEach(group.entries) { entry in
                                    NavigationLink {
                                        JournalEntryView(entry: entry)
                                    } label: {
                                        JournalEntryRow(entry: entry)
                                    }
                                }
                            }
                        }
                    }
                }
            }
            .navigationTitle("日記")
        }
    }
}

struct JournalEntryRow: View {
    let entry: JournalEntry

    var body: some View {
        VStack(alignment: .leading, spacing: 4) {
            HStack(spacing: 6) {
                Text(entry.eventStartSnapshot, format: .dateTime.month().day())
                    .font(.caption.monospacedDigit())
                    .foregroundStyle(.secondary)
                Text(entry.eventStartSnapshot, format: .dateTime.hour().minute())
                    .font(.caption.monospacedDigit())
                    .foregroundStyle(.secondary)
                if let mood = entry.mood {
                    Text(mood)
                        .font(.caption)
                }
            }
            Text(entry.eventTitleSnapshot)
                .font(.body.weight(.medium))
                .lineLimit(1)
            if !entry.body.isEmpty {
                Text(entry.body)
                    .font(.caption)
                    .foregroundStyle(.secondary)
                    .lineLimit(2)
            }
            if !entry.tags.isEmpty {
                ScrollView(.horizontal, showsIndicators: false) {
                    HStack(spacing: 4) {
                        ForEach(entry.tags, id: \.self) { tag in
                            Text("#\(tag)")
                                .font(.caption2)
                                .padding(.horizontal, 6)
                                .padding(.vertical, 2)
                                .background(.quaternary, in: Capsule())
                        }
                    }
                }
            }
        }
        .padding(.vertical, 2)
    }
}
