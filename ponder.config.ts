import { createConfig } from "@ponder/core";
import { http } from "viem";

import { MemeAbi_0_1_0 } from "./abis/MemeABI_0_1_0";
import { MemeAbi_0_2_0 } from "./abis/MemeABI_0_2_0";

export default createConfig({
  networks: {
    // mainnet: {
    //   chainId: 1,
    //   transport: http(process.env.PONDER_RPC_URL_1),
    // },
    base: {
      chainId: 8453,
      transport: http(process.env.PONDER_RPC_URL_8453, { timeout: 1000 }),
      pollingInterval: 5000,
      maxRequestsPerSecond: 10,
    },
    celo: {
      chainId: 42220,
      transport: http(process.env.PONDER_RPC_URL_42220, { timeout: 1000 }),
      pollingInterval: 5000,
      maxRequestsPerSecond: 10,
    },
  },
  contracts: {
    // 0.1.0
    MemeBase_0_1_0: {      
      network: "base",
      abi: MemeAbi_0_1_0,
      address: "0x42156841253f428cB644Ea1230d4FdDFb70F8891",
      startBlock: 21757872,
    },
    MemeCelo_0_1_0: {
      network: "celo",
      abi: MemeAbi_0_1_0,
      address: "0x42156841253f428cB644Ea1230d4FdDFb70F8891",
      startBlock: 28527007,
    },
    // 0.2.0
    MemeBase_0_2_0: {      
      network: "base",
      abi: MemeAbi_0_2_0,
      address: "0x82A9c823332518c32a0c0eDC050Ef00934Cf04D4",
      startBlock: 23540622,
    },
    MemeCelo_0_2_0: {
      network: "celo",
      abi: MemeAbi_0_2_0,
      address: "0xEea5F1e202dc43607273d54101fF8b58FB008A99",
      startBlock: 29240080,
    },
  },
});
