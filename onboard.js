// onboard.js (Node.js + Express)
import express from 'express';
import Stripe from 'stripe';
import dotenv from 'dotenv';

dotenv.config();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2025-08-14' });

const router = express.Router();

router.post('/connect-stripe', async (req, res) => {
  try {
    // create connected account
    const account = await stripe.accounts.create({
      type: 'standard',
      country: 'GB',
      capabilities: {
        card_payments: { requested: true },
        transfers: { requested: true },
      },
    });

    // store account.id in your DB linked to your user record
    const accountId = account.id;
    // e.g., await User.update({ id: req.body.userId }, { stripeAccountId: accountId });

    // create account link (onboarding)
    const accountLink = await stripe.accountLinks.create({
      account: accountId,
      refresh_url: process.env.STRIPE_REFRESH_URL,
      return_url: process.env.STRIPE_RETURN_URL,
      type: 'account_onboarding',
    });

    // send the URL back to user so frontend can redirect
    res.json({ url: accountLink.url });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error connecting to Stripe');
  }
});

export default router;
