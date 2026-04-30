# cal-notes

カレンダーと連動した日記アプリ。

## Overview

`cal-notes` は、カレンダー予定ごとに日記を書ける Apple ネイティブアプリです。  
まずは個人利用を前提に、`iOS` / `iPadOS` / `macOS` 向けの Swift アプリとして開発します。

コア体験:

- カレンダーの予定を一覧・詳細で見る
- 予定ごとに日記エントリを書く
- 日記内容を AI で要約・整理する
- MCP 経由で外部エージェントから参照・更新する

## Documents

- 要件・MVP・技術方針: [docs/requirements.md](/Users/grtw2116/Developer/github.com/grtw2116/cal-notes/docs/requirements.md)
- 実装ロードマップ: [docs/roadmap.md](/Users/grtw2116/Developer/github.com/grtw2116/cal-notes/docs/roadmap.md)
- Claude Code 向け作業ガイド: [CLAUDE.md](/Users/grtw2116/Developer/github.com/grtw2116/cal-notes/CLAUDE.md)

## Initial Technical Direction

- App platform: `SwiftUI` + `Xcode`
- Targets: `iOS`, `iPadOS`, `macOS`
- Calendar integration: `EventKit`
- Local persistence: `SwiftData` を第一候補
- AI integration: 外部 API 連携
- MCP: アプリ本体とは分離したローカル MCP サーバ

## Status

現在は仕様策定フェーズです。  
実装開始時は `docs/requirements.md` と `docs/roadmap.md` を正本として扱います。
