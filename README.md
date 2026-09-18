# BraTipsters Public / User Interface

Public-facing Vue 3 + Vite application for BraTipsters.

## Includes
- Public browsing without authentication
- Login and normal user registration
- Tipster application / sign-up
- Public latest predictions
- Public tipster directory and profiles
- Public Bet of the Day
- Public prediction track record
- Authenticated My Picks tracker with stake and potential return
- Authenticated tipster dashboard and prediction submission
- Uses the same BraTipsters logo as the admin app

## Run
1. Copy `.env.example` to `.env` and set `VITE_API_URL`.
2. Install dependencies with `npm install`.
3. Run `npm run dev`.
4. Build with `npm run build`.

The My Picks feature records a user's selections and stake for tracking; it does not process deposits, withdrawals, bookmaker execution, or real-money settlement.

## BraTipsters public platform

The public app includes the football home feed, matches, live scores, Match Centre, odds movement, Dropping Odds, Bet of the Day, prediction history, tipsters and Stripe membership entry points.

The favicon is served from `/favicon.svg`.

## BraTipsters social/community links
Set these Vite variables in `.env.local` (do not commit secrets; these are public links):

VITE_DISCORD_URL=https://discord.gg/YOUR_INVITE
VITE_FACEBOOK_URL=https://www.facebook.com/YOUR_PAGE
VITE_TELEGRAM_URL=https://t.me/YOUR_CHANNEL
VITE_INSTAGRAM_URL=https://www.instagram.com/YOUR_USERNAME

The links are used by the `/community` page and the site footer.
