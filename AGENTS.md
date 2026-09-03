# Barnängshuset project guardrails

## Sanity-first gate — mandatory for every site change

Sanity is part of the feature, not follow-up plumbing. Any visible content,
media, ordering, variant, state, or layout choice that an editor may reasonably
need to change must be modelled and verified in Sanity before its frontend
implementation is considered valid.

For every site change, work in this order:

1. Inspect the relevant Sanity schema, GROQ projection, TypeScript type,
   fallback data, published document, and draft document before editing the UI.
2. Define or update the Sanity field contract first. Arrays must support adding,
   removing, and reordering. Variant controls must map one-to-one to visibly
   distinct frontend states at desktop and mobile widths.
3. Update the GROQ query, TypeScript types, fallback data, and any required data
   migration/population script in the same change. Never let a frontend fallback
   silently hide a missing query field.
4. Deploy the schema and populate or migrate existing content before building the
   frontend against it.
5. Run `npm run verify:sanity`. Do not proceed to or finalize the UI when this
   command fails.
6. Implement the frontend using the verified CMS response. Test every selectable
   Sanity option, not only the default, at desktop and mobile widths.
7. Verify both editorial states:
   - Draft changes appear in Sanity Presentation without publishing.
   - Published changes appear on the public site after publishing.
8. Before commit or deployment, run `npm run verify:sanity`, `npm run build`, and
   browser QA of the affected Studio controls and rendered page.

Definition of done for CMS-backed work:

- The field exists in the deployed Studio schema.
- The Studio control saves the intended value to `drafts.homePage`.
- The GROQ response contains that value without relying on a fallback.
- Presentation renders the draft and updates without requiring Publish.
- The public page renders the published value.
- Every option is visually distinguishable and responsive.
- The production and local preview origins remain credentialed in Sanity CORS.

If Studio authentication prevents visual verification, stop and report that the
Sanity portion is unverified. Do not describe the site change as complete.

### Sanity Presentation / Stega rule

Sanity Presentation adds invisible Stega edit metadata to string values. A value
that looks like `compact`, `right`, `available`, or `video` may therefore fail a
literal comparison or produce an invalid CSS class in draft mode even though it
works when published.

- Never use a CMS string directly in a CSS class, object lookup, `switch`, or
  equality comparison when Presentation can supply it.
- Clean structural/control values with `stegaClean` at the rendering boundary.
  Keep visible editorial copy encoded so click-to-edit continues to work.
- Normalize cleaned values through an explicit allow-list and provide a safe
  fallback.
- Whenever a Sanity enum controls layout or behavior, add an encoded-value
  regression check to `npm run verify:sanity` and test it in Presentation.
- A published-page test alone is insufficient because published strings do not
  expose this failure.

### Sanity Studio deployment rule

The Studio is externally hosted inside the Next.js application at
`https://barnangshuset.netlify.app/studio`. The Sanity dashboard application must
point to that exact URL.

- Register Studio updates with
  `npx sanity deploy --external --url https://barnangshuset.netlify.app/studio --title "Barnängshuset Studio" --yes`.
- Never pass the full Netlify URL to a normal Sanity-hosted `sanity deploy`; it
  treats the value as a hostname and produces a malformed `.sanity.studio` URL.
- After registration, run the same command with `--dry-run --json` and confirm
  that its reported `url` is exactly the Netlify `/studio` URL.
