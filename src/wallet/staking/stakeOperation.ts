import * as dotenv from 'dotenv'
import {
  DelegateOperation,
  type ExecutableOperation,
  MCNAccount,
  MCNProvider,
  MCNWallet,
  NetworkOperationStatus,
  type OperationSummary,
  type PlatformBlockchain,
  type StakingOperationSummary,
  ValidateOperation,
  now,
} from 'juneojs'

dotenv.config()
async function main() {
  const provider: MCNProvider = new MCNProvider()
  const wallet: MCNWallet = MCNWallet.recover(process.env.MNEMONIC ?? '')
  const mcnAccount: MCNAccount = new MCNAccount(provider, wallet)
  // the chain which we will perform an action on
  const platformChain: PlatformBlockchain = provider.platform.chain
  // the node id where to validate funds
  const nodeId: string = 'NodeID-DXGCAZFrcwfBmgXMePrTm2EU8N3s46wEq'
  // the amount to validate
  const stakeAmount: bigint = BigInt(1000000000)
  // the time to start validate (must be > now)
  const startTime: bigint = now() + BigInt(30)
  // the time to end the validate with start time is staking period
  // staking period has a minimal and maximal value
  const endTime: bigint = now() + BigInt(86400 * 15)
  // we instantiate a validate operation that we want to perform on the chain
  const validateOperation: ValidateOperation = new ValidateOperation(
    provider.mcn,
    nodeId,
    stakeAmount,
    startTime,
    endTime,
  )
  // estimate the operation to get a summary
  const summary: OperationSummary = await mcnAccount.estimate(validateOperation)
  // from the summary we can get the executable operation that will be used to perform it
  const executable: ExecutableOperation = summary.getExecutable()
  // execute the operation
  await mcnAccount.execute(summary)
  // check if the operation is successfull
  console.log(executable.status === NetworkOperationStatus.Done)
  // to retrieve the potential reward from the summary we must first convert it
  // when estimating a validate or delegate operation it will always return a staking operation summary
  const validateSummary: StakingOperationSummary =
    summary as StakingOperationSummary
  console.log(validateSummary.potentialReward)
  // we can instantiate a delegate operation if we want to perform it instead of a validation
  const delegateOperation: DelegateOperation = new DelegateOperation(
    provider.mcn,
    nodeId,
    stakeAmount,
    startTime,
    endTime,
  )
  const delegationSummary: OperationSummary =
    await mcnAccount.estimate(delegateOperation)
  // execute the operation
  await mcnAccount.execute(delegationSummary)
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
