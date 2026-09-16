# BraTipsters + AIStarterKit implementation

- BraTips-Public(2) is the source of truth for the navbar, navigation structure, account controls, mobile navigation, branding, and premium subscription card structure.
- AIStarterKit is used as the visual inspiration for public content surfaces, spacing, gradients, cards, and the tipster workspace.
- The Vue/Vite architecture and existing API integrations are preserved.
- Added light/dark theme persistence via localStorage and a navbar theme toggle.
- Added role-aware routing: tipsters go to `/tipster-dashboard`; normal members go to `/dashboard`.
- `/dashboard` redirects tipsters to `/tipster-dashboard`; `/tipster-dashboard` redirects normal members to `/dashboard`.

Run locally:

    npm install
    npm run build
    npm run dev

Deploy the tested build to a staging Vercel deployment before replacing the current production deployment.


## Typography update
The public typography is locked to the BraTips-Public(2) system: Inter/Arial fallback, 16px base size, 1.5 line height, and the original heading/navigation/form/table sizing and weights. AIStarterKit visual styling does not replace the BraTips font system.
