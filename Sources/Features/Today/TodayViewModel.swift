import Foundation
import EventKit

@Observable
final class TodayViewModel {
    var events: [EKEvent] = []
    var selectedDate: Date = .now
    var isLoading = false
    var accessError: Error?

    private let calendarService: CalendarService

    init(calendarService: CalendarService = CalendarService()) {
        self.calendarService = calendarService
    }

    func onAppear() async {
        isLoading = true
        defer { isLoading = false }

        do {
            try await calendarService.requestAccess()
            loadEvents()
        } catch {
            accessError = error
        }
    }

    func selectDate(_ date: Date) {
        selectedDate = date
        loadEvents()
    }

    private func loadEvents() {
        events = calendarService.events(for: selectedDate)
    }

#if DEBUG
    func insertTestEvents() async {
        try? await calendarService.requestAccess()
        await calendarService.insertTestEvents()
        loadEvents()
    }
#endif
}
