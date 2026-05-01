import SwiftUI
import SwiftData

private let moodOptions: [(emoji: String, label: String)] = [
    ("🤩", "最高"), ("😊", "良い"), ("😐", "普通"), ("😔", "しんどい"), ("😤", "ストレス"),
]

struct JournalEntryView: View {
    @Bindable var entry: JournalEntry
    @FocusState private var isEditorFocused: Bool
    @State private var tagInput = ""

    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 0) {
                entryHeader
                    .padding(.horizontal)
                    .padding(.top)

                Divider().padding(.vertical, 12).padding(.horizontal)

                moodSection
                    .padding(.horizontal)

                Divider().padding(.vertical, 12).padding(.horizontal)

                tagSection
                    .padding(.horizontal)

                Divider().padding(.vertical, 12).padding(.horizontal)

                TextEditor(text: $entry.body)
                    .focused($isEditorFocused)
                    .font(.body)
                    .frame(minHeight: 200)
                    .scrollDisabled(true)
                    .padding(.horizontal, 18)
                    .onChange(of: entry.body) { _, _ in entry.updatedAt = Date() }
            }
        }
        .navigationBarTitleDisplayMode(.inline)
        .toolbar {
            ToolbarItemGroup(placement: .keyboard) {
                Spacer()
                Button("閉じる") { isEditorFocused = false }
            }
        }
    }

    private var entryHeader: some View {
        VStack(alignment: .leading, spacing: 6) {
            Text(dateRangeString)
                .font(.caption)
                .foregroundStyle(.secondary)
                .textCase(.uppercase)
                .tracking(0.4)
            Text(entry.eventTitleSnapshot)
                .font(.title2.bold())
            if let loc = entry.eventLocationSnapshot, !loc.isEmpty {
                Text(loc)
                    .font(.caption)
                    .foregroundStyle(.secondary)
            }
        }
    }

    private var moodSection: some View {
        VStack(alignment: .leading, spacing: 8) {
            Text("気分")
                .font(.caption)
                .foregroundStyle(.secondary)
            HStack(spacing: 4) {
                ForEach(moodOptions, id: \.emoji) { option in
                    Button {
                        entry.mood = entry.mood == option.emoji ? nil : option.emoji
                        entry.updatedAt = Date()
                    } label: {
                        Text(option.emoji)
                            .font(.title2)
                            .padding(6)
                            .background(
                                entry.mood == option.emoji
                                    ? Color.accentColor.opacity(0.2)
                                    : Color.clear,
                                in: Circle()
                            )
                    }
                    .buttonStyle(.plain)
                }
            }
        }
    }

    private var tagSection: some View {
        VStack(alignment: .leading, spacing: 8) {
            Text("タグ")
                .font(.caption)
                .foregroundStyle(.secondary)
            if !entry.tags.isEmpty {
                ScrollView(.horizontal, showsIndicators: false) {
                    HStack(spacing: 6) {
                        ForEach(entry.tags, id: \.self) { tag in
                            HStack(spacing: 3) {
                                Text("#\(tag)")
                                    .font(.caption)
                                Button {
                                    withAnimation {
                                        entry.tags.removeAll { $0 == tag }
                                        entry.updatedAt = Date()
                                    }
                                } label: {
                                    Image(systemName: "xmark")
                                        .font(.system(size: 9, weight: .semibold))
                                }
                            }
                            .padding(.horizontal, 8)
                            .padding(.vertical, 4)
                            .background(.quaternary, in: Capsule())
                        }
                    }
                }
            }
            HStack {
                TextField("タグを追加", text: $tagInput)
                    .font(.caption)
                    .onSubmit { addTag() }
                if !tagInput.trimmingCharacters(in: .whitespaces).isEmpty {
                    Button("追加", action: addTag)
                        .font(.caption)
                }
            }
        }
    }

    private func addTag() {
        let trimmed = tagInput.trimmingCharacters(in: .whitespaces)
        guard !trimmed.isEmpty, !entry.tags.contains(trimmed) else {
            tagInput = ""
            return
        }
        entry.tags.append(trimmed)
        entry.updatedAt = Date()
        tagInput = ""
    }

    private var dateRangeString: String {
        let fmt = DateIntervalFormatter()
        fmt.dateStyle = .medium
        fmt.timeStyle = .short
        return fmt.string(from: entry.eventStartSnapshot, to: entry.eventEndSnapshot)
    }
}
