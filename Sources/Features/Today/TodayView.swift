import SwiftUI
import SwiftData

struct TodayView: View {
    @State private var viewModel = TodayViewModel()
    @Query private var entries: [JournalEntry]

    private var unwrittenCount: Int {
        viewModel.events.filter { event in
            !entries.contains { $0.externalEventId == event.id }
        }.count
    }

    var body: some View {
        NavigationStack {
            Group {
                if viewModel.isLoading {
                    ProgressView()
                        .frame(maxWidth: .infinity, maxHeight: .infinity)
                } else if let error = viewModel.accessError {
                    ContentUnavailableView(
                        "カレンダーにアクセスできません",
                        systemImage: "calendar.badge.exclamationmark",
                        description: Text(error.localizedDescription)
                    )
                } else if viewModel.events.isEmpty {
                    ContentUnavailableView(
                        "予定なし",
                        systemImage: "calendar",
                        description: Text("この日に予定はありません")
                    )
                } else {
                    eventList
                }
            }
            .navigationTitle(navigationTitle)
            .navigationBarTitleDisplayMode(.large)
            .toolbar { toolbarContent }
        }
        .task { await viewModel.onAppear() }
        .overlay(alignment: .bottom) {
#if DEBUG
            Button("＋テストデータを追加") {
                Task { await viewModel.insertTestEvents() }
            }
            .font(.caption)
            .padding(.horizontal, 14)
            .padding(.vertical, 8)
            .background(.thinMaterial, in: Capsule())
            .padding(.bottom, 32)
#endif
        }
    }

    private var navigationTitle: String {
        if Calendar.current.isDateInToday(viewModel.selectedDate) {
            return "今日"
        }
        return viewModel.selectedDate.formatted(.dateTime.month().day().weekday())
    }

    private var eventList: some View {
        List(viewModel.events) { event in
            NavigationLink {
                EventDetailView(event: event)
            } label: {
                EventRow(
                    event: event,
                    hasEntry: entries.contains { $0.externalEventId == event.id }
                )
            }
        }
        .safeAreaInset(edge: .top) {
            if unwrittenCount > 0 {
                HStack {
                    Text("\(viewModel.events.count)件 · ")
                        .foregroundStyle(.secondary)
                    + Text("\(unwrittenCount)件は日記まだ")
                        .foregroundStyle(.orange)
                }
                .font(.subheadline)
                .frame(maxWidth: .infinity, alignment: .leading)
                .padding(.horizontal)
                .padding(.vertical, 4)
            }
        }
    }

    @ToolbarContentBuilder
    private var toolbarContent: some ToolbarContent {
        ToolbarItem(placement: .topBarTrailing) {
            DatePicker(
                "",
                selection: Binding(
                    get: { viewModel.selectedDate },
                    set: { viewModel.selectDate($0) }
                ),
                displayedComponents: .date
            )
            .labelsHidden()
        }
    }
}

struct EventRow: View {
    let event: AppEvent
    let hasEntry: Bool

    var body: some View {
        HStack(spacing: 12) {
            Text(event.startDate, format: .dateTime.hour().minute())
                .font(.caption.monospacedDigit())
                .foregroundStyle(.secondary)
                .frame(width: 44, alignment: .leading)

            Circle()
                .fill(event.calendarColor.swiftUIColor)
                .frame(width: 8, height: 8)

            VStack(alignment: .leading, spacing: 2) {
                Text(event.title)
                    .font(.body.weight(.medium))

                if let location = event.location, !location.isEmpty {
                    Text(location)
                        .font(.caption)
                        .foregroundStyle(.secondary)
                }
            }

            Spacer()

            if hasEntry {
                Image(systemName: "pencil.line")
                    .font(.caption)
                    .foregroundStyle(.orange)
            }
        }
        .padding(.vertical, 4)
    }
}
