import SwiftData
import Foundation

@Model
final class JournalEntry {
    var id: UUID
    var externalEventId: String
    var calendarSource: String
    var eventTitleSnapshot: String
    var eventStartSnapshot: Date
    var eventEndSnapshot: Date
    var eventLocationSnapshot: String?
    var body: String
    var tags: [String]
    var mood: String?
    var createdAt: Date
    var updatedAt: Date

    init(
        externalEventId: String,
        calendarSource: String,
        eventTitleSnapshot: String,
        eventStartSnapshot: Date,
        eventEndSnapshot: Date,
        eventLocationSnapshot: String? = nil,
        body: String = ""
    ) {
        self.id = UUID()
        self.externalEventId = externalEventId
        self.calendarSource = calendarSource
        self.eventTitleSnapshot = eventTitleSnapshot
        self.eventStartSnapshot = eventStartSnapshot
        self.eventEndSnapshot = eventEndSnapshot
        self.eventLocationSnapshot = eventLocationSnapshot
        self.body = body
        self.tags = []
        self.mood = nil
        self.createdAt = Date()
        self.updatedAt = Date()
    }
}
