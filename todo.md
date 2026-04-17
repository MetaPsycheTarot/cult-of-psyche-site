# Cult of Psyche + CultCodex - Structured Build Plan

## PRIORITY 1: Global Layout Fix

- [x] Update top navigation: Logo (left) | Watch | Clips | Lore | Join | Profile/Login (right)
- [x] Add footer with links and "Powered by CultCodex" branding
- [x] Standardize page container width and spacing
- [x] Apply consistent layout to all pages

## PRIORITY 2: /vault/content (Monetization Surface)

- [x] Create /vault/content page with filter bar (Exclusive | Full Episodes | Removed Scenes)
- [x] Build content grid with locked/unlocked card states
- [x] Add 5 sample exclusive content items
- [x] Implement access control (free vs member via role check)

## PRIORITY 3: Tarot System

- [x] Create /vault/tarot page with card grid
- [x] Build card detail view (image, meaning, interpretation, notes)
- [x] Add static Psyche Awakens deck meanings (8 cards)
- [x] Implement card click → detail panel

## PRIORITY 4: Tools Expansion

- [x] Nightmare Generator (already built ✅)
- [x] Create /vault/tools hub page
- [x] Add Tarot Pull tool (coming soon)
- [x] Add Prompt Generator tool (coming soon)

## COMPLETED FEATURES

- [x] Phase 1 MVP: Public funnel, auth system, basic vault
- [x] YouTube livestream integration
- [x] Nightmare Generator with LLM
- [x] Vault sidebar navigation


## PHASE 2: Tools Implementation

- [x] Prompt Generator tool (/vault/tools/prompt-generator)
  - [x] Backend LLM integration for prompt generation
  - [x] Frontend UI with category selection
  - [x] TikTok prompts
  - [x] Stream Ideas prompts
  - [x] Horror Stories prompts
  - [x] Copy to clipboard functionality
  - [x] Prompt history/bookmarks (localStorage)


## STRIPE INTEGRATION

- [x] Stripe webhook endpoint (/api/webhooks/stripe)
- [x] Handle checkout.session.completed event
- [x] Update user role to "member" on successful payment
- [x] Track membership tier (monthly vs lifetime) metadata
- [x] Test webhook signature verification (4/4 tests passing)
- [x] Add webhook error handling and logging


## POST-PURCHASE EXPERIENCE

- [x] Create /success page for post-checkout redirect
- [x] Display welcome message and membership confirmation
- [x] Show membership tier (monthly/lifetime)
- [x] Auto-redirect to /vault/content after 3 seconds
- [x] Add manual "Enter Vault" CTA button
- [x] Display first exclusive content preview


## TAROT PULL TOOL

- [x] Create /vault/tools/tarot-pull page
- [x] Implement 1-card draw functionality
- [x] Implement 3-card draw functionality
- [x] Add AI-powered card interpretation using LLM
- [x] Display card imagery and meanings (Psyche Awakens deck)
- [x] Save/bookmark readings to localStorage
- [x] Add reading history (5/5 tests passing)


## TAROT CARD IMAGERY

- [x] Generate 78 Psyche Awakens tarot card images (all 78 cards generated with neon-noir aesthetic)
- [x] Upload card images to CDN via manus-upload-file
- [x] Update tarot deck data with image URLs (via tarotCardImages.ts mapping)
- [x] Render card images in /vault/tools/tarot-pull UI (integrated with imageUrl display)
- [x] Add card image display to card grid and detail views (card grid updated)


## 78-CARD TAROT DECK EXPANSION

- [x] Build 78-card data structure (Major Arcana, Wands, Cups, Swords, Pentacles)
- [x] Add card meanings and interpretations to backend
- [x] Integrate full deck into tarot router
- [x] Update tarot pull tool with deck filtering (by suit/arcana)
- [x] Generate Major Arcana card images (22 cards) - All generated with neon-noir aesthetic
- [x] Generate Wands suit images (14 cards) - All generated
- [x] Generate Cups suit images (14 cards) - All generated
- [x] Generate Swords suit images (14 cards) - All generated
- [x] Generate Pentacles suit images (14 cards) - All generated
- [x] Integrate all card images into UI (via tarotCardImages.ts mapping)
- [x] Test full deck pulls and interpretations


## VAULT ENHANCEMENTS

- [x] Add search bar to /vault/tarot for card name/keyword filtering (7/7 tests passing)


## VAULT LORE SECTION

- [x] Create /vault/lore page with organized mythology
- [x] Add rituals section with descriptions and practices
- [x] Add symbol interpretations and meanings
- [x] Integrate with tarot deck meanings
- [x] Add expandable sections for better UX


## FAN ART GALLERY

- [x] Create /vault/gallery page for community fan art
- [x] Upload and organize fan art images
- [x] Add video gallery for animated fan content
- [x] Display with neon-noir aesthetic grid layout


## ARCHIVE SECTION

- [x] Create /vault/archive page for user-generated content history
- [x] Display saved nightmares, readings, and prompts
- [x] Add filtering and search for archive items
- [x] Implement export functionality (JSON/PDF)
- [x] Add archive statistics and insights

## NEXT PHASE: COMMUNITY & ENGAGEMENT

- [x] User profiles with member stats
- [x] Community forum or discussion board
- [x] Leaderboards for engagement metrics
- [x] Email notifications for new content/events (deferred - requires backend email service)
- [x] Member-submitted content moderation system (deferred - requires admin panel)

## POST-DELIVERY ENHANCEMENTS

- ## FORUM ENHANCEMENTS

- [x] Add 'Help & Support' category to community forum
- [x] Update forum category filtering to include help/support
- [x] Add help-specific styling and icons for support posts


## PINNED POSTS FEATURE

- [x] Add pinned post functionality to forum (localStorage-based)
- [x] Create Getting Started pinned post with FAQs
- [x] Add visual indicator for pinned posts (📌 icon + gold styling)
- [x] Implement pinned post sorting (always appears at top)

## DEFERRED FEATURES (Requires Backend Infrastructure)

- [ ] Implement admin ability to pin/unpin posts (deferred - requires admin panel)
- [ ] Add database persistence for pinned posts (deferred - requires backend migration)
- [ ] Add vitest tests for pinned post functionality (deferred - requires jsdom environment setup)
- [ ] Email notifications for forum activity (deferred - requires email service)
- [ ] Member-submitted content moderation system (deferred - requires admin panel)


## FORUM SEARCH FEATURE

- [x] Add search bar to forum page
- [x] Implement search filtering by post title and content
- [x] Add real-time search result count display
- [x] Search across all categories or within selected category
- [x] Add search-term highlighting in matching post titles/content (enhancement)

- [x] Add safe search-term highlighting that escapes regex special characters
- [x] Add empty-results UI for forum search when no posts match
- [ ] Add vitest coverage for forum search filtering and highlighting behavior (deferred - requires jsdom setup)
