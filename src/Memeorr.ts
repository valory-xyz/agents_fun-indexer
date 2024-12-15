import { ponder } from "@/generated";

// version 0.1.0 events
ponder.on("MemeBase_0_1_0:Collected", async ({ event, context }) => {
  await context.db.CollectEvent.create({
    id: event.log.id,
    data: {
      chain: "base",
      hearter: event.args.hearter,
      memeToken: event.args.memeToken,
      allocation: event.args.allocation,
      timestamp: Number(event.block.timestamp),
      blockNumber: Number(event.block.number),
    },
  });
});

ponder.on("MemeCelo_0_1_0:Collected", async ({ event, context }) => {
  await context.db.CollectEvent.create({
    id: event.log.id,
    data: {
      chain: "celo",
      hearter: event.args.hearter,
      memeToken: event.args.memeToken,
      allocation: event.args.allocation,
      timestamp: Number(event.block.timestamp),
      blockNumber: Number(event.block.number),
    },
  });
});

ponder.on("MemeBase_0_1_0:Hearted", async ({ event, context }) => {
  await context.db.HeartEvent.create({
    id: event.log.id,
    data: {
      chain: "base",
      hearter: event.args.hearter,
      memeToken: event.args.memeToken,
      amount: event.args.amount,
      timestamp: Number(event.block.timestamp),
      blockNumber: Number(event.block.number),
    },
  });

  const memeToken = await context.db.MemeToken.findUnique({
    id: `base-${event.args.memeToken}`,
  });

  await context.db.MemeToken.update({
    id: `base-${event.args.memeToken}`,
    data: {
      heartCount: memeToken.heartCount + 1n,
      heartAmount: memeToken.heartAmount + event.args.amount,
    },
  });
});

ponder.on("MemeCelo_0_1_0:Hearted", async ({ event, context }) => {
  await context.db.HeartEvent.create({
    id: event.log.id,
    data: {
      chain: "celo",
      hearter: event.args.hearter,
      memeToken: event.args.memeToken,
      amount: event.args.amount,
      timestamp: Number(event.block.timestamp),
      blockNumber: Number(event.block.number),
    },
  });

  const memeToken = await context.db.MemeToken.findUnique({
    id: `celo-${event.args.memeToken}`,
  });

  await context.db.MemeToken.update({
    id: `celo-${event.args.memeToken}`,
    data: {
      heartCount: memeToken.heartCount + 1n,
      heartAmount: memeToken.heartAmount + event.args.amount,
    },
  });
});

ponder.on("MemeBase_0_1_0:OLASJourneyToAscendance", async ({ event, context }) => {
  await context.db.OLASJourneyToAscendanceEvent.create({
    id: event.log.id,
    data: {
      chain: "base",
      olas: event.args.olas,
      amount: event.args.amount,
      timestamp: Number(event.block.timestamp),
      blockNumber: Number(event.block.number),
    },
  });
});

ponder.on("MemeCelo_0_1_0:OLASJourneyToAscendance", async ({ event, context }) => {
  await context.db.OLASJourneyToAscendanceEvent.create({
    id: event.log.id,
    data: {
      chain: "celo",
      olas: event.args.olas,
      amount: event.args.amount,
      timestamp: Number(event.block.timestamp),
      blockNumber: Number(event.block.number),
    },
  });
});

ponder.on("MemeBase_0_1_0:Purged", async ({ event, context }) => {
  await context.db.PurgeEvent.create({
    id: event.log.id,
    data: {
      chain: "base",
      memeToken: event.args.memeToken,
      remainingAmount: event.args.remainingAmount,
      timestamp: Number(event.block.timestamp),
      blockNumber: Number(event.block.number),
    },
  });
});

ponder.on("MemeCelo_0_1_0:Purged", async ({ event, context }) => {
  await context.db.PurgeEvent.create({
    id: event.log.id,
    data: {
      chain: "celo",
      memeToken: event.args.memeToken,
      remainingAmount: event.args.remainingAmount,
      timestamp: Number(event.block.timestamp),
      blockNumber: Number(event.block.number),
    },
  });
});

ponder.on("MemeBase_0_1_0:Summoned", async ({ event, context }) => {
  await context.db.MemeToken.create({
    id: `base-${event.args.memeToken}`,
    data: {
      chain: "base",
      owner: event.args.summoner,
      memeToken: event.args.memeToken,
      memeNonce: 0n,
      lpPairAddress: "",
      lpTokenId: 0n,
      liquidity: 0n,
      heartCount: 0n,
      heartAmount: event.args.nativeTokenContributed,
      isUnleashed: false,
      timestamp: Number(event.block.timestamp),
      blockNumber: Number(event.block.number),
    },
  });

  await context.db.SummonEvent.create({
    id: event.log.id,
    data: {
      chain: "base",
      summoner: event.args.summoner,
      memeToken: event.args.memeToken,
      nativeTokenContributed: event.args.nativeTokenContributed,
      timestamp: Number(event.block.timestamp),
      blockNumber: Number(event.block.number),
    },
  });
});

ponder.on("MemeCelo_0_1_0:Summoned", async ({ event, context }) => {
  await context.db.MemeToken.create({
    id: `celo-${event.args.memeToken}`,
    data: {
      chain: "celo",
      owner: event.args.summoner,
      memeToken: event.args.memeToken,
      memeNonce: 0n,
      lpPairAddress: "",
      lpTokenId: 0n,
      liquidity: 0n,
      heartCount: 0n,
      heartAmount: event.args.nativeTokenContributed,
      isUnleashed: false,
      timestamp: Number(event.block.timestamp),
      blockNumber: Number(event.block.number),
    },
  });

  await context.db.SummonEvent.create({
    id: event.log.id,
    data: {
      chain: "celo",
      summoner: event.args.summoner,
      memeToken: event.args.memeToken,
      nativeTokenContributed: event.args.nativeTokenContributed,
      timestamp: Number(event.block.timestamp),
      blockNumber: Number(event.block.number),
    },
  });
});

ponder.on("MemeBase_0_1_0:Unleashed", async ({ event, context }) => {
  await context.db.MemeToken.update({
    id: `base-${event.args.memeToken}`,
    data: {
      lpPairAddress: event.args.lpPairAddress,
      liquidity: event.args.liquidity,
      isUnleashed: true,
    },
  });

  await context.db.UnleashEvent.create({
    id: event.log.id,
    data: {
      chain: "base",
      unleasher: event.args.unleasher,
      memeToken: event.args.memeToken,
      lpPairAddress: event.args.lpPairAddress,
      liquidity: event.args.liquidity,
      burnPercentageOfStable: event.args.burnPercentageOfStable,
      timestamp: Number(event.block.timestamp),
      blockNumber: Number(event.block.number),
    },
  });
});

ponder.on("MemeCelo_0_1_0:Unleashed", async ({ event, context }) => {
  await context.db.MemeToken.update({
    id: `celo-${event.args.memeToken}`,
    data: {
      lpPairAddress: event.args.lpPairAddress,
      liquidity: event.args.liquidity,
      isUnleashed: true,
    },
  });

  await context.db.UnleashEvent.create({
    id: event.log.id,
    data: {
      chain: "celo",
      unleasher: event.args.unleasher,
      memeToken: event.args.memeToken,
      lpPairAddress: event.args.lpPairAddress,
      liquidity: event.args.liquidity,
      burnPercentageOfStable: event.args.burnPercentageOfStable,
      timestamp: Number(event.block.timestamp),
      blockNumber: Number(event.block.number),
    },
  });
});

// version 0.2.0 events
ponder.on("MemeBase_0_2_0:Collected", async ({ event, context }) => {
  await context.db.CollectEvent.create({
    id: event.log.id,
    data: {
      chain: "base",
      hearter: event.args.hearter,
      memeToken: event.args.memeToken,
      allocation: event.args.allocation,
      timestamp: Number(event.block.timestamp),
      blockNumber: Number(event.block.number),
    },
  });
});

ponder.on("MemeCelo_0_2_0:Collected", async ({ event, context }) => {
  await context.db.CollectEvent.create({
    id: event.log.id,
    data: {
      chain: "celo",
      hearter: event.args.hearter,
      memeToken: event.args.memeToken,
      allocation: event.args.allocation,
      timestamp: Number(event.block.timestamp),
      blockNumber: Number(event.block.number),
    },
  });
});




ponder.on("MemeBase_0_2_0:FeesCollected", async ({ event, context }) => {
  await context.db.FeeCollectEvent.create({
    id: event.log.id,
    data: {
      chain: "base",
      feeCollector: event.args.feeCollector,
      memeToken: event.args.memeToken,
      nativeTokenAmount: event.args.nativeTokenAmount,
      memeTokenAmount: event.args.memeTokenAmount,
      timestamp: Number(event.block.timestamp),
      blockNumber: Number(event.block.number),
    },
  });
});

ponder.on("MemeCelo_0_2_0:FeesCollected", async ({ event, context }) => {
  await context.db.FeeCollectEvent.create({
    id: event.log.id,
    data: {
      chain: "celo",
      feeCollector: event.args.feeCollector,
      memeToken: event.args.memeToken,
      nativeTokenAmount: event.args.nativeTokenAmount,
      memeTokenAmount: event.args.memeTokenAmount,
      timestamp: Number(event.block.timestamp),
      blockNumber: Number(event.block.number),
    },
  });
});

ponder.on("MemeBase_0_2_0:Hearted", async ({ event, context }) => {
  await context.db.HeartEvent.create({
    id: event.log.id,
    data: {
      chain: "base",
      hearter: event.args.hearter,
      memeNonce: event.args.memeNonce,
      amount: event.args.amount,
      timestamp: Number(event.block.timestamp),
      blockNumber: Number(event.block.number),
    },
  });

  const memeToken = await context.db.MemeToken.findUnique({
    id: `base-${event.args.memeNonce}`,
  });

  await context.db.MemeToken.update({
    id: memeToken.id,
    data: {
      heartCount: memeToken.heartCount + 1n,
      heartAmount: memeToken.heartAmount + event.args.amount,
    },
  });
});

ponder.on("MemeCelo_0_2_0:Hearted", async ({ event, context }) => {
  await context.db.HeartEvent.create({
    id: event.log.id,
    data: {
      chain: "celo",
      hearter: event.args.hearter,
      memeNonce: event.args.memeNonce,
      amount: event.args.amount,
      timestamp: Number(event.block.timestamp),
      blockNumber: Number(event.block.number),
    },
  });

  const memeToken = await context.db.MemeToken.findUnique({
    id: `celo-${event.args.memeNonce}`,
  });

  await context.db.MemeToken.update({
    id: memeToken.id,
    data: {
      heartCount: memeToken.heartCount + 1n,
      heartAmount: memeToken.heartAmount + event.args.amount,
    },
  });
});

ponder.on("MemeBase_0_2_0:OLASJourneyToAscendance", async ({ event, context }) => {
  await context.db.OLASJourneyToAscendanceEvent.create({
    id: event.log.id,
    data: {
      chain: "base",
      amount: event.args.amount,
      timestamp: Number(event.block.timestamp),
      blockNumber: Number(event.block.number),
    },
  });
});

ponder.on("MemeCelo_0_2_0:OLASJourneyToAscendance", async ({ event, context }) => {
  await context.db.OLASJourneyToAscendanceEvent.create({
    id: event.log.id,
    data: {
      chain: "celo",
      amount: event.args.amount,
      timestamp: Number(event.block.timestamp),
      blockNumber: Number(event.block.number),
    },
  });
});

ponder.on("MemeBase_0_2_0:Purged", async ({ event, context }) => {
  await context.db.PurgeEvent.create({
    id: event.log.id,
    data: {
      chain: "base",
      memeToken: event.args.memeToken,
      timestamp: Number(event.block.timestamp),
      blockNumber: Number(event.block.number),
    },
  });
});

ponder.on("MemeCelo_0_2_0:Purged", async ({ event, context }) => {
  await context.db.PurgeEvent.create({
    id: event.log.id,
    data: {
      chain: "celo",
      memeToken: event.args.memeToken,
      timestamp: Number(event.block.timestamp),
      blockNumber: Number(event.block.number),
    },
  });
});

ponder.on("MemeBase_0_2_0:Summoned", async ({ event, context }) => {
  await context.db.MemeToken.create({
    id: `base-${event.args.memeNonce}`,
    data: {
      chain: "base",
      owner: event.args.summoner,
      memeToken: "",
      memeNonce: event.args.memeNonce,
      lpPairAddress: "",
      lpTokenId: 0n,
      liquidity: 0n,
      heartCount: 0n,
      heartAmount: event.args.amount,
      isUnleashed: false,
      timestamp: Number(event.block.timestamp),
      blockNumber: Number(event.block.number),
    },
  });

  await context.db.SummonEvent.create({
    id: event.log.id,
    data: {
      chain: "base",
      summoner: event.args.summoner,
      memeNonce: event.args.memeNonce,
      nativeTokenContributed: event.args.amount,
      timestamp: Number(event.block.timestamp),
      blockNumber: Number(event.block.number),
    },
  });
});

ponder.on("MemeCelo_0_2_0:Summoned", async ({ event, context }) => {
  await context.db.MemeToken.create({
    id: `celo-${event.args.memeNonce}`,
    data: {
      chain: "celo",
      owner: event.args.summoner,
      memeToken: "",
      memeNonce: event.args.memeNonce,
      lpPairAddress: "",
      lpTokenId: 0n,
      liquidity: 0n,
      heartCount: 0n,
      heartAmount: event.args.amount,
      isUnleashed: false,
      timestamp: Number(event.block.timestamp),
      blockNumber: Number(event.block.number),
    },
  });

  await context.db.SummonEvent.create({
    id: event.log.id,
    data: {
      chain: "celo",
      summoner: event.args.summoner,
      memeNonce: event.args.memeNonce,
      nativeTokenContributed: event.args.amount,
      timestamp: Number(event.block.timestamp),
      blockNumber: Number(event.block.number),
    },
  });
});

ponder.on("MemeBase_0_2_0:Unleashed", async ({ event, context }) => {
  await context.db.MemeToken.update({
    id: `base-${event.args.memeNonce}`,
    data: {
      memeToken: event.args.memeToken,
      lpTokenId: event.args.lpTokenId,
      liquidity: event.args.liquidity,
      isUnleashed: true,
    },
  });

  await context.db.UnleashEvent.create({
    id: event.log.id,
    data: {
      chain: "base",
      unleasher: event.args.unleasher,
      memeToken: event.args.memeToken,
      lpTokenId: event.args.lpTokenId,
      liquidity: event.args.liquidity,
      timestamp: Number(event.block.timestamp),
      blockNumber: Number(event.block.number),
    },
  });
});

ponder.on("MemeCelo_0_2_0:Unleashed", async ({ event, context }) => {
  await context.db.MemeToken.update({
    id: `celo-${event.args.memeNonce}`,
    data: {
      memeToken: event.args.memeToken,
      lpTokenId: event.args.lpTokenId,
      liquidity: event.args.liquidity,
      isUnleashed: true,
    },
  });

  await context.db.UnleashEvent.create({
    id: event.log.id,
    data: {
      chain: "celo",
      unleasher: event.args.unleasher,
      memeToken: event.args.memeToken,
      lpTokenId: event.args.lpTokenId,
      liquidity: event.args.liquidity,
      timestamp: Number(event.block.timestamp),
      blockNumber: Number(event.block.number),
    },
  });
});