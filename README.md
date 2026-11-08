# Civora

A bilingual, local-first resume builder for job seekers worldwide. Requires Node.js 24.

```sh
npm ci
npm run dev
npm run lint
npm run typecheck
npm test
npm run build
```

Open http://localhost:3000/en or http://localhost:3000/ms. To test the production build locally, run `npm start` after building. Browser tests use Playwright. Install its Chromium browser with `npx playwright install chromium`, or set `CHROMIUM_PATH` to an installed executable. Set `TEST_BASE_URL` if a server is already running. Browser download tests use Poppler (`pdfinfo`, `pdftotext`) and `unzip`.

## Documents and privacy

- The A4 preview and PDF share the same measured text layout. PDF uses embedded open-source fonts derived from Liberation and selectable text. V1's bundled PDF fonts target Latin-script English and Bahasa Melayu. DOCX uses native paragraphs and standard editable fonts. Its page breaks can vary by Word processor.
- Drafts and a rolling previous save live in local storage. Import accepts versioned Civora JSON. Import creates independent copies. Deleting one draft also clears the rolling recovery copy. Deleting all removes both local keys. Move work between devices with JSON.
- Resume data and pasted job descriptions are processed in the browser. There are no user accounts, external content processors, analytics or ad scripts. The ATS score is a heuristic with six categories. It normalizes out the keyword category when no usable job keywords are available.
- Future cloud architecture lives in `supabase/001_optional_cloud_resumes.sql`. It uses a private owner-scoped table and row-level security. Before enabling optional sync, add explicit sign-in and sync consent, schema validation, timestamp/version conflict checks, separate cloud export/delete controls, and two-account policy tests. Use the browser publishable key with authenticated users, never the service-role key.

## Review and release

Use a new Vercel project and a **Preview** deployment for review. When linking Git, use this repository only and keep production release and promotion separate from review. The preview works without environment variables. Before an approved public release, set `RESUMEFORGE_SITE_URL` to the real production origin, `RESUMEFORGE_GOOGLE_VERIFICATION` to the Search Console token if using HTML tag verification, and `RESUMEFORGE_CONTACT_EMAIL` to a monitored project address. With no contact address, the Contact page points to the maintainer's public GitHub profile. The public pages emit canonical and reciprocal language tags when the origin is set. Only a configured production environment advertises the sitemap and allows indexing. Workspace pages are noindex.

## Advertising and consent

Ads are off in V1. There are no advertising cookies and there is no consent prompt for optional tracking. Before enabling ads, confirm an eligible commercial hosting plan, verify the real production domain and publisher account, configure Google's certified consent solution where required, and review regional consent and opt-out obligations. Confirm the policy language and withdrawal UI before loading any optional script. Publish only the publisher-provided ads.txt line after authorization and verification. Keep scripts and placements restricted to public editorial pages such as career guides. Exclude the entire dashboard, editor, preview, ATS, My Resumes and downloads, including from Auto ads.

Official references [Vercel terms](https://vercel.com/legal/terms) and [Google publisher consent requirements](https://support.google.com/adsense/answer/13554116).
