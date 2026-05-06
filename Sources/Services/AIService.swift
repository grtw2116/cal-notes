import Foundation
#if canImport(FoundationModels)
import FoundationModels
#endif

// MARK: - Protocol

protocol AIService {
    func generateWeeklySummary(entries: [JournalEntry], weekStart: Date) async throws -> String
    func generateWritingPrompts(eventTitle: String, startDate: Date, location: String?) async throws -> String
}

// MARK: - Factory

func makeAIService(model: String, apiKey: String) throws -> any AIService {
    if model == "apple-on-device" {
#if canImport(FoundationModels)
        if #available(iOS 26, *) {
            return AppleFoundationModelService()
        }
#endif
        throw AIError.appleModelUnavailable
    }
    guard !apiKey.isEmpty else { throw AIError.missingAPIKey }
    return AnthropicAIService(apiKey: apiKey, model: model)
}

// MARK: - Anthropic

final class AnthropicAIService: AIService {
    private let apiKey: String
    private let model: String
    private let endpoint = URL(string: "https://api.anthropic.com/v1/messages")!

    init(apiKey: String, model: String = "claude-haiku-4-5-20251001") {
        self.apiKey = apiKey
        self.model = model
    }

    func generateWeeklySummary(entries: [JournalEntry], weekStart: Date) async throws -> String {
        let prompt = Prompts.weeklySummaryPrompt(entries: entries, weekStart: weekStart)
        return try await call(prompt: prompt)
    }

    func generateWritingPrompts(eventTitle: String, startDate: Date, location: String?) async throws -> String {
        let prompt = Prompts.writingPromptsPrompt(eventTitle: eventTitle, startDate: startDate, location: location)
        return try await call(prompt: prompt)
    }

    private func call(prompt: String) async throws -> String {
        var request = URLRequest(url: endpoint)
        request.httpMethod = "POST"
        request.setValue(apiKey, forHTTPHeaderField: "x-api-key")
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        request.setValue("2023-06-01", forHTTPHeaderField: "anthropic-version")

        let body: [String: Any] = [
            "model": model,
            "max_tokens": 1024,
            "messages": [["role": "user", "content": prompt]],
        ]
        request.httpBody = try JSONSerialization.data(withJSONObject: body)

        let (data, response) = try await URLSession.shared.data(for: request)

        guard let http = response as? HTTPURLResponse else { throw AIError.invalidResponse }
        guard http.statusCode == 200 else {
            if let err = try? JSONDecoder().decode(AnthropicErrorResponse.self, from: data) {
                throw AIError.apiError(err.error.message)
            }
            throw AIError.httpError(http.statusCode)
        }

        let decoded = try JSONDecoder().decode(AnthropicResponse.self, from: data)
        return decoded.content.first?.text ?? ""
    }
}

// MARK: - Apple Foundation Model

#if canImport(FoundationModels)
@available(iOS 26, *)
final class AppleFoundationModelService: AIService {

    func generateWeeklySummary(entries: [JournalEntry], weekStart: Date) async throws -> String {
        try ensureAvailable()
        let session = LanguageModelSession(
            instructions: "日本語で簡潔に回答してください。"
        )
        let prompt = Prompts.weeklySummaryPrompt(entries: entries, weekStart: weekStart)
        let response = try await session.respond(to: prompt)
        return response.content
    }

    func generateWritingPrompts(eventTitle: String, startDate: Date, location: String?) async throws -> String {
        try ensureAvailable()
        let session = LanguageModelSession(
            instructions: "日本語で番号付きリストで3つ提案してください。"
        )
        let prompt = Prompts.writingPromptsPrompt(eventTitle: eventTitle, startDate: startDate, location: location)
        let response = try await session.respond(to: prompt)
        return response.content
    }

    private func ensureAvailable() throws {
#if targetEnvironment(simulator)
        throw AIError.appleModelSimulator
#else
        guard case .available = SystemLanguageModel.default.availability else {
            throw AIError.appleModelUnavailable
        }
#endif
    }
}
#endif

// MARK: - Shared prompt builders (used by both services)

private enum Prompts {
    static func weeklySummaryPrompt(entries: [JournalEntry], weekStart: Date) -> String {
        let cal = Calendar.current
        let weekEnd = cal.date(byAdding: .weekOfYear, value: 1, to: weekStart)!
        let fmt = DateFormatter()
        fmt.dateStyle = .medium
        fmt.locale = Locale(identifier: "ja_JP")

        let entriesText: String
        if entries.isEmpty {
            entriesText = "（この週のエントリはありません）"
        } else {
            entriesText = entries.map { entry in
                var parts = ["【\(fmt.string(from: entry.eventStartSnapshot)) \(entry.eventTitleSnapshot)】"]
                if let mood = entry.mood { parts.append("気分: \(mood)") }
                if !entry.tags.isEmpty { parts.append("タグ: \(entry.tags.joined(separator: ", "))") }
                if !entry.body.isEmpty { parts.append(entry.body) }
                return parts.joined(separator: " ")
            }.joined(separator: "\n\n")
        }

        return """
        以下は \(fmt.string(from: weekStart)) 〜 \(fmt.string(from: weekEnd)) の日記エントリです。
        日本語で300字程度にまとめた週次サマリーを生成してください。
        主な出来事、気分の傾向、よく出てきたテーマを含めてください。

        \(entriesText)
        """
    }

    static func writingPromptsPrompt(eventTitle: String, startDate: Date, location: String? = nil) -> String {
        let fmt = DateFormatter()
        fmt.dateStyle = .medium
        fmt.timeStyle = .short
        fmt.locale = Locale(identifier: "ja_JP")

        var context = "予定名: \(eventTitle)\n日時: \(fmt.string(from: startDate))"
        if let loc = location, !loc.isEmpty { context += "\n場所: \(loc)" }

        return """
        以下の予定について、日記を書き始めるきっかけになる質問や書き出し文を3つ提案してください。
        番号付きリストで、具体的で振り返りやすい内容にしてください。

        \(context)
        """
    }
}

// MARK: - Response types (Anthropic)

private struct AnthropicResponse: Decodable {
    let content: [ContentBlock]
    struct ContentBlock: Decodable {
        let type: String
        let text: String
    }
}

private struct AnthropicErrorResponse: Decodable {
    let error: ErrorDetail
    struct ErrorDetail: Decodable {
        let message: String
    }
}

// MARK: - Error

enum AIError: LocalizedError {
    case missingAPIKey
    case invalidResponse
    case httpError(Int)
    case apiError(String)
    case appleModelUnavailable
    case appleModelSimulator

    var errorDescription: String? {
        switch self {
        case .missingAPIKey:
            return "APIキーが設定されていません。設定から入力してください。"
        case .invalidResponse:
            return "無効なレスポンスを受信しました。"
        case .httpError(let c):
            return "HTTPエラー: \(c)"
        case .apiError(let m):
            return "APIエラー: \(m)"
        case .appleModelUnavailable:
            return "Apple Foundation Modelはこの端末またはOSバージョンでは利用できません。"
        case .appleModelSimulator:
            return "Apple Foundation Modelはシミュレータでは動作しません。実機でお試しください。"
        }
    }
}
