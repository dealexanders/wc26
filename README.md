# Mundial 2026 dashboard

All editable site and tournament data lives in [`data.json`](data.json). The HTML is only the application shell, JavaScript renders the stored data, and the theme section of the JSON supplies the CSS custom properties.

## Update tournament data

- `site`, `navigation`, and `content` control labels and copy shown on the site.
- `theme` controls the CSS theme and group accent colors.
- `teams` maps each team code to its display name and Flag Icons code.
- `groups` lists the team codes in each group.
- `matches` drives both the Games cards and Schedule table.

To publish a result, update the relevant match's `status`, `score1`, and `score2`. Scores set to numbers are displayed automatically; `null` scores continue to display “v”. For example:

```json
{
  "status": "finished",
  "score1": 2,
  "score2": 1
}
```

Keep team codes in `groups` and `matches` aligned with keys in `teams`. Knockout placeholders such as `W79` and `Winner SF1` can remain as text until the advancing team is known, then be replaced with a team code.
