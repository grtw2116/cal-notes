import SwiftUI
#if canImport(FoundationModels)
import FoundationModels
#endif

struct AISettingsView: View {
    @AppStorage("anthropicAPIKey") private var apiKey = ""
    @AppStorage("aiModel") private var model = "claude-haiku-4-5-20251001"

    private let anthropicModels: [(id: String, label: String)] = [
        ("claude-haiku-4-5-20251001", "Claude Haiku 4.5（高速・低コスト）"),
        ("claude-sonnet-4-6",         "Claude Sonnet 4.6（バランス型）"),
    ]

    var body: some View {
        Form {
            // Apple Foundation Model section
            Section {
                appleModelRow
            } header: {
                Text("Apple Foundation Model")
            } footer: {
                Text("オンデバイスで動作するため、API キー不要でプライバシーが保護されます。Apple Intelligence 対応デバイスと iOS 26 以上が必要です。")
            }

            if model != "apple-on-device" {
                Section {
                    Picker("モデル", selection: $model) {
                        ForEach(anthropicModels, id: \.id) { option in
                            Text(option.label).tag(option.id)
                        }
                    }
                } header: {
                    Text("Anthropic モデル")
                }

                Section {
                    SecureField("sk-ant-...", text: $apiKey)
                        .autocorrectionDisabled()
                        .textInputAutocapitalization(.never)
                } header: {
                    Text("Anthropic API キー")
                } footer: {
                    Text("console.anthropic.com でAPIキーを取得できます。")
                }

                if !apiKey.isEmpty {
                    Section {
                        Label("APIキー設定済み", systemImage: "checkmark.circle.fill")
                            .foregroundStyle(.green)
                    }
                }
            }
        }
        .navigationTitle("AI 設定")
    }

    @ViewBuilder
    private var appleModelRow: some View {
        let isSelected = model == "apple-on-device"

#if canImport(FoundationModels)
        if #available(iOS 26, *) {
#if targetEnvironment(simulator)
            HStack {
                Label {
                    VStack(alignment: .leading, spacing: 2) {
                        Text("オンデバイスモデル")
                            .foregroundStyle(.secondary)
                        Text("シミュレータでは動作しません（実機が必要）")
                            .font(.caption)
                            .foregroundStyle(.secondary)
                    }
                } icon: {
                    Image(systemName: "apple.intelligence")
                        .foregroundStyle(.secondary)
                }
            }
            .onAppear {
                if model == "apple-on-device" { model = anthropicModels[0].id }
            }
#else
            let availability = SystemLanguageModel.default.availability
            switch availability {
            case .available:
                Toggle(isOn: Binding(
                    get: { isSelected },
                    set: { model = $0 ? "apple-on-device" : anthropicModels[0].id }
                )) {
                    Label {
                        VStack(alignment: .leading, spacing: 2) {
                            Text("オンデバイスモデルを使用")
                            Text("利用可能")
                                .font(.caption)
                                .foregroundStyle(.green)
                        }
                    } icon: {
                        Image(systemName: "apple.intelligence")
                            .foregroundStyle(.primary)
                    }
                }
            case .unavailable(let reason):
                HStack {
                    Label {
                        VStack(alignment: .leading, spacing: 2) {
                            Text("オンデバイスモデル")
                                .foregroundStyle(.secondary)
                            Text(reason == .appleIntelligenceNotEnabled
                                 ? "Apple Intelligence をオンにしてください"
                                 : "この端末は対応していません")
                                .font(.caption)
                                .foregroundStyle(.orange)
                        }
                    } icon: {
                        Image(systemName: "apple.intelligence")
                            .foregroundStyle(.secondary)
                    }
                }
                .onAppear {
                    if model == "apple-on-device" {
                        model = anthropicModels[0].id
                    }
                }
            }
#endif
        } else {
            HStack {
                Label {
                    VStack(alignment: .leading, spacing: 2) {
                        Text("オンデバイスモデル")
                            .foregroundStyle(.secondary)
                        Text("iOS 26 以上が必要です")
                            .font(.caption)
                            .foregroundStyle(.secondary)
                    }
                } icon: {
                    Image(systemName: "apple.intelligence")
                        .foregroundStyle(.secondary)
                }
            }
        }
#else
        HStack {
            Label {
                VStack(alignment: .leading, spacing: 2) {
                    Text("オンデバイスモデル")
                        .foregroundStyle(.secondary)
                    Text("iOS 26 以上が必要です")
                        .font(.caption)
                        .foregroundStyle(.secondary)
                }
            } icon: {
                Image(systemName: "apple.intelligence")
                    .foregroundStyle(.secondary)
            }
        }
#endif
    }
}
