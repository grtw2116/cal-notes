import SwiftData
import Foundation

@Model
final class AISummary {
    var id: UUID
    var rangeStart: Date
    var rangeEnd: Date
    var summaryType: String
    var sourceEntryIds: [UUID]
    var body: String
    var createdAt: Date

    init(rangeStart: Date, rangeEnd: Date, summaryType: String, sourceEntryIds: [UUID], body: String) {
        self.id = UUID()
        self.rangeStart = rangeStart
        self.rangeEnd = rangeEnd
        self.summaryType = summaryType
        self.sourceEntryIds = sourceEntryIds
        self.body = body
        self.createdAt = Date()
    }
}
