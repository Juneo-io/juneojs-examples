import * as dotenv from 'dotenv'
import {
  MCNAccount,
  MCNProvider,
  MCNWallet,
  RemoveSupernetValidatorOperation,
  SocotraNetwork,
} from 'juneojs'
import { nodeIdCheck, supernetIdCheck } from './_checks.spec'

dotenv.config()
async function main() {
  const provider: MCNProvider = new MCNProvider(SocotraNetwork)
  const wallet: MCNWallet = MCNWallet.recover(
    process.env.MNEMONIC ?? '',
    provider.mcn.hrp,
  )
  const mcnAccount: MCNAccount = new MCNAccount(provider, wallet)

  // Operation parameters
  const nodeId: string = 'NodeID-B2GHMQ8GF6FyrvmPUX6miaGeuVLH9UwHr'
  const supernetId: string = 'ZxTjijy4iNthRzuFFzMH5RS2BgJemYxwgZbzqzEhZJWqSnwhP'

  // Checks before executing script
  supernetIdCheck(supernetId)
  nodeIdCheck(nodeId)

  // Operation instantiation and execution
  const removeSupernetValidatorOperation: RemoveSupernetValidatorOperation =
    new RemoveSupernetValidatorOperation(
      provider.platformChain,
      supernetId,
      nodeId,
    )
  const summary = await mcnAccount.estimate(removeSupernetValidatorOperation)
  await mcnAccount.execute(summary)
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
