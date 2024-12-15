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
  // TODO: delete I think, why would we need this same info twice?
  // await context.db.Heart.create({
  //   id: event.log.id,
  //   data: {
  //     chain: "base",
  //     hearter: event.args.hearter,
  //     memeTokenId: event.args.memeToken,
  //     amount: event.args.amount,
  //     timestamp: Number(event.block.timestamp),
  //     blockNumber: Number(event.block.number),
  //   },
  // });

  const memeToken = await context.db.MemeToken.findUnique({
    id: `base-${event.args.memeToken}`,
  });

  await context.db.MemeToken.update({
    id: `base-${event.args.memeToken}`,
    data: {
      heartCount: memeToken.heartCount + 1n,
    },
  });

  // // TODO: why don't we use the same data on memeToken?
  // const hearterId = `base-${event.args.memeToken}`;
  // const existingTotal = await context.db.totalHeartAmount.findUnique({
  //   id: hearterId,
  // });

  // TODO: info already available in tokens, no need for global score
  // // TODO: IF/ELSE not needed; can only be IF
  // if (existingTotal) {
  //   await context.db.totalHeartAmount.update({
  //     id: hearterId,
  //     data: {
  //       amount: existingTotal.amount + event.args.amount,
  //     },
  //   });
  // } else {
  //   await context.db.totalHeartAmount.create({
  //     id: hearterId,
  //     data: {
  //       chain: "base",
  //       amount: event.args.amount,
  //     },
  //   });
  // }
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
  // await context.db.Heart.create({
  //   id: event.log.id,
  //   data: {
  //     chain: "celo",
  //     hearter: event.args.hearter,
  //     memeTokenId: event.args.memeToken,
  //     amount: event.args.amount,
  //     timestamp: Number(event.block.timestamp),
  //     blockNumber: Number(event.block.number),
  //   },
  // });

  const memeToken = await context.db.MemeToken.findUnique({
    id: `celo-${event.args.memeToken}`,
  });

  await context.db.MemeToken.update({
    id: `celo-${event.args.memeToken}`,
    data: {
      heartCount: memeToken.heartCount + 1n,
    },
  });

  // const hearterId = `celo-${event.args.memeToken}`;
  // const existingTotal = await context.db.totalHeartAmount.findUnique({
  //   id: hearterId,
  // });

  // if (existingTotal) {
  //   await context.db.totalHeartAmount.update({
  //     id: hearterId,
  //     data: {
  //       amount: existingTotal.amount + event.args.amount,
  //     },
  //   });
  // } else {
  //   await context.db.totalHeartAmount.create({
  //     id: hearterId,
  //     data: {
  //       chain: "celo",
  //       amount: event.args.amount,
  //     },
  //   });
  // }
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
  // TODO: believe we can drop this table, not needed, just duplicates
  // //create heartAmount
  // await context.db.totalHeartAmount.create({
  //   id: `base-${event.args.memeToken}`,
  //   data: {
  //     chain: "base",
  //     amount: 0n,
  //   },
  // });
  //create token
  await context.db.MemeToken.create({
    id: `base-${event.args.memeToken}`,
    data: {
      chain: "base",
      owner: event.args.summoner,
      lpPairAddress: "",
      liquidity: 0n,
      heartCount: 0n,
      isUnleashed: false,
      timestamp: Number(event.block.timestamp),
      blockNumber: Number(event.block.number),
      heartAmountId: `base-${event.args.memeToken}`,
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
  // TODO: believe we can drop this table, not needed, just duplicates
  // //create heartAmount
  // await context.db.totalHeartAmount.create({
  //   id: `celo-${event.args.memeToken}`,
  //   data: {
  //     chain: "celo",
  //     amount: 0n,
  //   },
  // });
  // create token
  await context.db.MemeToken.create({
    id: `celo-${event.args.memeToken}`,
    data: {
      chain: "celo",
      owner: event.args.summoner,
      lpPairAddress: "",
      liquidity: 0n,
      heartCount: 0n,
      isUnleashed: false,
      timestamp: Number(event.block.timestamp),
      blockNumber: Number(event.block.number),
      heartAmountId: `celo-${event.args.memeToken}`,
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
  // await context.db.Heart.create({
  //   id: event.log.id,
  //   data: {
  //     chain: "base",
  //     hearter: event.args.hearter,
  //     memeNonce: event.args.memeNonce,
  //     amount: event.args.amount,
  //     timestamp: Number(event.block.timestamp),
  //     blockNumber: Number(event.block.number),
  //   },
  // });

  // cannot specifiy memeNonce as unique, opt for findMany and limit 1
  // const memeToken = await context.db.MemeToken.findMany({
  //   where: {
  //     nonce: event.args.memeNonce,
  //     chain: "base",        
  //   },
  //   limit: 1,
  // }).then(res => res.items[0]); // pull first item

  const memeToken = await context.db.MemeToken.findUnique({
    id: `base-${event.args.memeNonce}`,
  });

  // if(!memeToken) return;

  await context.db.MemeToken.update({
    id: memeToken.id,
    data: {
      heartCount: memeToken.heartCount + 1n,
    },
  });

  // const hearterId = `base-${event.args.memeNonce}`;
  // const existingTotal = await context.db.totalHeartAmount.findUnique({
  //   id: hearterId,
  // });

  // if (existingTotal) {
  //   await context.db.totalHeartAmount.update({
  //     id: hearterId,
  //     data: {
  //       amount: existingTotal.amount + event.args.amount,
  //     },
  //   });
  // } else {
  //   await context.db.totalHeartAmount.create({
  //     id: hearterId,
  //     data: {
  //       chain: "base",
  //       amount: event.args.amount,
  //       nonce: event.args.memeNonce,
  //     },
  //   });
  // }
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
  // await context.db.Heart.create({
  //   id: event.log.id,
  //   data: {
  //     chain: "celo",
  //     hearter: event.args.hearter,
  //     memeNonce: event.args.memeNonce,
  //     amount: event.args.amount,
  //     timestamp: Number(event.block.timestamp),
  //     blockNumber: Number(event.block.number),
  //   },
  // });

  // // cannot specifiy memeNonce as unique, opt for findMany and limit 1
  // const memeToken = await context.db.MemeToken.findMany({
  //   where: {
  //     nonce: event.args.memeNonce,
  //     chain: "base",        
  //   },
  //   limit: 1,
  // }).then(res => res.items[0]); // pull first item

  const memeToken = await context.db.MemeToken.findUnique({
    id: `celo-${event.args.memeNonce}`,
  });

  // if(!memeToken) return;

  await context.db.MemeToken.update({
    id: memeToken.id,
    data: {
      heartCount: memeToken.heartCount + 1n,
    },
  });

  // const hearterId = `celo-${event.args.hearter}`;
  // const existingTotal = await context.db.totalHeartAmount.findUnique({
  //   id: hearterId,
  // });

  // if (existingTotal) {
  //   await context.db.totalHeartAmount.update({
  //     id: hearterId,
  //     data: {
  //       amount: existingTotal.amount + event.args.amount,
  //     },
  //   });
  // } else {
  //   await context.db.totalHeartAmount.create({
  //     id: hearterId,
  //     data: {
  //       chain: "celo",
  //       amount: event.args.amount,
  //       nonce: event.args.memeNonce,
  //     },
  //   });
  // }
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
  // //create heartAmount
  // await context.db.totalHeartAmount.create({
  //   id: `base-${event.args.memeNonce}`,
  //   data: {
  //     chain: "base",
  //     amount: 0n,
  //   },
  // });
  //create token
  await context.db.MemeToken.create({
    id: `base-${event.args.memeNonce}`,
    data: {
      chain: "base",
      owner: event.args.summoner,
      lpPairAddress: "",
      liquidity: 0n,
      heartCount: 0n,
      isUnleashed: false,
      timestamp: Number(event.block.timestamp),
      blockNumber: Number(event.block.number),
      heartAmountId: `base-${event.args.memeNonce}`,
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
  // await context.db.totalHeartAmount.create({
  //   id: `celo-${event.args.memeNonce}`,
  //   data: {
  //     chain: "celo",
  //     amount: 0n,
  //   },
  // });
  await context.db.MemeToken.create({
    id: `celo-${event.args.memeNonce}`,
    data: {
      chain: "celo",
      owner: event.args.summoner,
      lpPairAddress: "",
      liquidity: 0n,
      heartCount: 0n,
      isUnleashed: false,
      timestamp: Number(event.block.timestamp),
      blockNumber: Number(event.block.number),
      heartAmountId: `celo-${event.args.memeNonce}`,
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
      // lpPairAddress: event.args.lpTokenId,
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
      // lpPairAddress: event.args.lpPairAddress,
      lpTokenId: event.args.lpTokenId,
      liquidity: event.args.liquidity,
      // burnPercentageOfStable: event.args.burnPercentageOfStable,
      timestamp: Number(event.block.timestamp),
      blockNumber: Number(event.block.number),
    },
  });
});

ponder.on("MemeCelo_0_2_0:Unleashed", async ({ event, context }) => {
  await context.db.MemeToken.update({
    id: `celo-${event.args.memeNonce}`,
    data: {
      // lpPairAddress: event.args.lpPairAddress,
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
      // lpPairAddress: event.args.lpPairAddress,
      lpTokenId: event.args.lpTokenId,
      liquidity: event.args.liquidity,
      // burnPercentageOfStable: event.args.burnPercentageOfStable,
      timestamp: Number(event.block.timestamp),
      blockNumber: Number(event.block.number),
    },
  });
});