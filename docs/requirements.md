# Requirements

## Product Summary

`cal-notes` は、カレンダー予定に紐づけて記録する日記アプリである。  
ユーザーは日々の予定単位でメモや振り返りを書き、あとから日・週・月単位で見返せる。  
AI は日記本文や行動履歴をもとにサマリー生成、トピック抽出、振り返り支援を行う。

初期ターゲットは個人利用。  
プライバシーやマルチユーザー設計は後続フェーズで強化する。

## Goals

- カレンダー予定ごとに日記を書ける体験を提供する
- iCloud / Google を含む既存カレンダー予定を土台に使えるようにする
- 日記を AI で要約し、振り返りしやすくする
- MCP 経由で外部エージェントから読み書き可能にする
- Apple ネイティブアプリとして軽快に使えるようにする

## Non-Goals For MVP

- 公開サービス向けの厳密な権限設計
- 複数ユーザー対応
- 高度な共同編集
- Web 版の先行開発
- Google Calendar API との直接同期

## Target Platforms

- Primary: `iOS`, `iPadOS`, `macOS`
- Secondary: Web app (low priority, post-MVP)

## Core User Stories

1. ユーザーは、今日の予定一覧を見て各予定に日記を書ける。
2. ユーザーは、過去の予定を開いてあとから日記を追記・修正できる。
3. ユーザーは、日記が書かれている予定と未記入の予定を区別できる。
4. ユーザーは、1日・1週間・1か月単位で日記を振り返れる。
5. ユーザーは、AI によるサマリーや傾向整理を確認できる。
6. ユーザーは、Claude などの外部エージェントから MCP 経由で日記を参照・更新できる。

## Functional Requirements

### 1. Calendar Integration

- 端末上で利用可能なカレンダー予定を取得できること
- 予定のタイトル、開始・終了時刻、場所、メモ、カレンダー種別を参照できること
- 初期実装は `EventKit` を利用すること
- `iCloud` と `Google` は OS のカレンダー統合経由で扱うことを前提とする

### 2. Journal Entry

- 各予定に対して 0 件または 1 件以上の日記エントリを紐づけられること
- 日記エントリは本文、作成日時、更新日時を保持すること
- 将来的な拡張のため、タグ、感情、添付情報を保持できる余地を残すこと
- 予定が変更されても、日記側に最低限のスナップショット情報を保持すること

### 3. Views And Navigation

- 今日の予定一覧を表示できること
- 日付単位の予定一覧を表示できること
- 予定詳細と日記編集画面を表示できること
- 日記の有無が一覧上でわかること
- 週次・月次の振り返り画面を将来追加しやすい構成であること

### 4. AI Features

- 日記本文を入力としてサマリー生成できること
- 一定期間の日記をまとめて週次・月次サマリーを生成できること
- 将来、タグ抽出・感情分類・質問生成を追加できること
- AI 処理結果はローカル DB に保存できること

### 5. MCP Integration

- 外部クライアントが予定一覧を取得できること
- 外部クライアントが特定予定の日記を参照できること
- 外部クライアントが日記を作成・更新できること
- 一定期間の日記を検索または要約できること
- MCP はアプリ本体と分離したプロセスでもよい

## Non-Functional Requirements

### Performance

- 今日の予定一覧は日常利用で待ちを感じにくいこと
- 日記本文の保存は即時反映に近いこと

### Reliability

- カレンダー取得に失敗しても、保存済み日記は閲覧できること
- AI 要約失敗時も元の日記は保持されること

### Privacy

- MVP では個人利用前提とし、厳密な公開向け対策は後回しとする
- ただし、将来の公開に向けてデータ境界を壊しにくい構造にする

### Maintainability

- アプリ本体、AI 連携、MCP 連携の責務を分離する
- 仕様と実装方針をドキュメントで追える状態にする

## Recommended Technical Direction

### App

- Language: `Swift`
- UI: `SwiftUI`
- IDE: `Xcode`
- Architecture baseline: feature-oriented MVVM or The Composable Architecture compatible structure

### Persistence

- First choice: `SwiftData`
- Fallback if needed: `Core Data`

### Calendar Access

- `EventKit`

### AI Integration

- 外部 API を利用
- API キー管理とモデル切り替えは設定画面またはローカル設定ファイルで扱えるようにする

### MCP

- 候補 1: `Swift` 実装
- 候補 2: `TypeScript` 実装
- MVP 時点では開発速度を優先して TypeScript 実装も許容する

## Proposed Data Model

### JournalEntry

- `id`
- `externalEventId`
- `calendarSource`
- `eventTitleSnapshot`
- `eventStartSnapshot`
- `eventEndSnapshot`
- `eventLocationSnapshot`
- `body`
- `tags`
- `mood`
- `createdAt`
- `updatedAt`

### AISummary

- `id`
- `rangeStart`
- `rangeEnd`
- `summaryType`
- `sourceEntryIds`
- `body`
- `createdAt`

## MVP Scope

MVP に含めるもの:

- カレンダー権限取得
- 今日/日付単位の予定一覧
- 予定詳細表示
- 予定ごとの日記作成・更新
- ローカル保存
- 週次サマリー生成の最小実装

MVP に含めないもの:

- Web 版
- 共同利用
- 高度な全文検索
- 添付ファイル管理
- 洗練された通知設計

## Open Decisions

- 永続化を `SwiftData` にするか `Core Data` にするか
- AI 連携先を何にするか
- MCP サーバを Swift で作るか TypeScript で作るか
- 日記を「予定ごとに 1 件固定」にするか「複数件許可」にするか

## Suggested First Build Order

1. SwiftUI マルチプラットフォームアプリを作成する
2. `EventKit` で予定取得を実装する
3. `JournalEntry` 保存を実装する
4. 今日の予定一覧と日記編集画面を作る
5. AI サマリーの最小実装を追加する
6. MCP 連携を追加する
