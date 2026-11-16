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

- Keep the five existing public TanStack routes and shared shell; preserve imported content rather than reconstructing the site.
- Use browser-native in-view playback from the shared hook for illustrative workflows, with separate scene compositions per service, to keep motion lightweight and independently understandable.
- The contact inquiry adapter stays mock-only in version 1; retain the small API client solely as a future Node backend boundary to prevent accidental delivery claims or requests.
- Supplied identity uses CDN asset pointers in the shared header/footer and a real resized favicon in public; this keeps media lightweight while allowing native browser icon discovery.
- Header height and sticky service navigation share the responsive `--site-header-height` token so secondary navigation stays below the full identity lockup.
- Industry imagery is imported locally from generated assets and remains separate from workflow scene logic; this preserves the existing page structure and independent service compositions.
- Home uses the isolated HeroVisual CSS/SVG composition for looping illustrative motion; service playback remains independent to avoid changing the approved one-shot scenes.
