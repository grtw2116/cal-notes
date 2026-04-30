import SwiftUI
import SwiftData
import EventKit

struct EventDetailView: View {
    let event: EKEvent

    @Environment(\.modelContext) private var modelContext
    @Query private var entries: [JournalEntry]
    @State private var bodyText = ""
    @FocusState private var isEditorFocused: Bool

    init(event: EKEvent) {
        self.event = event
        let id = event.eventIdentifier ?? ""
        _entries = Query(filter: #Predicate<JournalEntry> { $0.externalEventId == id })
    }

    private var entry: JournalEntry? { entries.first }

    private var hasChanges: Bool {
        bodyText != (entry?.body ?? "")
    }

    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 0) {
                eventHeader
                    .padding(.horizontal)
                    .padding(.top)

                Divider()
                    .padding(.vertical, 12)
                    .padding(.horizontal)

                TextEditor(text: $bodyText)
                    .focused($isEditorFocused)
                    .font(.body)
                    .frame(minHeight: 300)
                    .scrollDisabled(true)
                    .padding(.horizontal, 18)
            }
        }
        .navigationBarTitleDisplayMode(.inline)
        .toolbar {
            ToolbarItem(placement: .topBarTrailing) {
                Button("完了") { save() }
                    .disabled(!hasChanges)
            }
            ToolbarItemGroup(placement: .keyboard) {
                Spacer()
                Button("完了") {
                    isEditorFocused = false
                    save()
                }
            }
        }
        .onAppear {
            bodyText = entry?.body ?? ""
        }
    }

    private var eventHeader: some View {
        VStack(alignment: .leading, spacing: 6) {
            Text(eventDateRange)
                .font(.caption)
                .foregroundStyle(.secondary)
                .textCase(.uppercase)
                .tracking(0.4)

            Text(event.title ?? "（タイトルなし）")
                .font(.title2.bold())

            HStack(spacing: 6) {
                Circle()
                    .fill(Color(cgColor: event.calendar.cgColor))
                    .frame(width: 8, height: 8)
                Text(eventSubtitle)
                    .font(.caption)
                    .foregroundStyle(.secondary)
            }
        }
    }

    private var eventDateRange: String {
        let fmt = DateIntervalFormatter()
        fmt.dateStyle = .medium
        fmt.timeStyle = .short
        return fmt.string(from: event.startDate, to: event.endDate)
    }

    private var eventSubtitle: String {
        [event.calendar.title, event.location]
            .compactMap { $0 }
            .filter { !$0.isEmpty }
            .joined(separator: " · ")
    }

    private func save() {
        guard hasChanges else { return }
        if let existing = entry {
            existing.body = bodyText
            existing.updatedAt = Date()
        } else {
            let newEntry = JournalEntry(
                externalEventId: event.eventIdentifier ?? UUID().uuidString,
                calendarSource: event.calendar.source.title,
                eventTitleSnapshot: event.title ?? "",
                eventStartSnapshot: event.startDate,
                eventEndSnapshot: event.endDate,
                eventLocationSnapshot: event.location,
                body: bodyText
            )
            modelContext.insert(newEntry)
        }
    }
}
