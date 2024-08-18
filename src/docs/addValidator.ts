import * as dotenv from 'dotenv'
import {
  MCNAccount,
  MCNProvider,
  OperationSummary,
  SocotraNetwork,
  TimeUtils,
  ValidatePrimaryOperation,
} from 'juneojs'
dotenv.config()

async function main() {
  // provider to interact with the MCN
  const provider: MCNProvider = new MCNProvider(SocotraNetwork)
  // recovering account used to sign transactions
  const account: MCNAccount = provider.recoverAccount(process.env.MNEMONIC!)

  // the node id which will validate the funds
  const nodeId = 'NodeID-DXGCAZFrcwfBmgXMePrTm2EU8N3s46wEq'
  // the amount to validate
  const stakeAmount = BigInt(100 * 10 ** 9) // 100 JUNE
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
  // execute the operation
  await account.execute(summary)
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
