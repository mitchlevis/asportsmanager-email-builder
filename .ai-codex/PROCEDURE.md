# PROCEDURE.md — How to Update This Codex

## When to run this
Run this procedure when you are done making code changes and are ready to commit.
**Do not run `git add` or `git commit` yourself — this procedure handles that.**

---

## Step 1: Review what changed

```bash
git diff
```

Read through the diff carefully. This is your source of truth for what needs updating in the codex.

---

## Step 2: Update the relevant codex files

### Update `pages.md` if the diff shows:
- A new page file added in `app/pages/`
- A page file deleted or renamed
- A meaningful change to what a page does or which layout it uses

**How:** Find the affected row and update it. Add a new row for new pages. Remove the row for deleted pages.

### Update `components.md` if the diff shows:
- A new component added in `app/components/`
- A component deleted or renamed
- A significant change to a component's props, slots, or purpose

**How:** Find the affected row and update it. Add a new row for new components. Remove the row for deleted components.

### Update `composables.md` if the diff shows:
- A new composable or store added in `app/composables/`
- A composable deleted or renamed
- New state, actions, or getters added/removed from an existing store

**How:** Update the relevant store section with new/changed state and methods.

### Update `utils.md` if the diff shows:
- A new utility file added in `app/utils/`
- A utility deleted or renamed
- A meaningful change to an exported function's signature or behaviour

**How:** Find the affected row and update it. Add a new row for new utils. Remove the row for deleted utils.

### Update `gotchas.md` if:
- You discovered a non-obvious behaviour that would trip up future developers or AI agents
- A previously documented gotcha is no longer relevant (remove it)
- A workaround was found for a known issue (update the entry)

---

## Step 3: Stage and commit everything together

```bash
git add -A
git commit -m "<your commit message describing the code change>"
```

The commit message should describe the **code change**, not the codex update.
Example: `feat: add email template CRUD integration`
Not: `chore: update codex`

The codex files ride along in the same commit automatically.

---

## What NOT to update
- Do not update for cosmetic changes (comments, formatting, string tweaks)
- Do not update for email template content changes (sample template text, etc.)
- Do not update for style-only changes (CSS tweaks within existing components)
- Do not rewrite entire sections — surgical updates only
