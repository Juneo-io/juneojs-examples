import * as dotenv from 'dotenv'
import {
  DelegatePrimaryOperation,
  MCNAccount,
  MCNProvider,
  NetworkOperationStatus,
  SocotraNetwork,
  TimeUtils,
  ValidatePrimaryOperation,
  type ExecutableOperation,
  type OperationSummary,
  type StakingOperationSummary,
} from 'juneojs'

dotenv.config()
async function main() {
  const provider: MCNProvider = new MCNProvider(SocotraNetwork)
  const account: MCNAccount = provider.recoverAccount(process.env.MNEMONIC!)
  // the node id where to stake funds
  const nodeId: string = 'NodeID-DXGCAZFrcwfBmgXMePrTm2EU8N3s46wEq'
  // the amount to stake
  const stakeAmount = BigInt(1_000000000) // 1 JUNE
  // the time to end the stake with start time is staking period
  // staking period has a minimal and maximal value
  // the min duration is 14 days. But if you want to create delegation on the node
  // you should set a duration higher than 14 days
  // the duration of the validation
  const durationInDays = 20
  const stakeDuration = TimeUtils.day() * BigInt(durationInDays)
  // the addresses that will receive the stake once the validation ends
  const stakeAddresses: string[] = [
    account.wallet.getAddress(provider.platformChain),
  ]
  // the addresses that will receive the rewards once the validation ends
  const rewardsAddresses: string[] = [
    account.wallet.getAddress(provider.platformChain),
  ]
  // we instantiate a validate operation that we want to perform on the chain
  const validateOperation = new ValidatePrimaryOperation(
    provider.platformChain,
    nodeId,
    '0x87c92be581de7f2abcba91ec6319d79d7bd6bb781fd4832880c272ab0a5b5caa17428bcccdf869d4bb2558c8f06a21c2',
    '0x8f528af8e09d4fd6b7103eb2cd443bbcc66b103a3681b0f625bef0b37c74d73bd6d12c324c3431c9eee54d65183c827909296f14193c54626464db91a35e0ce538ab5ac52d10126e3878434d4b77482c5bfd2f04bc6fdb697ec5de5db123c77c',
    stakeAmount,
    stakeDuration,
    stakeAddresses,
    stakeAddresses.length,
    rewardsAddresses,
    rewardsAddresses.length,
  )
  // estimate the operation to get a summary
  const summary: OperationSummary = await account.estimate(validateOperation)
  // from the summary we can get the executable operation that will be used to perform it
  const executable: ExecutableOperation = summary.getExecutable()
  // execute the operation
  await account.execute(summary)
  // check if the operation is successfull
  console.log(executable.status === NetworkOperationStatus.Done)
  // to retrieve the potential reward from the summary we must first convert it
  // when estimating a validate or delegate operation it will always return a staking operation summary
  const validateSummary: StakingOperationSummary =
    summary as StakingOperationSummary
  console.log(validateSummary.potentialReward)
  // we can instantiate a delegate operation if we want to perform it instead of a validation
  const delegateOperation = new DelegatePrimaryOperation(
    provider.platformChain,
    nodeId,
    stakeAmount,
    stakeDuration,
    stakeAddresses,
    stakeAddresses.length,
    stakeAddresses,
    stakeAddresses.length,
  )
  const delegationSummary: OperationSummary =
    await account.estimate(delegateOperation)
  // execute the operation
  await account.execute(delegationSummary)
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
