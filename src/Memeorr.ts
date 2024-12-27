import { ponder } from "@/generated";
import { Erc20Abi } from "./abis/Erc20Abi";
import { MemeFactoryAbiBase } from "./abis/MemeFactoryAbiBase";
import { MemeFactoryAbiCelo } from "./abis/MemeFactoryAbiCelo";
import { decodeFunctionResult } from 'viem';

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
      }
    ]
  })

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
      summonTime: Number(event.block.timestamp), // New field
      unleashTime: 0, // New field, default to 0
      summoner: event.args.summoner, // New field
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
      }
    ]
  })

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
      summonTime: Number(event.block.timestamp), // New field
      unleashTime: 0, // New field, default to 0
      summoner: event.args.summoner, // New field
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
      unleashTime: Number(event.block.timestamp), // New field
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
      unleashTime: Number(event.block.timestamp), // New field
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
  const memeSummon = await context.client.readContract({
    abi: MemeFactoryAbiBase,
    address: "0x82A9c823332518c32a0c0eDC050Ef00934Cf04D4",
    functionName: "memeSummons",
    args: [event.args.memeNonce],
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
      timestamp: Number(event.block.timestamp),
      blockNumber: Number(event.block.number),
      summoner: event.args.summoner,
      summonTime: Number(event.block.timestamp),
      unleashTime: 0,
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

  // const results = await context.client.multicall({
  //   contracts: [
  //     {
  //       abi: MemeFactoryAbiCelo,
  //       address: "0xEea5F1e202dc43607273d54101fF8b58FB008A99",
  //       functionName: 'memeSummons',
  //       args: [event.args.memeNonce],
  //     }
  //   ]
  // })
  // const memeSummon = await context.client.readContract({
  //   abi: MemeFactoryAbiCelo,
  //   address: "0xEea5F1e202dc43607273d54101fF8b58FB008A99",
  //   functionName: "memeSummons",
  //   args: [event.args.memeNonce],
  // });
  function composeData(memeNonce) {
    // creates eg "0x72f2a36b0000000000000000000000000000000000000000000000000000000000000001" from nonce 1
    const methodId = "0x72f2a36b"; // First 8 hex characters of the data
    const paddedNonce = memeNonce.toString(16).padStart(64, "0"); // Convert to hex and pad to 64 characters
    return methodId + paddedNonce; // Concatenate method ID with padded nonce
  }
  const data = composeData(event.args.memeNonce);
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
          to: "0xEea5F1e202dc43607273d54101fF8b58FB008A99",
          data: data,
        },
        "latest",
      ],
      id: 1,
    }),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }

  const rdata = await response.json();

  const decoded = decodeFunctionResult({
      abi: MemeFactoryAbiCelo,
      functionName: 'memeSummons',
      data: rdata.result,
    });

  const name = decoded[0];
  const symbol = decoded[1];

  await context.db.MemeToken.create({
    id: `celo-${event.args.memeNonce}`,
    data: {
      chain: "celo",
      owner: event.args.summoner,
      memeToken: "",
      memeNonce: event.args.memeNonce,
      // name: results[0].result[0],
      // symbol: results[0].result[1],
      // name: memeSummon[0],
      // symbol: memeSummon[1],
      name: name,
      symbol: symbol,
      decimals: 18n,
      lpPairAddress: "",
      lpTokenId: 0n,
      liquidity: 0n,
      heartCount: 0n,
      heartAmount: 0n,
      isUnleashed: false,
      timestamp: Number(event.block.timestamp),
      blockNumber: Number(event.block.number),
      summoner: event.args.summoner,
      summonTime: Number(event.block.timestamp),
      unleashTime: 0,
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
      unleashTime: Number(event.block.timestamp), // New field
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
      unleashTime: Number(event.block.timestamp), // New field
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