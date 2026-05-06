import Foundation
import SwiftData

enum AppEnvironment {
    #if DEMO_DATA
    static let usesDemoData = true
    #else
    static let usesDemoData = false
    #endif
}

enum AppModelContainer {
    static func make() -> ModelContainer {
        do {
            return try ModelContainer(for: JournalEntry.self, AISummary.self)
        } catch {
            fatalError("Failed to create model container: \(error)")
        }
    }
}
