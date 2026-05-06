import Foundation
import SwiftUI

struct AppEvent: Identifiable, Hashable {
    let id: String
    let title: String
    let startDate: Date
    let endDate: Date
    let location: String?
    let calendarTitle: String
    let calendarSource: String
    let calendarColor: EventColor
}

struct EventColor: Hashable {
    let red: Double
    let green: Double
    let blue: Double

    var swiftUIColor: Color {
        Color(red: red, green: green, blue: blue)
    }

    static let work = EventColor(red: 0.17, green: 0.50, blue: 0.93)
    static let personal = EventColor(red: 0.98, green: 0.56, blue: 0.20)
    static let wellness = EventColor(red: 0.20, green: 0.71, blue: 0.47)
    static let social = EventColor(red: 0.78, green: 0.29, blue: 0.68)
}
