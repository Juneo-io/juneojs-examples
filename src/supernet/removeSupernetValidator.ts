import * as dotenv from 'dotenv'
import {
  MCNAccount,
  MCNProvider,
  OperationSummary,
  RemoveSupernetValidatorOperation,
  SocotraNetwork,
} from 'juneojs'
import { nodeIdCheck, supernetIdCheck } from './_checks.spec'

dotenv.config()
async function main() {
  const provider: MCNProvider = new MCNProvider(SocotraNetwork)
  const account: MCNAccount = provider.recoverAccount(process.env.MNEMONIC!)

  // Operation parameters
  const nodeId = 'NodeID-B2GHMQ8GF6FyrvmPUX6miaGeuVLH9UwHr'
  const supernetId = 'ZxTjijy4iNthRzuFFzMH5RS2BgJemYxwgZbzqzEhZJWqSnwhP'

  // Checks before executing script
  supernetIdCheck(supernetId)
  nodeIdCheck(nodeId)

  // Operation instantiation and execution
  const removeSupernetValidatorOperation = new RemoveSupernetValidatorOperation(
    provider.platformChain,
    supernetId,
    nodeId,
  )
  const summary: OperationSummary = await account.estimate(
    removeSupernetValidatorOperation,
  )
  await account.execute(summary)
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
