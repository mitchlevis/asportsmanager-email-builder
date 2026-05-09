# Repeater Block -- Backend Loop Implementation Spec

## Overview

The email builder now supports a **Repeater** block that allows template authors to define a section of the email that repeats once per item in a data array. The builder outputs HTML with loop syntax markers that the backend must parse and expand at send time. Nested repeaters are supported.

## Template Syntax

### Loop Tags

The Repeater block wraps its children's HTML in a loop directive:

```
{{#each variableName}}
  ...repeated HTML content...
{{/each}}
```

- `{{#each variableName}}` opens the loop, where `variableName` matches a key in the `templateData` object (or a property of the current item for nested loops).
- `{{/each}}` closes the loop.
- Everything between the tags is rendered once per item in the array.

### Item References

Inside the loop body, the template uses the **variable name** as the prefix to reference the current array element:

| Syntax | Use Case | Example |
|---|---|---|
| `{{variableName}}` | Simple arrays of strings/numbers | `["Matt", "Mitch"]` |
| `{{variableName.field}}` | Object arrays, accessing a property | `[{"name": "Matt", "position": "Bases"}]` |

For example, a repeater with `dataVariable = "positions"` uses `{{positions.name}}` and `{{positions.position}}` to reference fields of each item.

### Full Example

**Template HTML (stored in `HtmlEn` / `HtmlFr`):**

```html
<p>Here are the assigned positions:</p>
{{#each positions}}
<div style="padding:16px 24px">
  <table width="100%" cellpadding="0" border="0" style="table-layout:fixed">
    <tr>
      <td><p><strong>Referee:</strong> {{positions.name}}</p></td>
      <td><p><strong>Position:</strong> {{positions.position}}</p></td>
    </tr>
  </table>
</div>
{{/each}}
<p>Thank you!</p>
```

**Template data passed at send time:**

```json
{
  "positions": [
    { "name": "Matt", "position": "Bases" },
    { "name": "Mitch", "position": "3rd Base" }
  ],
  "other_var": "some value"
}
```

**Expected rendered output:**

```html
<p>Here are the assigned positions:</p>
<div style="padding:16px 24px">
  <table width="100%" cellpadding="0" border="0" style="table-layout:fixed">
    <tr>
      <td><p><strong>Referee:</strong> Matt</p></td>
      <td><p><strong>Position:</strong> Bases</p></td>
    </tr>
  </table>
</div>
<div style="padding:16px 24px">
  <table width="100%" cellpadding="0" border="0" style="table-layout:fixed">
    <tr>
      <td><p><strong>Referee:</strong> Mitch</p></td>
      <td><p><strong>Position:</strong> 3rd Base</p></td>
    </tr>
  </table>
</div>
<p>Thank you!</p>
```

## Nested Loops

Repeater blocks can be nested. Each nesting level uses its own unique `dataVariable` name, so there is no ambiguity between levels.

### How Nesting Works

- The **outer** repeater iterates over a top-level array in `templateData` (e.g., `games`).
- The **inner** repeater uses a dotted path as its `dataVariable` (e.g., `games.assignments`), indicating it iterates over the `assignments` sub-array of each outer item.
- The `{{#each}}` tag uses the full dotted path: `{{#each games.assignments}}`.
- To resolve the array, the backend strips the parent prefix (`games.`) and looks up `assignments` on the current outer item.
- Each level references its fields using its own full variable name: `{{games.league}}` for the outer, `{{games.assignments.position}}` for the inner.

### Nested Example

**Template HTML:**

```html
<p>Your upcoming assignments:</p>
{{#each games}}
<div style="padding:16px 24px">
  <strong>{{games.league}} | {{games.gameType}} #{{games.gameNumber}}</strong><br>
  {{games.location}}<br>
  {{games.date}} {{games.time}}<br>
  {{games.awayTeam}} @ {{games.homeTeam}}
  {{#each games.assignments}}
  <div style="padding:4px 0">
    {{games.assignments.position}}: {{games.assignments.name}}
  </div>
  {{/each}}
</div>
{{/each}}
```

**Template data:**

```json
{
  "games": [
    {
      "league": "LBMQ",
      "gameType": "Game",
      "gameNumber": "SR004",
      "location": "Parc Raymond-Daviault",
      "date": "May 10, 2026",
      "time": "14:00",
      "awayTeam": "Unicanvas de Thetford Mines",
      "homeTeam": "Jets de Montréal",
      "assignments": [
        { "position": "Plate", "name": "Mitch Levis" },
        { "position": "Bases", "name": "Martin Gravel" }
      ]
    },
    {
      "league": "LBMQ",
      "gameType": "Game",
      "gameNumber": "JRE002",
      "location": "Stade Napoléon-Fontaine",
      "date": "May 15, 2026",
      "time": "19:30",
      "awayTeam": "Rocket de Coaticook",
      "homeTeam": "Guerriers de Granby",
      "assignments": [
        { "position": "Plate", "name": "Mitch Levis" },
        { "position": "Bases", "name": "Nicolas Huet" }
      ]
    }
  ]
}
```

**Expected rendered output:**

```html
<p>Your upcoming assignments:</p>
<div style="padding:16px 24px">
  <strong>LBMQ | Game #SR004</strong><br>
  Parc Raymond-Daviault<br>
  May 10, 2026 14:00<br>
  Unicanvas de Thetford Mines @ Jets de Montréal
  <div style="padding:4px 0">
    Plate: Mitch Levis
  </div>
  <div style="padding:4px 0">
    Bases: Martin Gravel
  </div>
</div>
<div style="padding:16px 24px">
  <strong>LBMQ | Game #JRE002</strong><br>
  Stade Napoléon-Fontaine<br>
  May 15, 2026 19:30<br>
  Rocket de Coaticook @ Guerriers de Granby
  <div style="padding:4px 0">
    Plate: Mitch Levis
  </div>
  <div style="padding:4px 0">
    Bases: Nicolas Huet
  </div>
</div>
```

## Inline Helpers

### `{{@isOdd 'oddValue' 'evenValue'}}`

The email builder can emit conditional inline values that depend on the current iteration index. This is used for alternating row background colors.

**Syntax:**

```
{{@isOdd 'value_if_odd' 'value_if_even'}}
```

- Only valid inside `{{#each}}...{{/each}}` blocks.
- Uses the **0-based** iteration index: index 0 = even, index 1 = odd, index 2 = even, etc.
- The backend replaces the entire `{{@isOdd ...}}` token with one of the two quoted arguments depending on the index parity.

**Example -- alternating row background colors:**

Template HTML:

```html
{{#each positions}}
<div style="background-color:{{@isOdd '#f0f0f0' '#ffffff'}};padding:16px 24px">
  <strong>{{positions.name}}</strong> — {{positions.position}}
</div>
{{/each}}
```

Template data:

```json
{
  "positions": [
    { "name": "Matt", "position": "Bases" },
    { "name": "Mitch", "position": "3rd Base" },
    { "name": "Alex", "position": "Plate" }
  ]
}
```

Expected rendered output:

```html
<div style="background-color:#ffffff;padding:16px 24px">
  <strong>Matt</strong> — Bases
</div>
<div style="background-color:#f0f0f0;padding:16px 24px">
  <strong>Mitch</strong> — 3rd Base
</div>
<div style="background-color:#ffffff;padding:16px 24px">
  <strong>Alex</strong> — Plate
</div>
```

## Backend Changes Required

### Current `replaceVariables` (flat replacement only)

```js
const replaceVariables = (content, variables) => {
  if (!content) return content;
  return content.replace(/\{\{(\w+)\}\}/g, (_, key) => variables[key] ?? '');
};
```

This only handles `{{key}}` -- it does not support loops or dot-notation access.

### Updated `replaceVariables` (with loop and nested loop support)

The function needs to:

1. **Process `{{#each ...}}...{{/each}}` blocks** -- extract the loop body, look up the array, and repeat the body once per item with `{{varName}}` / `{{varName.field}}` substituted.
2. **Support nesting** -- inner `{{#each parent.child}}` resolves `child` from the current item of the outer loop. The dotted path tells you the relationship.
3. **Then process remaining `{{key}}` flat replacements** as before.

Here is a reference implementation:

```js
const replaceVariables = (content, variables) => {
  if (!content) return content;

  // Escape special regex characters in a string
  function escapeRegExp(s) {
    return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  // Resolve a dotted variable name from a context object.
  // For "games.assignments", look up "assignments" on the context (current game item).
  // For "games", look up "games" on the context (top-level).
  function resolveVar(varName, context) {
    const dotIdx = varName.lastIndexOf('.');
    if (dotIdx !== -1) {
      const prop = varName.substring(dotIdx + 1);
      return context[prop];
    }
    return context[varName];
  }

  // Find the first outermost {{#each varName}}...{{/each}} block by counting
  // nesting depth to find the correctly balanced closing tag.
  // A simple non-greedy regex would incorrectly match the outer opening tag
  // to the inner closing tag when loops are nested.
  function findOuterLoop(text) {
    const openRe = /\{\{#each ([\w.]+)\}\}/;
    const match = openRe.exec(text);
    if (!match) return null;

    const startIdx = match.index;
    const varName = match[1];
    const bodyStart = startIdx + match[0].length;

    let depth = 1;
    let pos = bodyStart;
    while (depth > 0 && pos < text.length) {
      const nextOpen = text.indexOf('{{#each ', pos);
      const nextClose = text.indexOf('{{/each}}', pos);
      if (nextClose === -1) break;

      if (nextOpen !== -1 && nextOpen < nextClose) {
        depth++;
        pos = nextOpen + 8;
      } else {
        depth--;
        if (depth === 0) {
          return {
            varName,
            body: text.substring(bodyStart, nextClose),
            startIdx,
            endIdx: nextClose + '{{/each}}'.length,
          };
        }
        pos = nextClose + '{{/each}}'.length;
      }
    }
    return null;
  }

  // Process all {{#each}}...{{/each}} loops in the text.
  // Finds outermost loops first, then recurses into the loop body
  // for each item to handle inner loops with the item as context.
  function processLoops(text, context) {
    let result = text;
    let loop;
    while ((loop = findOuterLoop(result)) !== null) {
      const { varName, body, startIdx, endIdx } = loop;
      const items = resolveVar(varName, context);
      let replacement = '';

      if (Array.isArray(items) && items.length > 0) {
        replacement = items.map((item, index) => {
          let rendered = body;

          // Recursively process nested loops (inner vars resolve from current item)
          if (typeof item === 'object' && item !== null) {
            rendered = processLoops(rendered, item);
          }

          // Replace {{@isOdd 'oddValue' 'evenValue'}} based on current index
          rendered = rendered.replace(
            /\{\{@isOdd\s+'([^']*)'\s+'([^']*)'\}\}/g,
            (__, oddVal, evenVal) => (index % 2 === 1) ? oddVal : evenVal
          );

          // Replace {{varName.field}} with the field value
          if (typeof item === 'object' && item !== null) {
            rendered = rendered.replace(
              new RegExp(`\\{\\{${escapeRegExp(varName)}\\.(\\w+)\\}\\}`, 'g'),
              (__, field) => (item[field] !== undefined && item[field] !== null)
                ? String(item[field])
                : ''
            );
          }
          // Replace {{varName}} with the item itself (for simple arrays)
          rendered = rendered.replace(
            new RegExp(`\\{\\{${escapeRegExp(varName)}\\}\\}`, 'g'),
            String(item ?? '')
          );
          return rendered;
        }).join('');
      }

      result = result.substring(0, startIdx) + replacement + result.substring(endIdx);
    }
    return result;
  }

  // 1. Process all loops (including nested)
  content = processLoops(content, variables);

  // 2. Process remaining flat {{key}} replacements
  content = content.replace(/\{\{(\w+)\}\}/g, (_, key) =>
    (variables[key] !== undefined && variables[key] !== null) ? String(variables[key]) : ''
  );

  return content;
};
```

### Key Behaviors

- If the variable is not found or is not an array, the entire `{{#each}}...{{/each}}` block is removed (renders empty).
- If the array is empty, the block is removed.
- `{{varName.field}}` where `field` doesn't exist on the object renders as empty string.
- Loops are processed before flat variable replacement, so `{{key}}` references outside of loops still work normally.
- Nested loops are supported to any depth.
- Inner `{{#each parent.child}}` uses dotted notation. The last segment (`child`) is resolved from the current item of the enclosing loop.
- Each nesting level uses its own unique variable name (possibly dotted) as its reference prefix, preventing collisions.
- `{{@isOdd 'x' 'y'}}` is replaced per-iteration inside loops: odd-indexed items get `x`, even-indexed items get `y` (0-based index). This must be processed before field substitution within each iteration.

### Subject Line

The loop syntax is only expected in the HTML body. Subject lines (`SubjectEn` / `SubjectFr`) continue to use flat `{{key}}` replacement only.

### Plain Text

If `PlainTextEn` / `PlainTextFr` are used, the same loop processing should be applied there as well.

## API Contract

No changes to the `sendEmail()` function signature or the `/send-email/template/:id` endpoint are required. The `templateData` object already supports arbitrary values -- callers just need to include arrays (and nested arrays for nested loops):

```js
// Existing call pattern -- no changes needed
await sendEmail(request, toEmail, fromName, fromEmail, 'en', templateId, {
  first_name: 'Matt',
  positions: [
    { name: 'Matt', position: 'Bases' },
    { name: 'Mitch', position: '3rd Base' },
  ],
  // Nested example -- sub-arrays are resolved automatically
  games: [
    {
      league: 'LBMQ',
      gameType: 'Game',
      gameNumber: 'SR004',
      location: 'Parc Raymond-Daviault',
      date: 'May 10, 2026',
      time: '14:00',
      awayTeam: 'Unicanvas de Thetford Mines',
      homeTeam: 'Jets de Montréal',
      assignments: [
        { position: 'Plate', name: 'Mitch Levis' },
        { position: 'Bases', name: 'Martin Gravel' },
      ],
    },
  ],
});
```
