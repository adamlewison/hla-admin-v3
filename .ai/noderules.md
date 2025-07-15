### Project Awareness & Context

- ⁠Always read 'PLANNING.md' at the start of a new conversation to understand the project's architecture, goals, style, and constraints.
- refer to the database using the supabase mcp.
- ⁠Use consistent naming conventions, file structure, and architecture patterns\* as described in 'PLANNING.md.
- Use the database structure as defined in 'db.sql'

### Code Structure & Modularity

- ⁠*Never create a file longer than 500 lines of code.* If a file approaches this limit, refactor by splitting it into components or helper files.
- ⁠*Organize code into clearly separated components*, grouped by feature or responsibility.

### Documentation & Explainability

- ⁠*Update 'README.md'* when new features are added, dependencies change, or setup steps are modified.
- ⁠*Comment non-obvious code* and ensure everything is understandable to a mid-level developer.
- When writing complex logic, _add an inline ' Reason:' comment_ explaining the why, not just the what.

### AI Behavior Rules

- When creating UI: always: design stunning and elegant UI. Must be modern and clean. I encourage web searches to disover the best methods to creating modern and beautiful UI specifically with the technologies created.
- ⁠Never assume missing context. Ask questions if uncertain.
- Never hallucinate libraries or functions. Search the web to make sure you are using things correctly.
- ⁠*Always confirm file paths and module names* exist before referencing them in code or tests.
- Search the web how to properly use Supabase. There is a new way of implementing supabase. Make sure you use the new way.
- Search the web to make sure you use Tailwind 4 correctly

