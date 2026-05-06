import SwiftUI
import SwiftData
import EventKit
#if canImport(FoundationModels)
import FoundationModels
#endif

private let moodOptions: [(emoji: String, label: String)] = [
    ("🤩", "最高"), ("😊", "良い"), ("😐", "普通"), ("😔", "しんどい"), ("😤", "ストレス"),
]

struct EventDetailView: View {
    let event: EKEvent

    @Environment(\.modelContext) private var modelContext
    @Query private var entries: [JournalEntry]
    @State private var bodyText = ""
    @State private var selectedMood: String? = nil
    @State private var selectedTags: [String] = []
    @State private var tagInput = ""
    @FocusState private var isEditorFocused: Bool

    @AppStorage("anthropicAPIKey") private var apiKey = ""
    @AppStorage("aiModel") private var model = "claude-haiku-4-5-20251001"
    @State private var showWritingPromptSheet = false
    @State private var writingPromptText: String?
    @State private var isLoadingPrompt = false
    @State private var promptError: String?

    init(event: EKEvent) {
        self.event = event
        let id = event.eventIdentifier ?? ""
        _entries = Query(filter: #Predicate<JournalEntry> { $0.externalEventId == id })
    }

    private var entry: JournalEntry? { entries.first }

    private var hasChanges: Bool {
        bodyText != (entry?.body ?? "")
            || selectedMood != entry?.mood
            || selectedTags != (entry?.tags ?? [])
    }

    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 0) {
                eventHeader
                    .padding(.horizontal)
                    .padding(.top)

                Divider().padding(.vertical, 12).padding(.horizontal)

                moodSection
                    .padding(.horizontal)

                Divider().padding(.vertical, 12).padding(.horizontal)

                tagSection
                    .padding(.horizontal)

                Divider().padding(.vertical, 12).padding(.horizontal)

                editorSection
                    .padding(.horizontal)
            }
        }
        .navigationBarTitleDisplayMode(.inline)
        .toolbar {
            ToolbarItem(placement: .topBarTrailing) {
                Button("完了") { save() }
                    .disabled(!hasChanges)
            }
            ToolbarItemGroup(placement: .keyboard) {
                if aiAvailable {
                    Button {
                        isEditorFocused = false
                        Task { await fetchWritingPrompts() }
                    } label: {
                        Label("書き出し補助", systemImage: "sparkles")
                    }
                }
                Spacer()
                Button("完了") {
                    isEditorFocused = false
                    save()
                }
            }
        }
        .onAppear {
            bodyText = entry?.body ?? ""
            selectedMood = entry?.mood
            selectedTags = entry?.tags ?? []
        }
        .sheet(isPresented: $showWritingPromptSheet) {
            WritingPromptSheet(
                promptText: writingPromptText,
                isLoading: isLoadingPrompt,
                error: promptError
            ) { chosen in
                if !bodyText.isEmpty {
                    bodyText += "\n\n" + chosen
                } else {
                    bodyText = chosen
                }
                showWritingPromptSheet = false
            }
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

    private var moodSection: some View {
        VStack(alignment: .leading, spacing: 8) {
            Text("気分")
                .font(.caption)
                .foregroundStyle(.secondary)
            HStack(spacing: 4) {
                ForEach(moodOptions, id: \.emoji) { option in
                    Button {
                        selectedMood = selectedMood == option.emoji ? nil : option.emoji
                    } label: {
                        Text(option.emoji)
                            .font(.title2)
                            .padding(6)
                            .background(
                                selectedMood == option.emoji
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
            if !selectedTags.isEmpty {
                ScrollView(.horizontal, showsIndicators: false) {
                    HStack(spacing: 6) {
                        ForEach(selectedTags, id: \.self) { tag in
                            HStack(spacing: 3) {
                                Text("#\(tag)")
                                    .font(.caption)
                                Button {
                                    withAnimation {
                                        selectedTags.removeAll { $0 == tag }
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

    private var editorSection: some View {
        VStack(alignment: .leading, spacing: 8) {
            HStack {
                Text("日記")
                    .font(.caption)
                    .foregroundStyle(.secondary)
                Spacer()
                if aiAvailable {
                    Button {
                        Task { await fetchWritingPrompts() }
                    } label: {
                        Label("書き出し補助", systemImage: "sparkles")
                            .font(.caption)
                    }
                    .disabled(isLoadingPrompt)
                }
            }

            TextEditor(text: $bodyText)
                .focused($isEditorFocused)
                .font(.body)
                .frame(minHeight: 300)
                .scrollDisabled(true)
        }
    }

    private func addTag() {
        let trimmed = tagInput.trimmingCharacters(in: .whitespaces)
        guard !trimmed.isEmpty, !selectedTags.contains(trimmed) else {
            tagInput = ""
            return
        }
        selectedTags.append(trimmed)
        tagInput = ""
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
            existing.mood = selectedMood
            existing.tags = selectedTags
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
            newEntry.mood = selectedMood
            newEntry.tags = selectedTags
            modelContext.insert(newEntry)
        }
    }

    private var aiAvailable: Bool {
        if model == "apple-on-device" {
#if canImport(FoundationModels)
            if #available(iOS 26, *) {
                if case .available = SystemLanguageModel.default.availability { return true }
            }
#endif
            return false
        }
        return !apiKey.isEmpty
    }

    private func fetchWritingPrompts() async {
        isLoadingPrompt = true
        promptError = nil
        writingPromptText = nil
        showWritingPromptSheet = true

        do {
            let service = try makeAIService(model: model, apiKey: apiKey)
            writingPromptText = try await service.generateWritingPrompts(
                eventTitle: event.title ?? "",
                startDate: event.startDate,
                location: event.location
            )
        } catch {
            promptError = error.localizedDescription
        }
        isLoadingPrompt = false
    }
}

// MARK: - Writing Prompt Sheet

private struct WritingPromptSheet: View {
    let promptText: String?
    let isLoading: Bool
    let error: String?
    let onSelect: (String) -> Void

    @Environment(\.dismiss) private var dismiss

    var body: some View {
        NavigationStack {
            Group {
                if isLoading {
                    VStack(spacing: 16) {
                        ProgressView()
                        Text("書き出しを考えています…")
                            .foregroundStyle(.secondary)
                    }
                    .frame(maxWidth: .infinity, maxHeight: .infinity)
                } else if let error {
                    VStack(spacing: 12) {
                        Image(systemName: "exclamationmark.triangle")
                            .font(.largeTitle)
                            .foregroundStyle(.orange)
                        Text(error)
                            .multilineTextAlignment(.center)
                            .foregroundStyle(.secondary)
                    }
                    .padding()
                    .frame(maxWidth: .infinity, maxHeight: .infinity)
                } else if let text = promptText {
                    ScrollView {
                        VStack(alignment: .leading, spacing: 16) {
                            Text("以下から選んで日記を始めましょう")
                                .font(.subheadline)
                                .foregroundStyle(.secondary)
                                .padding(.top, 4)

                            ForEach(parsedPrompts(from: text), id: \.self) { prompt in
                                Button {
                                    onSelect(prompt)
                                } label: {
                                    HStack(alignment: .top, spacing: 10) {
                                        Image(systemName: "pencil.circle.fill")
                                            .foregroundStyle(Color.accentColor)
                                        Text(prompt)
                                            .multilineTextAlignment(.leading)
                                            .foregroundStyle(.primary)
                                        Spacer()
                                    }
                                    .padding()
                                    .background(.quaternary, in: RoundedRectangle(cornerRadius: 10))
                                }
                                .buttonStyle(.plain)
                            }

                            Text("選択するとエディタに挿入されます")
                                .font(.caption)
                                .foregroundStyle(.tertiary)
                                .frame(maxWidth: .infinity, alignment: .center)
                                .padding(.top, 4)
                        }
                        .padding()
                    }
                }
            }
            .navigationTitle("書き出し補助")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .topBarTrailing) {
                    Button("閉じる") { dismiss() }
                }
            }
        }
        .presentationDetents([.medium, .large])
    }

    private func parsedPrompts(from text: String) -> [String] {
        text.components(separatedBy: "\n")
            .map { $0.trimmingCharacters(in: .whitespaces) }
            .filter { !$0.isEmpty }
            .map { line in
                // Strip leading "1. ", "2. ", "・", "- " etc.
                line.replacingOccurrences(of: #"^[\d]+\.\s*"#, with: "", options: .regularExpression)
                    .replacingOccurrences(of: #"^[・\-]\s*"#, with: "", options: .regularExpression)
            }
            .filter { !$0.isEmpty }
    }
}
