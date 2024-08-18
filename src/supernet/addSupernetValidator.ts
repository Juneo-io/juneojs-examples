import * as dotenv from 'dotenv'
import {
  AddSupernetValidatorOperation,
  MCNAccount,
  MCNProvider,
  OperationSummary,
  SocotraNetwork,
  TimeUtils,
} from 'juneojs'
import { nodeIdCheck, supernetIdCheck } from './_checks.spec'

dotenv.config()
async function main() {
  const provider: MCNProvider = new MCNProvider(SocotraNetwork)
  const account: MCNAccount = provider.recoverAccount(process.env.MNEMONIC!)

  // Operation parameters
  const nodeId = 'NodeID-B2GHMQ8GF6FyrvmPUX6miaGeuVLH9UwHr'
  const durationInDays = 20
  const stakeDuration = TimeUtils.day() * BigInt(durationInDays)
  const weight = BigInt(100)
  const supernetId = 'ZxTjijy4iNthRzuFFzMH5RS2BgJemYxwgZbzqzEhZJWqSnwhP'

  // Checks before executing script
  supernetIdCheck(supernetId)
  nodeIdCheck(nodeId)

  // Operation instantiation and execution
  const addSupernetValidatorOperation = new AddSupernetValidatorOperation(
    provider.platformChain,
    supernetId,
    nodeId,
    weight,
    stakeDuration,
  )
  const summary: OperationSummary = await account.estimate(
    addSupernetValidatorOperation,
  )
  await account.execute(summary)
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
