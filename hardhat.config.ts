import * as dotenvenc from "@chainlink/env-enc";
dotenvenc.config();

import { HardhatUserConfig, extendEnvironment } from "hardhat/config";
import { createProvider } from "hardhat/internal/core/providers/construction";
import "@nomicfoundation/hardhat-toolbox";

const PRIVATE_KEY = process.env.PRIVATE_KEY;
const AVALANCHE_FUJI_RPC_URL = process.env.AVALANCHE_FUJI_RPC_URL;

// declare module "hardhat/types/runtime" {
//   export interface HardhatRuntimeEnvironment {
//     changeNetwork: Function;
//   }
// }

// extendEnvironment(async (hre) => {
//   hre.changeNetwork = async function changeNetwork(newNetwork: string) {
//     hre.network.name = newNetwork;
//     hre.network.config = hre.config.networks[newNetwork];
//     hre.ethers.provider = new hre.ethers.providers.JsonRpcProvider(
//       hre.network.config.url
//     );
//     hre.network.provider = await createProvider(hre.config, newNetwork);
//   };
// });

const config: HardhatUserConfig = {
  solidity: "0.8.19",
  defaultNetwork: "avalancheFuji", // Source Chain
  networks: {
    hardhat: {
      chainId: 31337,
    },
    avalancheFuji: {
      url: AVALANCHE_FUJI_RPC_URL !== undefined ? AVALANCHE_FUJI_RPC_URL : "",
      accounts: PRIVATE_KEY !== undefined ? [PRIVATE_KEY] : [],
      chainId: 43113,
    },
  },
};

export default config;
