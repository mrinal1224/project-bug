# Interviewer-only bug map

1. Save race/stale state: immediately saving after a status update can persist the previous render's tasks because React state is asynchronous.
2. Reset persistence mismatch: Reset changes React state but does not remove the old localStorage snapshot, so refresh restores it.
3. Stale modal object: selectedTask stores an entire task object. If that task changes elsewhere while modal is open, modal can render/act on stale data. Store an id and derive from tasks instead.
4. Theme global coupling: theme is applied via document.body.dataset.theme. It works but couples local state to global DOM instead of making the rendered tree authoritative.

Suggested prompt:
"You inherited this dashboard from another engineer. Users report inconsistent behaviour. Reproduce the problems, find the root causes, make the smallest safe fixes, and explain your reasoning. Don't rewrite the app."
