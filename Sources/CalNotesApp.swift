import SwiftUI
import SwiftData

@main
struct CalNotesApp: App {
    private let modelContainer = AppModelContainer.make()

    init() {
        DemoDataSeeder.seedIfNeeded(container: modelContainer)
    }

    var body: some Scene {
        WindowGroup {
            ContentView()
        }
        .modelContainer(modelContainer)
    }
}
