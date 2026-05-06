import Foundation
import SwiftData

enum DemoDataSeeder {
    static func seedIfNeeded(container: ModelContainer, now: Date = .now) {
        guard AppEnvironment.usesDemoData else { return }

        let context = ModelContext(container)
        let entryCount = (try? context.fetchCount(FetchDescriptor<JournalEntry>())) ?? 0
        guard entryCount == 0 else { return }

        let demoData = DemoDataFactory.make(referenceDate: now)
        for entry in demoData.entries {
            context.insert(entry)
        }
        for summary in demoData.summaries {
            context.insert(summary)
        }

        try? context.save()
    }
}

enum DemoDataFactory {
    struct Payload {
        let events: [AppEvent]
        let entries: [JournalEntry]
        let summaries: [AISummary]
    }

    static let shared = make(referenceDate: .now)

    static func make(referenceDate: Date) -> Payload {
        let calendar = Calendar(identifier: .gregorian)
        let today = calendar.startOfDay(for: referenceDate)
        let startDate = calendar.date(byAdding: .day, value: -89, to: today) ?? today

        var events: [AppEvent] = []
        var entries: [JournalEntry] = []

        for offset in 0..<90 {
            guard let day = calendar.date(byAdding: .day, value: offset, to: startDate) else { continue }
            let dayEvents = eventsForDay(day, calendar: calendar)
            events.append(contentsOf: dayEvents)
            entries.append(contentsOf: entriesForDay(dayEvents, day: day, today: today, calendar: calendar))
        }

        let summaries = makeSummaries(entries: entries, today: today, calendar: calendar)
        return Payload(events: events, entries: entries, summaries: summaries)
    }

    private static func eventsForDay(_ day: Date, calendar: Calendar) -> [AppEvent] {
        let weekday = calendar.component(.weekday, from: day)
        let weekIndex = calendar.dateComponents([.weekOfYear], from: day).weekOfYear ?? 0
        let dayIndex = calendar.ordinality(of: .day, in: .year, for: day) ?? 0

        if weekday == 1 || weekday == 7 {
            return weekendEvents(day: day, calendar: calendar, weekday: weekday, dayIndex: dayIndex)
        }

        return weekdayEvents(day: day, calendar: calendar, weekIndex: weekIndex, dayIndex: dayIndex)
    }

    private static func weekdayEvents(day: Date, calendar: Calendar, weekIndex: Int, dayIndex: Int) -> [AppEvent] {
        var events: [AppEvent] = []

        events.append(makeEvent(
            id: eventID(day: day, suffix: "commute"),
            title: "通勤しながら今日の計画を整理",
            day: day,
            startHour: 8,
            startMinute: 15,
            durationMinutes: 30,
            location: "丸の内線",
            calendarTitle: "Personal",
            calendarSource: "iCloud",
            color: .personal,
            calendar: calendar
        ))

        let workTemplates: [[(String, Int, Int, String?)]] = [
            [("週次プランニング", 9, 45, "会議室 Cedar"), ("1on1: PM", 11, 30, "Zoom"), ("仕様レビュー", 14, 60, "会議室 Maple"), ("集中作業", 16, 90, nil)],
            [("朝会", 9, 30, "Zoom"), ("デザインレビュー", 10, 60, "会議室 Birch"), ("ランチミーティング", 12, 60, "社内カフェ"), ("実装メモ整理", 15, 90, nil)],
            [("チーム同期", 9, 30, "会議室 Cedar"), ("ユーザーインタビュー振り返り", 11, 45, "Zoom"), ("プロトタイプ確認", 14, 60, "会議室 Elm"), ("次スプリント見積もり", 16, 60, nil)],
            [("バックログ整理", 9, 45, "Zoom"), ("企画壁打ち", 11, 45, "会議室 Maple"), ("実装レビュー", 14, 60, nil), ("リリース準備", 17, 45, nil)],
        ]

        let template = workTemplates[(dayIndex + weekIndex) % workTemplates.count]
        for (index, item) in template.enumerated() {
            events.append(makeEvent(
                id: eventID(day: day, suffix: "work-\(index)"),
                title: item.0,
                day: day,
                startHour: item.1,
                startMinute: 0,
                durationMinutes: item.2,
                location: item.3,
                calendarTitle: "Work",
                calendarSource: "Google",
                color: .work,
                calendar: calendar
            ))
        }

        if dayIndex % 2 == 0 {
            events.append(makeEvent(
                id: eventID(day: day, suffix: "gym"),
                title: "ジムで軽く有酸素",
                day: day,
                startHour: 19,
                startMinute: 15,
                durationMinutes: 50,
                location: "Near Home Gym",
                calendarTitle: "Wellness",
                calendarSource: "iCloud",
                color: .wellness,
                calendar: calendar
            ))
        } else {
            events.append(makeEvent(
                id: eventID(day: day, suffix: "dinner"),
                title: "夕食とメモの整理",
                day: day,
                startHour: 20,
                startMinute: 0,
                durationMinutes: 75,
                location: "自宅",
                calendarTitle: "Personal",
                calendarSource: "iCloud",
                color: .personal,
                calendar: calendar
            ))
        }

        return events
    }

    private static func weekendEvents(day: Date, calendar: Calendar, weekday: Int, dayIndex: Int) -> [AppEvent] {
        var events: [AppEvent] = []

        let saturdayTemplates: [[(String, Int, Int, String?, String, String, EventColor)]] = [
            [("朝ラン", 8, 50, "代々木公園", "Wellness", "iCloud", .wellness), ("ブランチ", 11, 90, "PATH", "Personal", "iCloud", .personal), ("読書タイム", 15, 120, "Blue Bottle", "Personal", "iCloud", .personal)],
            [("ヨガ", 9, 60, "スタジオ Sora", "Wellness", "iCloud", .wellness), ("買い出し", 12, 75, "紀ノ国屋", "Personal", "iCloud", .personal), ("友人と映画", 18, 150, "新宿ピカデリー", "Social", "Google", .social)],
        ]

        let sundayTemplates: [[(String, Int, Int, String?, String, String, EventColor)]] = [
            [("ゆっくり朝食", 9, 60, "自宅", "Personal", "iCloud", .personal), ("家の片付け", 11, 90, "自宅", "Personal", "iCloud", .personal), ("家族と通話", 17, 45, "FaceTime", "Social", "iCloud", .social)],
            [("朝の散歩", 8, 45, "隅田川テラス", "Wellness", "iCloud", .wellness), ("来週の予定整理", 13, 60, "自宅", "Personal", "iCloud", .personal), ("気になる展示を見る", 16, 120, "東京都現代美術館", "Social", "Google", .social)],
        ]

        let template = weekday == 7
            ? saturdayTemplates[dayIndex % saturdayTemplates.count]
            : sundayTemplates[dayIndex % sundayTemplates.count]

        for (index, item) in template.enumerated() {
            events.append(makeEvent(
                id: eventID(day: day, suffix: "weekend-\(index)"),
                title: item.0,
                day: day,
                startHour: item.1,
                startMinute: 0,
                durationMinutes: item.2,
                location: item.3,
                calendarTitle: item.4,
                calendarSource: item.5,
                color: item.6,
                calendar: calendar
            ))
        }

        return events
    }

    private static func entriesForDay(_ events: [AppEvent], day: Date, today: Date, calendar: Calendar) -> [JournalEntry] {
        guard day <= today else { return [] }

        let reflections = [
            "最初は重かったけれど、話し始めると論点が整理されて最後はかなり前に進んだ。次回までに残課題をもう少し言語化しておきたい。",
            "集中できる時間帯に大事な作業を置けたのが良かった。細かい確認が後ろにずれてしまったので、明日は午前中のうちに片付けたい。",
            "予定そのものは短かったのに、その後の余韻が長く残った。思っていたより手応えがあり、気持ちが少し軽くなった。",
            "今日は人と話す予定が多くて疲れたが、視点を借りられたおかげで迷っていた部分がかなりクリアになった。",
            "慌ただしかった分、メモを残しておいて助かった。次に同じテーマを扱うときの入口ができた感じがする。",
            "期待していたほどではなかったが、進め方の癖に気づけたのは収穫だった。余白を作る大切さをまた実感した。"
        ]

        let tagsPool = [
            ["仕事", "設計"], ["振り返り"], ["集中"], ["生活"], ["運動"], ["会話"], ["改善"], ["学び"], ["調整"], ["休息"]
        ]
        let moods = ["🤩", "😊", "😊", "😐", "😔"]

        return events.compactMap { event in
            let numericSuffix = Int(event.id.split(separator: "-").last ?? "") ?? 0
            let keepEntry = (numericSuffix + calendar.component(.day, from: day)) % 4 != 0
            guard keepEntry else { return nil }

            let entry = JournalEntry(
                externalEventId: event.id,
                calendarSource: event.calendarSource,
                eventTitleSnapshot: event.title,
                eventStartSnapshot: event.startDate,
                eventEndSnapshot: event.endDate,
                eventLocationSnapshot: event.location,
                body: journalBody(for: event, reflection: reflections[(numericSuffix + calendar.component(.weekday, from: day)) % reflections.count])
            )
            entry.tags = tagsPool[(numericSuffix + calendar.component(.weekOfYear, from: day)) % tagsPool.count]
            entry.mood = moods[(numericSuffix + calendar.component(.weekday, from: day)) % moods.count]
            entry.createdAt = calendar.date(byAdding: .minute, value: 40, to: event.endDate) ?? event.endDate
            entry.updatedAt = calendar.date(byAdding: .minute, value: 65, to: event.endDate) ?? event.endDate
            return entry
        }
    }

    private static func journalBody(for event: AppEvent, reflection: String) -> String {
        switch event.calendarTitle {
        case "Work":
            return "\(event.title)では、相手が気にしている前提を先に揃えることを意識した。\(reflection)"
        case "Wellness":
            return "\(event.title)のあと、体の重さが少し抜けて頭も切り替わった。\(reflection)"
        case "Social":
            return "\(event.title)で、最近考えていたことを自然に話せた。\(reflection)"
        default:
            return "\(event.title)の時間がいい区切りになった。\(reflection)"
        }
    }

    private static func makeSummaries(entries: [JournalEntry], today: Date, calendar: Calendar) -> [AISummary] {
        guard let currentWeek = calendar.dateInterval(of: .weekOfYear, for: today) else { return [] }
        var summaries: [AISummary] = []

        for weekOffset in 0..<4 {
            guard
                let weekStart = calendar.date(byAdding: .weekOfYear, value: -weekOffset, to: currentWeek.start),
                let weekEnd = calendar.date(byAdding: .day, value: 7, to: weekStart)
            else {
                continue
            }

            let weeklyEntries = entries.filter { $0.eventStartSnapshot >= weekStart && $0.eventStartSnapshot < weekEnd }
            guard !weeklyEntries.isEmpty else { continue }

            let summaryText = weeklySummaryText(for: weeklyEntries, weekStart: weekStart)
            let summary = AISummary(
                rangeStart: weekStart,
                rangeEnd: weekEnd,
                summaryType: "weekly",
                sourceEntryIds: weeklyEntries.map(\.id),
                body: summaryText
            )
            summary.createdAt = calendar.date(byAdding: .hour, value: 20, to: weekEnd) ?? weekEnd
            summaries.append(summary)
        }

        return summaries
    }

    private static func weeklySummaryText(for entries: [JournalEntry], weekStart: Date) -> String {
        let workCount = entries.filter { $0.calendarSource == "Google" }.count
        let personalCount = entries.count - workCount
        let topTags = Dictionary(grouping: entries.flatMap(\.tags), by: { $0 })
            .mapValues(\.count)
            .sorted { $0.value > $1.value }
            .prefix(3)
            .map(\.key)

        let tagsText = topTags.isEmpty ? "記録の粒度はまだ軽め" : "目立ったテーマは \(topTags.joined(separator: " / "))"
        return "\(weekStart.formatted(.dateTime.month().day()))週は \(entries.count) 件の記録。仕事由来が \(workCount) 件、生活・私用が \(personalCount) 件で、忙しさの中でも小さく振り返る習慣は維持できていた。\(tagsText) で、全体としては無理をしすぎず進め方を整えていた週。"
    }

    private static func makeEvent(
        id: String,
        title: String,
        day: Date,
        startHour: Int,
        startMinute: Int,
        durationMinutes: Int,
        location: String?,
        calendarTitle: String,
        calendarSource: String,
        color: EventColor,
        calendar: Calendar
    ) -> AppEvent {
        let startDate = calendar.date(bySettingHour: startHour, minute: startMinute, second: 0, of: day) ?? day
        let endDate = calendar.date(byAdding: .minute, value: durationMinutes, to: startDate) ?? startDate
        return AppEvent(
            id: id,
            title: title,
            startDate: startDate,
            endDate: endDate,
            location: location,
            calendarTitle: calendarTitle,
            calendarSource: calendarSource,
            calendarColor: color
        )
    }

    private static func eventID(day: Date, suffix: String) -> String {
        let formatter = DateFormatter()
        formatter.calendar = Calendar(identifier: .gregorian)
        formatter.locale = Locale(identifier: "en_US_POSIX")
        formatter.dateFormat = "yyyyMMdd"
        return "demo-\(formatter.string(from: day))-\(suffix)"
    }
}
