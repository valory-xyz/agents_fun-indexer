import { ponder } from "@/generated";
import { Erc20Abi } from "./abis/Erc20Abi";
import { MemeFactoryAbiBase } from "./abis/MemeFactoryAbiBase";
import { Abi, encodeFunctionData, decodeFunctionResult, ContractFunctionName, ContractFunctionArgs, DecodeFunctionResultReturnType } from 'viem';


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
  const memeToken = await context.db.MemeToken.findUnique({
    id: `base-${event.args.memeToken}`,
  });

  if (memeToken) {
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

    await context.db.MemeToken.update({
      id: `base-${event.args.memeToken}`,
      data: {
        isPurged: true,
        purgeTime: Number(event.block.timestamp),
      },
    });
  } else {
    console.log(`MemeToken with ID base-${event.args.memeToken} not found.`);
  }
});

ponder.on("MemeCelo_0_1_0:Purged", async ({ event, context }) => {
  const memeToken = await context.db.MemeToken.findUnique({
    id: `celo-${event.args.memeToken}`,
  });

  if (memeToken) {
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

    await context.db.MemeToken.update({
      id: `celo-${event.args.memeToken}`,
      data: {
        isPurged: true,
        purgeTime: Number(event.block.timestamp),
      },
    });
  } else {
    console.log(`MemeToken with ID celo-${event.args.memeToken} not found.`);
  }
});

ponder.on("MemeBase_0_1_0:Summoned", async ({ event, context }) => {
  const memeTokenAddress = event.args.memeToken;

  const results = await context.client.multicall({
    contracts: [
      {
        abi: Erc20Abi,
        address: memeTokenAddress,
        functionName: 'name',
      },
      {
        abi: Erc20Abi,
        address: memeTokenAddress,
        functionName: 'symbol',
      },
      {
        abi: Erc20Abi,
        address: memeTokenAddress,
        functionName: 'decimals'
      },
      {
        abi: context.contracts.MemeBase_0_1_0.abi,
        address: context.contracts.MemeBase_0_1_0.address,
        functionName: 'UNLEASH_DELAY'
      }
    ]
  });

  await context.db.MemeToken.create({
    id: `base-${event.args.memeToken}`,
    data: {
      chain: "base",
      owner: event.args.summoner,
      memeToken: event.args.memeToken,
      memeNonce: 0n,
      name: results[0].result,
      symbol: results[1].result,
      decimals: BigInt(results[2].result),
      lpPairAddress: "",
      lpTokenId: 0n,
      liquidity: 0n,
      heartCount: 0n,
      heartAmount: 0n,
      isUnleashed: false,
      unleashableTimestamp: Number(event.block.timestamp) + Number(results[3].result),
      summonTime: Number(event.block.timestamp), 
      unleashTime: 0, 
      summoner: event.args.summoner,
      timestamp: Number(event.block.timestamp),
      blockNumber: Number(event.block.number),
      isPurged: false, 
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
  const memeTokenAddress = event.args.memeToken;

  const results = await context.client.multicall({
    contracts: [
      {
        abi: Erc20Abi,
        address: memeTokenAddress,
        functionName: 'name',
      },
      {
        abi: Erc20Abi,
        address: memeTokenAddress,
        functionName: 'symbol',
      },
      {
        abi: Erc20Abi,
        address: memeTokenAddress,
        functionName: 'decimals'
      },
      {
        abi: context.contracts.MemeCelo_0_1_0.abi,
        address: context.contracts.MemeCelo_0_1_0.address,
        functionName: 'UNLEASH_DELAY'
      }
    ]
  });

  await context.db.MemeToken.create({
    id: `celo-${event.args.memeToken}`,
    data: {
      chain: "celo",
      owner: event.args.summoner,
      memeToken: event.args.memeToken,
      memeNonce: 0n,
      name: results[0].result,
      symbol: results[1].result,
      decimals: BigInt(results[2].result),
      lpPairAddress: "",
      lpTokenId: 0n,
      liquidity: 0n,
      heartCount: 0n,
      heartAmount: 0n,
      isUnleashed: false,
      unleashableTimestamp: Number(event.block.timestamp) + Number(results[3].result),
      summonTime: Number(event.block.timestamp),
      unleashTime: 0, 
      summoner: event.args.summoner,
      timestamp: Number(event.block.timestamp),
      blockNumber: Number(event.block.number),
      isPurged: false, 
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
      unleashTime: Number(event.block.timestamp),
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
      unleashTime: Number(event.block.timestamp),
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
  const memeToken = await context.db.MemeToken.findUnique({
    id: `base-${event.args.memeNonce}`,
  });

  if (memeToken) {
    await context.db.PurgeEvent.create({
      id: event.log.id,
      data: {
        chain: "base",
        memeToken: event.args.memeToken,
        timestamp: Number(event.block.timestamp),
        blockNumber: Number(event.block.number),
      },
    });

    await context.db.MemeToken.update({
      id: `base-${event.args.memeNonce}`,
      data: {
        isPurged: true,
        purgeTime: Number(event.block.timestamp),
      },
    });
  } else {
    console.log(`MemeToken with ID base-${event.args.memeNonce} not found.`);
  }
});

ponder.on("MemeCelo_0_2_0:Purged", async ({ event, context }) => {
  const memeToken = await context.db.MemeToken.findUnique({
    id: `celo-${event.args.memeNonce}`,
  });

  if (memeToken) {
    await context.db.PurgeEvent.create({
      id: event.log.id,
      data: {
        chain: "celo",
        memeToken: event.args.memeToken,
        timestamp: Number(event.block.timestamp),
        blockNumber: Number(event.block.number),
      },
    });

    await context.db.MemeToken.update({
      id: `celo-${event.args.memeNonce}`,
      data: {
        isPurged: true,
        purgeTime: Number(event.block.timestamp),
      },
    });
  } else {
    console.log(`MemeToken with ID celo-${event.args.memeNonce} not found.`);
  }
});

ponder.on("MemeBase_0_2_0:Summoned", async ({ event, context }) => {
  const memeSummon = await context.client.readContract({
    abi: MemeFactoryAbiBase,
    address: context.contracts.MemeBase_0_2_0.address,
    functionName: "memeSummons",
    args: [event.args.memeNonce],
  });

  const unleashDelay = await context.client.readContract({
    abi: context.contracts.MemeBase_0_2_0.abi,
    address: context.contracts.MemeBase_0_2_0.address,
    functionName: "UNLEASH_DELAY",
  });

  await context.db.MemeToken.create({
    id: `base-${event.args.memeNonce}`,
    data: {
      chain: "base",
      owner: event.args.summoner,
      memeToken: "",
      memeNonce: event.args.memeNonce,
      name: memeSummon[0],
      symbol: memeSummon[1],
      decimals: 18n,
      lpPairAddress: "",
      lpTokenId: 0n,
      liquidity: 0n,
      heartCount: 0n,
      heartAmount: 0n,
      isUnleashed: false,
      unleashableTimestamp: Number(event.block.timestamp) + Number(unleashDelay),
      timestamp: Number(event.block.timestamp),
      blockNumber: Number(event.block.number),
      summoner: event.args.summoner,
      summonTime: Number(event.block.timestamp),
      unleashTime: 0,
      isPurged: false, 
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

  const abi = context.contracts.MemeCelo_0_2_0.abi;
  const contractAddress = context.contracts.MemeCelo_0_2_0.address;

  async function callContractFunction({
    functionName,
    args,
  }: {
    functionName: ContractFunctionName<typeof abi>,
    args?: ContractFunctionArgs<typeof abi>
  }) {
   // Step 1: Compose the data (encoded function call)
  const data = encodeFunctionData({
    abi,
    functionName,
    args,
  });

  // Step 2: Fetch the eth_call
  const response = await fetch("https://forno.celo.org", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      jsonrpc: "2.0",
      method: "eth_call",
      params: [
        {
          to: contractAddress,
          data: data,
        },
        "latest",
      ],
      id: 1,
    }),
  });

    const rdata = await response.json();

    // Step 3: Decode the result
    const decoded = decodeFunctionResult({
      abi,
      functionName,
      data: rdata.result,
    });

    return decoded;
  }

  const memeNonce = await callContractFunction({ functionName: 'memeSummons', args: [event.args.memeNonce] }) as any

  const name = memeNonce[0];
  const symbol = memeNonce[1];

  const unleashDelay = await callContractFunction({ functionName: 'UNLEASH_DELAY' }) as bigint

  await context.db.MemeToken.create({
    id: `celo-${event.args.memeNonce}`,
    data: {
      chain: "celo",
      owner: event.args.summoner,
      memeToken: "",
      memeNonce: event.args.memeNonce,
      name: name,
      symbol: symbol,
      decimals: 18n,
      lpPairAddress: "",
      lpTokenId: 0n,
      liquidity: 0n,
      heartCount: 0n,
      heartAmount: 0n,
      isUnleashed: false,
      unleashableTimestamp: Number(event.block.timestamp) + Number(unleashDelay),
      timestamp: Number(event.block.timestamp),
      blockNumber: Number(event.block.number),
      summoner: event.args.summoner,
      summonTime: Number(event.block.timestamp),
      unleashTime: 0,
      isPurged: false, 
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
      unleashTime: Number(event.block.timestamp),
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
      unleashTime: Number(event.block.timestamp),
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