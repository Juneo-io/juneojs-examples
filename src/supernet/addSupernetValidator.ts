import * as dotenv from 'dotenv'
import {
  MCNProvider,
  MCNWallet,
  SocotraNetwork,
  now,
  AddSupernetValidatorOperation,
  MCNAccount,
} from 'juneojs'
import { nodeIdCheck, supernetIdCheck } from './_checks.spec'

dotenv.config()
async function main() {
  const provider: MCNProvider = new MCNProvider(SocotraNetwork)
  const wallet: MCNWallet = MCNWallet.recover(process.env.MNEMONIC ?? '')
  const mcnAccount: MCNAccount = new MCNAccount(provider, wallet)

  // Operation parameters
  const nodeId: string = 'NodeID-B2GHMQ8GF6FyrvmPUX6miaGeuVLH9UwHr'
  const startTime: bigint = now() + BigInt(30)
  const durationInDays: number = 4
  const endTime: bigint = startTime + BigInt(3600 * 24 * durationInDays + 30)
  const weight: bigint = BigInt(100)
  const supernetId: string = 'ZxTjijy4iNthRzuFFzMH5RS2BgJemYxwgZbzqzEhZJWqSnwhP'

  // Checks before executing script
  supernetIdCheck(supernetId)
  nodeIdCheck(nodeId)

  // Operation instantiation and execution
  const addSupernetValidatorOperation: AddSupernetValidatorOperation =
    new AddSupernetValidatorOperation(
      provider.platformChain,
      supernetId,
      nodeId,
      weight,
      startTime,
      endTime,
    )
  const summary = await mcnAccount.estimate(addSupernetValidatorOperation)
  await mcnAccount.execute(summary)
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
