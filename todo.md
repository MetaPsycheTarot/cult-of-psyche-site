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
