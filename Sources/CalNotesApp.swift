import SwiftUI
import SwiftData

@main
struct CalNotesApp: App {
    var body: some Scene {
        WindowGroup {
            TodayView()
        }
        .modelContainer(for: JournalEntry.self)
    }
}
