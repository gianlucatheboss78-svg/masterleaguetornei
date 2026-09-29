<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Keep the installable app manifest-only; offline caching is intentionally excluded to protect live tournament freshness.
- Preserve the existing tournament data model while matching the supplied public site's presentation and navigation.
- Generate team marks, player avatars, and sport kits deterministically from stored names/IDs so shared tournaments render identically without storing extra media.
- Treat missing optional tournament modes and jersey IDs as legacy defaults so published JSON records remain backward-compatible.
