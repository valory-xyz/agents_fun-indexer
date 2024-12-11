import { createSchema } from "@ponder/core";

export default createSchema((p) => ({
  CollectEvent: p.createTable({
    id: p.string(),
    chain: p.string(),
    hearter: p.string(),
    memeToken: p.string(),
    allocation: p.bigint(),
    timestamp: p.int(),
    blockNumber: p.int(),
  }),
  FeeCollectEvent: p.createTable({
    id: p.string(),
    chain: p.string(),
    feeCollector: p.string(),
    memeToken: p.string(),
    nativeTokenAmount: p.bigint(),
    memeTokenAmount: p.bigint(),
    timestamp: p.int(),
    blockNumber: p.int(),
  }),
  HeartEvent: p.createTable({
    id: p.string(),
    chain: p.string(),
    hearter: p.string(),
    memeToken: p.string().optional(),
    memeNonce: p.bigint().optional(),
    amount: p.bigint(),
    timestamp: p.int(),
    blockNumber: p.int(),
  }),
  OLASJourneyToAscendanceEvent: p.createTable({
    id: p.string(),
    chain: p.string(),
    olas: p.string().optional(),
    amount: p.bigint(),
    timestamp: p.int(),
    blockNumber: p.int(),
  }),
  PurgeEvent: p.createTable({
    id: p.string(),
    chain: p.string(),
    memeToken: p.string(),
    remainingAmount: p.bigint().optional(),
    timestamp: p.int(),
    blockNumber: p.int(),
  }),
  SummonEvent: p.createTable({
    id: p.string(),
    chain: p.string(),
    summoner: p.string(),
    memeToken: p.string().optional(),
    memeNonce: p.bigint().optional(),
    nativeTokenContributed: p.bigint(),
    timestamp: p.int(),
    blockNumber: p.int(),
  }),
  UnleashEvent: p.createTable({
    id: p.string(),
    chain: p.string(),
    unleasher: p.string(),
    memeToken: p.string().optional(),
    memeNonce: p.bigint().optional(),
    lpPairAddress: p.string().optional(),
    lpTokenId: p.bigint().optional(),
    liquidity: p.bigint(),
    burnPercentageOfStable: p.bigint().optional(),
    timestamp: p.int(),
    blockNumber: p.int(),
  }),
  MemeToken: p.createTable({
    id: p.string(),
    nonce: p.bigint().optional(),
    chain: p.string(),
    owner: p.string(),
    lpPairAddress: p.string().optional(),
    lpTokenId: p.bigint().optional(),
    liquidity: p.bigint(),
    heartCount: p.bigint(),
    isUnleashed: p.boolean(),
    timestamp: p.int(),
    blockNumber: p.int(),
    hearts: p.many("Heart.memeTokenId"),
    heartAmountId: p.string().references("totalHeartAmount.id"),
    heartAmount: p.one("heartAmountId"),
  }),
  Heart: p.createTable({
    id: p.string(),
    chain: p.string(),
    hearter: p.string(),
    memeTokenId: p.string().references("MemeToken.id").optional(),
    memeNonce: p.bigint().optional(),
    amount: p.bigint(),
    timestamp: p.int(),
    blockNumber: p.int(),
  }),
  totalHeartAmount: p.createTable({
    id: p.string(),
    nonce: p.bigint().optional(),
    chain: p.string(),
    amount: p.bigint(),
  }),
}));
