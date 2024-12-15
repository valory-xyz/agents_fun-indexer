# Agents.fun Base indexer

A [Ponder](https://ponder.sh) indexer for tracking Memeorr contract events and building a GraphQL API.

## Overview

This indexer tracks the following Memeorr events:
- Collected
- Hearted  
- OLASJourneyToAscendance
- Purged
- Summoned
- Unleashed
- FeesCollected

The indexed data is exposed via a GraphQL API that can be queried to analyze Memeorr activity.

### Docker Deployment (development)

Deploying will Docker will run the indexer in development, inside a containerized environment, alongside a PostgreSQL database.

1. Create a `.env` file following the `.env.example` template.
2. Start the Docker container:

```bash
docker-compose -f docker-compose.dev.yml up
```

The GraphQL playground will be available at http://localhost:42069/graphql

### Local Development

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file with your RPC URL:
```
PONDER_RPC_URL_8453="https://eth-mainnet.g.alchemy.com/v2/YOUR-API-KEY"
```

4. Start the development server:
```bash
npm run dev
```

The GraphQL playground will be available at http://localhost:42069/graphql

## Deploy

Check out the ponder [deployment guide](https://ponder.sh/docs/production/deploy) for detailed instructions.


## Useful queries for testing:

Run ponder on one port:

```
 npm run dev
```

Query all summon events and format:

```
curl -X POST http://localhost:42069/graphql \
  -H "Content-Type: application/json" \
  -d '{
    "query": "query { summonEvents { items { id chain summoner memeToken memeNonce nativeTokenContributed timestamp blockNumber } } }"
  }' | awk '
  BEGIN { indent = 0 }
  {
    gsub(",", ",\n", $0);
    gsub("{", "{\n", $0);
    gsub("}", "\n}", $0);
    gsub(":", ": ", $0);
    for (i = 1; i <= length($0); i++) {
      char = substr($0, i, 1);
      if (char == "{") { print char; indent += 2 }
      else if (char == "}") { indent -= 2; printf("%*s%s\n", indent, "", char) }
      else if (char == ",") { print char; printf("%*s", indent, "") }
      else printf("%s", char)
    }
  }'
```

Query all tokens and format:

```
 curl -X POST http://localhost:42069/graphql \
  -H "Content-Type: application/json" \
  -d '{
    "query": "query { memeTokens { items { id chain owner memeToken memeNonce name symbol decimals lpPairAddress lpTokenId liquidity heartCount heartAmount isUnleashed timestamp blockNumber } } }"
  }' | awk '
  BEGIN { indent = 0 }
  {
    gsub(",", ",\n", $0);
    gsub("{", "{\n", $0);
    gsub("}", "\n}", $0);
    gsub(":", ": ", $0);
    for (i = 1; i <= length($0); i++) {
      char = substr($0, i, 1);
      if (char == "{") { print char; indent += 2 }
      else if (char == "}") { indent -= 2; printf("%*s%s\n", indent, "", char) }
      else if (char == ",") { print char; printf("%*s", indent, "") }
      else printf("%s", char)
    }
  }'
```
