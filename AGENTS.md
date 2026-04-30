# CLAUDE.md

This repository contains the product and implementation planning for `cal-notes`.

## Project Intent

Build a native Apple journal app that is linked to calendar events.

Primary targets:

- `iOS`
- `iPadOS`
- `macOS`

Core product idea:

- show calendar events
- let the user write journal entries per event
- summarize entries with AI
- expose read/write access through MCP

## Source Of Truth

Before making implementation decisions, read:

1. `README.md`
2. `docs/requirements.md`
3. `docs/roadmap.md`

Treat those documents as the current product source of truth unless the user explicitly overrides them.

## Implementation Priorities

1. Build the native Apple app first
2. Prefer `Swift`, `SwiftUI`, and `Xcode`
3. Use `EventKit` for calendar access before considering direct Google Calendar API integration
4. Keep the app local-first in early phases
5. Keep MCP as a separate concern from the main app process
6. Web is lower priority than native platforms

## Suggested Architecture Direction

- App UI: `SwiftUI`
- Persistence: prefer `SwiftData`, fallback to `Core Data` if needed
- Calendar integration: `EventKit`
- AI integration: external API with a replaceable abstraction
- MCP server: may be implemented separately, including in `TypeScript`, if that improves iteration speed

## Working Agreements

- Preserve the product direction unless the user changes it
- Prefer small, incremental milestones
- Keep docs updated when requirements or architecture change
- Separate product requirements from implementation notes
- When a decision is still open, record it explicitly instead of hiding it in code

## Expected Early Deliverables

- Xcode project scaffold
- Calendar permission flow
- event list screen
- event detail screen
- journal entry persistence
- basic weekly summary generation

## Open Questions To Respect

The following are intentionally not fully decided yet:

- `SwiftData` vs `Core Data`
- Swift MCP vs TypeScript MCP
- one journal entry per event vs multiple entries per event
- exact AI provider and model choices

Do not collapse these decisions prematurely unless the user asks for a concrete choice.
