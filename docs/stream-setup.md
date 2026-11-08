# Stream Feeds and moderation setup

The community feed uses Stream Activity Feeds v3 and Clerk as the app identity provider.

## Credentials

Add these values to `.env.local` and restart the Next.js server:

```dotenv
NEXT_PUBLIC_STREAM_API_KEY=your_stream_api_key
STREAM_API_SECRET=your_stream_api_secret
```

The API key is public by design. Keep `STREAM_API_SECRET` server-only. The token route signs a one-hour Stream user token for the current Clerk user; it does not expose the secret.

## Moderation policy

Reported posts are sent to Stream's moderation review queue from the feed. To automatically review new activities and comments, configure a moderation policy for the Stream app in the Stream Dashboard (or with the Stream CLI). Feeds v3 selects the most specific policy in this order: `feeds:<group>:<feed id>`, `feeds:<group>`, then `feeds` as the app-wide fallback.

Choose the actions for text and image rules (for example, flag spam and remove harassment). Once a policy exists, Stream applies it to client-created activities and comments and exposes flagged content in the moderation dashboard. Moderation policy setup is app-level and is not performed automatically by this app.

## Identity mapping

Each Clerk user ID is also the Stream user ID. This keeps the signed token, created activities, reactions, and moderation reports attached to the same person.
