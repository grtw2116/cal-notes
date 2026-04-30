# Roadmap

## Phase 0: Project Setup

- Xcode プロジェクトを作成する
- `iOS`, `iPadOS`, `macOS` のターゲット構成を決める
- 最低限のディレクトリ構成を定義する
- 開発用ドキュメントを整備する

## Phase 1: Calendar-Linked Journal MVP

- `EventKit` 権限取得
- 今日の予定一覧
- 日付別の予定一覧
- 予定詳細画面
- 予定ごとの日記作成・更新
- ローカル永続化

完了条件:

- 予定を選んで日記を書き、再起動後も残る

## Phase 2: Reflection Features

- 日記一覧
- 週次サマリー
- 月次サマリー
- タグや感情などの軽量メタデータ

完了条件:

- 一定期間のエントリを振り返れる

## Phase 3: AI Assistance

- AI サマリー生成
- トピック抽出
- 日記の書き出し補助
- 将来拡張用の AI 抽象化レイヤ

完了条件:

- 週次サマリーが自動または手動で生成できる

## Phase 4: MCP

- MCP サーバの最小実装
- `list_events`
- `get_entry`
- `upsert_entry`
- `search_entries`
- `summarize_range`

完了条件:

- Claude などのクライアントから日記参照・更新ができる

## Phase 5: Public-Ready Hardening

- プライバシーと権限境界の整理
- データエクスポート/バックアップ
- エラーハンドリング強化
- 公開に向けた設計見直し

## Nice To Have

- Web 版
- 添付画像
- 音声入力
- 検索性改善
- 日記からカレンダーへの逆参照強化
