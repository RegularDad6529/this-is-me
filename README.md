# This is Me

A visual board of PFP NFTs held by any 6529 profile or Ethereum wallet.

## How it works

1. Enter a **6529 handle** (e.g. `punk6529`) or a **wallet address** (e.g. `0x...`)
2. The app fetches NFT holdings and filters for known PFP collections
3. Each collection appears as a card in the grid
4. **Click a card** to rotate to the next token in that collection
5. Toggle **Auto-rotate** to cycle through all tokens automatically

## Data sources

- **6529 handle path**: Uses the [6529.io API](https://api.6529.io) to fetch consolidated NFT holdings
- **Wallet address path**: Uses the [Alchemy NFT API](https://docs.alchemy.com/reference/getnftsforowner) (free tier with demo key)

## Configuration

Edit `collections.json` to customize:

```json
{
  "blocklist": ["0x..."],          // Collections to exclude (6529 Memes, Gradient, etc.)
  "allowlist": ["0x..."],          // Collections to always include
  "alchemy_api_key": "demo",       // Replace with your own free Alchemy key for higher limits
  "settings": {
    "auto_rotate_seconds": 5       // Auto-rotate interval
  }
}
```

## PFP collections

The app recognizes ~60 known PFP collections including CryptoPunks, Bored Apes, Mutant Apes, Meebits, Pudgy Penguins, mfers, CloneX, and more. See the full list in `app.js` (`KNOWN_PFP_CONTRACTS`).

## Tech

- Pure static HTML/CSS/JS — no backend
- Hosted on GitHub Pages
- All API calls happen client-side