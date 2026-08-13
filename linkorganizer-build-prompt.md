# Build Prompt: LinkOrganizer

Build a mobile-friendly web app called **LinkOrganizer**. It helps me save and organize links to useful resources, grouped by "niche" (topic/category), and mark them as done when I no longer need them.

## Tech Stack
- **Next.js** (App Router) for the frontend/framework
- **Tailwind CSS** for mobile-first, responsive styling
- **Supabase** (Postgres) as the database — no authentication, single shared workspace (this is a personal tool, not multi-user)
- **Vercel** for deployment

## Data Model
Two tables in Supabase:

**niches**
- id (uuid, primary key)
- name (text, required, unique)
- created_at (timestamp, default now())

**links**
- id (uuid, primary key)
- niche_id (uuid, foreign key -> niches.id, on delete cascade)
- title (text, required)
- url (text, required)
- notes (text, optional)
- status (text, default 'active', values: 'active' | 'done')
- created_at (timestamp, default now())

## Core Features
1. **Home / Niches view**: List all niches as cards, each showing the niche name and count of active links. Tapping a niche opens its links.
2. **Create niche**: A simple form/modal to add a new niche by name.
3. **Niche detail view**: Shows all links in that niche.
   - Default view shows only "active" links.
   - Toggle to also view "done" links.
4. **Add link**: Form within a niche to add a link (title, URL, optional notes).
5. **Mark as done**: A swipe action or button on each link to mark it "done" (soft delete — do not hard-delete from the database, just change status).
6. **Delete permanently**: Separate explicit action to hard-delete a link or a whole niche (with confirmation, since this is irreversible).
7. **Open link**: Tapping a link's title/URL opens it in a new tab.
8. **Edit**: Ability to edit a link's title/URL/notes, and rename a niche.

## UI / UX Requirements
- Mobile-first design — this will primarily be used on a phone, but must also look and work well on a laptop browser (responsive layout, not just a scaled-down mobile view).
- Clean, minimal, fast — no clutter. Prioritize quick add and quick mark-done since I'll be doing this often.
- Use Tailwind for all styling. No component library needed — keep it simple.
- Color scheme: light/ash gray background (e.g. Tailwind's `gray-100`/`gray-50` tones), black font color for text, with slightly darker ash/gray tones for cards and borders to create subtle contrast. Avoid bright or saturated colors — keep it neutral and calm.
- No login/auth screen at all. The app loads straight into the niches view.

## Setup Instructions for the Dev Environment
1. Scaffold a new Next.js app with Tailwind CSS configured.
2. Initialize it as a git repository and create a `.gitignore` that excludes `.env.local`, `node_modules`, and build output — credentials must never be committed.
3. Set up a Supabase client using environment variables (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`) — do not hardcode credentials.
4. Provide the SQL to create the two tables above, including Row Level Security policies that allow the anon key to read/write freely (since there's no auth, but flag this tradeoff to me clearly in a comment).
5. Build out the pages/components listed under Core Features.
6. Confirm the app builds and runs locally before treating it as done.

## Auto-Deploy Pipeline (GitHub -> Vercel)
I want changes pushed to GitHub to automatically update the live app, with no manual deploy steps after setup. Do this using Vercel's native GitHub integration (no custom GitHub Actions workflow needed — Vercel handles the pipeline itself):

1. Walk me through creating a new GitHub repository and pushing the initial codebase to it.
2. Walk me through connecting that GitHub repo to a Vercel project (via the Vercel dashboard: Import Project -> select the GitHub repo).
3. Walk me through adding `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` as Environment Variables in the Vercel project settings, so the deployed app can reach Supabase.
4. Confirm that once connected, every push to the `main` branch auto-triggers a new production deployment, and every push to any other branch creates its own preview deployment URL (so I can optionally test changes before merging to `main`).
5. Give me the exact day-to-day workflow after this is set up: I make changes locally (or ask my dev environment to), commit, push to `main`, and the live app updates automatically within a minute or two — no manual redeploy step.

## Explicitly Out of Scope (for now)
- No user accounts or authentication
- No sharing links with other people
- No tagging/multi-niche assignment per link (one link belongs to exactly one niche)
- No offline mode
