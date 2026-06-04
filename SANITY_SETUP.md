# Sanity CMS — Setup & Editing Guide

The site reads its content from **Sanity** at build time, and rebuilds itself
automatically whenever the client publishes a change.

- **Studio** (the client's editing dashboard) lives in `/studio` and is deployed
  to a hosted URL like `https://samuelbristow.sanity.studio`.
- **The website** (`/app`) fetches the content during its build.
- Until a Sanity project is connected, the site falls back to the original
  hard‑coded content, so nothing breaks in the meantime.

---

## 1. Create the Sanity project (one time)

1. Go to <https://www.sanity.io> and sign up / log in (free plan is plenty).
2. In the `studio/` folder, run:
   ```bash
   cd studio
   npm install
   npx sanity login
   npx sanity init --env
   ```
   - When asked, **create a new project**, name it `Samuel Bristow`.
   - Use dataset name **`production`** (public).
   - This writes a `SANITY_STUDIO_PROJECT_ID` into `studio/.env`.
3. Note the **Project ID** (shown in the terminal and at
   <https://www.sanity.io/manage>). You'll need it in step 2 and 3.

## 2. Point the website at the project

In the website root, create `.env.local` (copy from `.env.example`):

```
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
NEXT_PUBLIC_SANITY_DATASET=production
```

Also add these same two variables in the **Cloudflare Pages** project settings
(Settings → Environment variables → Production) so the deployed build can read
from Sanity.

## 3. Deploy the Studio (the client's dashboard)

```bash
cd studio
npm run deploy
```

Choose a hostname, e.g. `samuelbristow` → the dashboard is live at
`https://samuelbristow.sanity.studio`. Invite the client there
(Project → Members at <https://www.sanity.io/manage>).

> To edit locally instead: `cd studio && npm run dev` → <http://localhost:3333>.

## 4. Add the content

In the Studio the client will see one entry per section:

- **Latest Series (Home)** — the homepage media (images, GIFs, videos). Drag to
  reorder. Turn on **Full width** for landscape/video items.
- **Portfolio Overview** — each "cell" is one image, or a group of 2–3 dragged
  together to sit tightly as a unit.
- **Motion** — videos (mp4) and GIFs.
- **About** — bio (with italic/bold), representation line, phone, email, the
  Select Clients list, and the copyright line.
- **Studio** — studio photos, company name, address lines, phone, email.
- **Settings** — the Instagram URL.

For **videos**, fill in the Width and Height fields (pixel size) so the layout
keeps the right proportions. Image/GIF dimensions are detected automatically.

## 5. Auto‑rebuild on publish (so edits go live)

So the site rebuilds itself when the client publishes:

1. **Cloudflare Pages** → your project → Settings → Builds & deployments →
   **Deploy hooks** → create one (e.g. "Sanity publish") → copy the URL.
2. **Sanity** → <https://www.sanity.io/manage> → your project → **API** →
   **Webhooks** → Create webhook:
   - URL: *(paste the Cloudflare deploy‑hook URL)*
   - Dataset: `production`
   - Trigger on: **Create, Update, Delete**
   - Filter (optional): leave blank to rebuild on any change.

Now: client edits → **Publish** → site rebuilds → live in ~1–2 minutes.

---

## Notes

- Animated **GIFs** are served untouched (not converted), so they keep animating.
- Images are delivered from Sanity's CDN, auto‑sized and auto‑formatted.
- The `studio/` folder is excluded from the website's build, so it never affects
  the Cloudflare deploy.
- If you ever disconnect Sanity (remove the env vars), the site reverts to the
  built‑in fallback content.
