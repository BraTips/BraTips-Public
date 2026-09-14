# BraTipsters monetization + tipster rewards

Implemented the recommended non-P2P model.

## Money flow

- Members pay BraTipsters subscriptions through Stripe.
- There is no user betting wallet and no peer-to-peer betting pool.
- 70% of collected subscription revenue remains platform revenue by default.
- 30% of collected subscription revenue forms the tipster performance pool by default.
- Stripe `invoice.paid` events are recorded once in `SubscriptionRevenue`.
- Fully refunded invoices are removed from the rewardable revenue base.

## Tipster eligibility

A tipster needs at least 50 lifetime settled predictions and at least 5 settled predictions in the reward month to qualify. The score uses the lifetime record for the long-term performance measures while monthly volume keeps the program focused on active tipsters.

Performance score:

- 40% long-term win rate
- 25% settled prediction volume
- 15% consistency / longest winning streak
- 10% ROI
- 10% discipline / void rate

The monthly pool is divided proportionally by performance score, so a single winning prediction does not create a cash prize by itself.

## Wallet

Each approved tipster gets a `TipsterWallet` with:

- availableBalance
- pendingBalance
- lifetimeEarned
- lifetimeWithdrawn
- currency

`WalletTransaction` provides an auditable wallet ledger.

Rewards first enter pending. Admin approval credits pending earnings, and admin release makes them available. Withdrawals reserve available balance and remain a manual admin payout workflow.

Minimum withdrawal is GHS 10 by default.

## Admin

The Tipster Rewards page now provides:

- revenue totals
- 70/30 allocation controls
- monthly reward calculation
- reward periods
- performance scores and shares
- reward approval/release
- tipster wallet visibility
- withdrawal approval, rejection and paid actions

The scheduler automatically calculates the previous month's reward period on the first daily run of a new month when no period has been calculated yet.

## Production notes

1. Configure Stripe prices and webhook events normally.
2. Keep `JWT_ACCESS_SECRET` and `JWT_REFRESH_SECRET` stable across deployments.
3. Ensure the Stripe webhook receives `invoice.paid` and refund events.
4. Review the reward percentages, eligibility threshold and payout process before launch.
5. Actual cash withdrawals should only be enabled after the required legal/compliance review for the launch market.

The previous fixed-amount winning-streak reward rules were removed from the active application code. Existing old MongoDB collections, if any, are not used by the new reward system.
