import EventKit
import Foundation

@Observable
final class CalendarService {
    private let store = EKEventStore()
    private(set) var authorizationStatus: EKAuthorizationStatus = .notDetermined

    func requestAccess() async throws {
        authorizationStatus = EKEventStore.authorizationStatus(for: .event)
        guard authorizationStatus != .fullAccess else { return }

        let granted = try await store.requestFullAccessToEvents()
        authorizationStatus = EKEventStore.authorizationStatus(for: .event)
        if !granted {
            throw CalendarError.accessDenied
        }
    }

    func events(for date: Date) -> [EKEvent] {
        let cal = Calendar.current
        let start = cal.startOfDay(for: date)
        let end = cal.date(byAdding: .day, value: 1, to: start)!
        let predicate = store.predicateForEvents(withStart: start, end: end, calendars: nil)
        return store.events(matching: predicate).sorted { $0.startDate < $1.startDate }
    }

#if DEBUG
    func insertTestEvents() async {
        let cal = Calendar.current
        let today = cal.startOfDay(for: Date())
        let defaultCalendar = store.defaultCalendarForNewEvents

        let testData: [(String, Int, Int, String?)] = [
            ("朝のラン",       7, 60, "皇居"),
            ("デザインレビュー", 10, 60, "オフィス会議室B"),
            ("ランチ @ Bear Pond", 13, 60, nil),
            ("英会話レッスン",  19, 30, nil),
        ]

        for (title, startHour, duration, location) in testData {
            let event = EKEvent(eventStore: store)
            event.title = title
            event.startDate = cal.date(byAdding: .hour, value: startHour, to: today)!
            event.endDate   = cal.date(byAdding: .minute, value: duration, to: event.startDate)!
            event.location  = location
            event.calendar  = defaultCalendar
            try? store.save(event, span: .thisEvent)
        }
    }
#endif

    enum CalendarError: LocalizedError {
        case accessDenied

        var errorDescription: String? {
            "カレンダーへのアクセスが拒否されました。設定アプリから許可してください。"
        }
    }
}
