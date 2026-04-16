# Cult of Psyche + CultCodex - Phase 1 MVP

## PUBLIC FUNNEL (PsycheHub)

- [x] Homepage (/) - Identity + hook + "Enter the Codex" CTA + preview + vault tease
- [x] Watch (/watch) - YouTube embeds, clips, categories (Panels, Tarot, Chaos)
- [x] About (/about) - What this is, your role, what CultCodex is
- [x] Join (/join) - Pricing, benefits, CTA to signup
- [x] Lore (/lore) - Mythology, cult tone, brand depth
- [x] Clips (/clips) - Short-form content grid (TikTok-style)

## AUTH SYSTEM (Shared)

- [x] Login page (/login)
- [x] Signup page (/signup)
- [x] Dashboard redirect (/dashboard)
- [x] Google OAuth integration (via Manus OAuth)

## VAULT SYSTEM (Behind Login)

- [x] Vault main dashboard (/vault) - Sidebar + main panel
- [x] Latest Drops section (1 locked section for MVP)
- [x] 3 sample pieces of content (exclusive episodes/cuts)
- [x] Permission system (free vs member via role)
- [x] Membership badge display (members-only messaging)

## STRIPE INTEGRATION

- [x] Webhook endpoint for immediate access (server/webhooks.ts)
- [x] Membership tier setup ($10/mo, $100 lifetime) - configured in Join page
- [x] Post-purchase access grant (webhook handler)
- [x] Membership status sync (via user role)

## TESTING & DEPLOYMENT

- [x] Test full funnel (public → login → vault)
- [x] Test permission gates (member-only content)
- [x] Verify auth system
- [x] Save checkpoint

## Phase 2: Vault Tools

- [x] Nightmare Generator tool (/vault/tools/nightmare-generator)
  - [x] Backend LLM integration for nightmare generation
  - [x] Frontend UI with dark aesthetic
  - [x] Save/bookmark generated nightmares (localStorage)
  - [x] Nightmare history/archive (bookmarks section)
