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
  try {
    await context.db.Heart.create({
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
      id: event.args.memeToken,
    });

    await context.db.MemeToken.update({
      id: event.args.memeToken,
      data: {
        heartCount: (memeToken?.heartCount || 0n) + 1n,
      },
    });

    const hearterId = `${event.args.hearter}`;

    const existingTotal = await context.db.totalHeartAmount.findUnique({
      id: hearterId,
    });

    if (existingTotal) {
      await context.db.totalHeartAmount.update({
        id: hearterId,
        data: {
          amount: existingTotal.amount + event.args.amount,
        },
      });
    } else {
      await context.db.totalHeartAmount.create({
        id: hearterId,
        data: {
          chain: "base",
          amount: event.args.amount,
        },
      });
    }
  } catch (e) {
    console.log(e);
  }
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
  try {
    await context.db.Heart.create({
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
      id: event.args.memeToken,
    });

    await context.db.MemeToken.update({
      id: event.args.memeToken,
      data: {
        heartCount: (memeToken?.heartCount || 0n) + 1n,
      },
    });

    const hearterId = `${event.args.hearter}`;
    const existingTotal = await context.db.totalHeartAmount.findUnique({
      id: hearterId,
    });

    if (existingTotal) {
      await context.db.totalHeartAmount.update({
        id: hearterId,
        data: {
          amount: existingTotal.amount + event.args.amount,
        },
      });
    } else {
      await context.db.totalHeartAmount.create({
        id: hearterId,
        data: {
          chain: "celo",
          amount: event.args.amount,
        },
      });
    }
  } catch (e) {
    console.log(e);
  }
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
  //create heartAmount
  try {
    await context.db.totalHeartAmount.create({
      id: `${event.args.memeToken}`,
      data: {
        chain: "base",
        amount: 0n,
      },
    });
    await context.db.MemeToken.create({
      id: event.args.memeToken,
      data: {
        chain: "base",
        owner: event.args.summoner,
        lpPairAddress: "",
        liquidity: 0n,
        heartCount: 0n,
        isUnleashed: false,
        timestamp: Number(event.block.timestamp),
        blockNumber: Number(event.block.number),
        heartAmountId: `${event.args.memeToken}`,
      },
    });
  } catch (e) {
    console.log(e);
  }

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
  try {
    await context.db.MemeToken.create({
      id: event.args.memeToken,
      data: {
        chain: "celo",
        owner: event.args.summoner,
        lpPairAddress: "",
        liquidity: 0n,
        heartCount: 0n,
        isUnleashed: false,
        timestamp: Number(event.block.timestamp),
        blockNumber: Number(event.block.number),
        heartAmountId: `${event.args.memeToken}`,
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
  } catch (e) {
    console.log(e);
  }
});

ponder.on("MemeBase_0_1_0:Unleashed", async ({ event, context }) => {
  await context.db.MemeToken.update({
    id: event.args.memeToken,
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
    id: event.args.memeToken,
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

  try {
    await context.db.Heart.create({
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

    // cannot specifiy memeNonce as unique, opt for findMany and limit 1
    const memeToken = await context.db.MemeToken.findMany({
      where: {
        nonce: event.args.memeNonce,
        chain: "base",        
      },
      limit: 1,
    }).then(res => res.items[0]); // pull first item

    if(!memeToken) return;

    await context.db.MemeToken.update({
      id: memeToken.id,
      data: {
        heartCount: (memeToken?.heartCount || 0n) + 1n,
      },
    });

    const hearterId = `${event.args.hearter}`;
    const existingTotal = await context.db.totalHeartAmount.findUnique({
      id: hearterId,
    });

    if (existingTotal) {
      await context.db.totalHeartAmount.update({
        id: hearterId,
        data: {
          amount: existingTotal.amount + event.args.amount,
        },
      });
    } else {
      await context.db.totalHeartAmount.create({
        id: hearterId,
        data: {
          chain: "base",
          amount: event.args.amount,
          nonce: event.args.memeNonce,
        },
      });
    }
  } catch (e) {
    console.log(e);
  }
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
  try {
    await context.db.Heart.create({
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

    // cannot specifiy memeNonce as unique, opt for findMany and limit 1
    const memeToken = await context.db.MemeToken.findMany({
      where: {
        nonce: event.args.memeNonce,
        chain: "base",        
      },
      limit: 1,
    }).then(res => res.items[0]); // pull first item

    if(!memeToken) return;

    await context.db.MemeToken.update({
      id: memeToken.id,
      data: {
        heartCount: (memeToken?.heartCount || 0n) + 1n,
      },
    });

    const hearterId = `${event.args.hearter}`;
    const existingTotal = await context.db.totalHeartAmount.findUnique({
      id: hearterId,
    });

    if (existingTotal) {
      await context.db.totalHeartAmount.update({
        id: hearterId,
        data: {
          amount: existingTotal.amount + event.args.amount,
        },
      });
    } else {
      await context.db.totalHeartAmount.create({
        id: hearterId,
        data: {
          chain: "celo",
          amount: event.args.amount,
          nonce: event.args.memeNonce,
        },
      });
    }
  } catch (e) {
    console.log(e);
  }
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
  try {
    await context.db.totalHeartAmount.create({
      id: `${event.args.summoner}`,
      data: {
        chain: "base",
        amount: 0n,
      },
    });
    await context.db.MemeToken.create({
      id: event.args.summoner,
      data: {
        chain: "base",
        owner: event.args.summoner,
        lpPairAddress: "",
        liquidity: 0n,
        heartCount: 0n,
        isUnleashed: false,
        timestamp: Number(event.block.timestamp),
        blockNumber: Number(event.block.number),
        heartAmountId: `${event.args.memeNonce}`,
      },
    });
  } catch (e) {
    console.log(e);
  }

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
  try {
    await context.db.totalHeartAmount.create({
      id: `${event.args.memeNonce}`,
      data: {
        chain: "celo",
        amount: 0n,
      },
    });
    await context.db.MemeToken.create({
      id: event.args.memeNonce.toString(),
      data: {
        chain: "celo",
        owner: event.args.summoner,
        lpPairAddress: "",
        liquidity: 0n,
        heartCount: 0n,
        isUnleashed: false,
        timestamp: Number(event.block.timestamp),
        blockNumber: Number(event.block.number),
        heartAmountId: `${event.args.memeNonce}`,
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
  } catch (e) {
    console.log(e);
  }
});

ponder.on("MemeBase_0_2_0:Unleashed", async ({ event, context }) => {
  await context.db.MemeToken.update({
    id: event.args.memeToken,
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
    id: event.args.memeToken,
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