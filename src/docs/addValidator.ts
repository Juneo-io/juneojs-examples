import {
  MCNAccount,
  MCNProvider,
  MCNWallet,
  SocotraNetwork,
  ValidatePrimaryOperation,
  now,
} from 'juneojs'

async function main() {
  // provider to interact with the MCN
  const provider: MCNProvider = new MCNProvider(SocotraNetwork)
  // recovering wallet used to sign transactions
  const wallet: MCNWallet = MCNWallet.recover(process.env.MNEMONIC ?? '')
  // an account is needed to use operations
  const mcnAccount: MCNAccount = new MCNAccount(provider, wallet)

  // the node id which will validate the funds
  const nodeId: string = 'NodeID-DXGCAZFrcwfBmgXMePrTm2EU8N3s46wEq'
  // the amount to validate
  const stakeAmount: bigint = BigInt(100 * 10 ** 9) // 100 JUNE
  // the time to start delegation (must be > now)
  const startTime: bigint = now() + BigInt(30)
  // the time to end the validation with start time is staking period
  // staking period has a minimal and maximal value
  const durationInDays: number = 20
  const endTime: bigint = now() + BigInt(86400 * durationInDays)
  const stakeAddresses: string[] = []
  const validateOperation: ValidatePrimaryOperation =
    new ValidatePrimaryOperation(
      provider.platformChain,
      nodeId,
      '0x87c92be581de7f2abcba91ec6319d79d7bd6bb781fd4832880c272ab0a5b5caa17428bcccdf869d4bb2558c8f06a21c2',
      '0x8f528af8e09d4fd6b7103eb2cd443bbcc66b103a3681b0f625bef0b37c74d73bd6d12c324c3431c9eee54d65183c827909296f14193c54626464db91a35e0ce538ab5ac52d10126e3878434d4b77482c5bfd2f04bc6fdb697ec5de5db123c77c',
      stakeAmount,
      startTime,
      endTime,
      stakeAddresses,
      stakeAddresses.length,
      stakeAddresses,
      stakeAddresses.length,
    )
  // estimate the operation to get a summary
  const summary = await mcnAccount.estimate(validateOperation)
  // execute the operation
  await mcnAccount.execute(summary)
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
