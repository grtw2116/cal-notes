import SwiftUI

struct ContentView: View {
    var body: some View {
        TabView {
            TodayView()
                .tabItem { Label("今日", systemImage: "calendar") }
            JournalListView()
                .tabItem { Label("日記", systemImage: "book.closed") }
            SummaryView()
                .tabItem { Label("まとめ", systemImage: "chart.bar") }
            NavigationStack {
                AISettingsView()
            }
            .tabItem { Label("設定", systemImage: "gearshape") }
        }
    }
}
