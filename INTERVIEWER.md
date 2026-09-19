# Interviewer Notes — HelpDesk Pro

Do not share this file with the candidate.

## Seeded / intended debugging areas

1. **Stale selected ticket**
   The conversation is derived from selectedId, while filtering can remove the selected ticket. The fallback can silently switch the visible conversation to a different ticket. Candidate should reason about selection state and filtered collections.

2. **Async reply update**
   Reply submission updates the list after a timeout. Rapid status changes around the same ticket can expose stale assumptions about the selected object.

3. **Unmounted timeout**
   The reply flow owns a timer but does not cancel it on unmount. Candidate should notice lifecycle/cleanup concerns.

4. **Global theme mutation**
   Theme is written directly to documentElement. Works for a small app, but introduces global DOM coupling.

5. **Non-functional navigation**
   Sidebar items and New ticket look interactive but intentionally do not implement navigation. Ask candidate to distinguish an actual bug from unfinished functionality instead of "fixing everything".

6. **Derived queue values**
   Counts and filtered rows are derived from the same source, so a candidate should avoid introducing duplicate state while fixing behaviour.

## Suggested interview flow

Start with:
"You inherited this support dashboard. Users report inconsistent behaviour. Reproduce the issues first, explain the root causes, and make the smallest production-safe fixes. Don't rewrite the app."

Good discussion areas:
- state snapshots
- stale closures
- selected IDs vs objects
- effect cleanup
- derived state
- global DOM side effects
- distinguishing bugs from missing features
