import * as dotenv from 'dotenv'
import {
  CreateSupernetOperation,
  MCNAccount,
  MCNProvider,
  MCNWallet,
  NetworkOperationStatus,
  SocotraNetwork,
} from 'juneojs'

dotenv.config()
async function main() {
  const provider: MCNProvider = new MCNProvider(SocotraNetwork)
  const wallet: MCNWallet = MCNWallet.recover(process.env.MNEMONIC ?? '')
  const mcnAccount: MCNAccount = new MCNAccount(provider, wallet)

  // Operation parameters
  const supernetAuthAddresses: string[] = mcnAccount
    .getAccount(provider.platformChain.id)
    .getSignersAddresses()
  const supernetAuthThreshold: number = supernetAuthAddresses.length

  // Operation instantiation and execution
  const createSupernetOperation: CreateSupernetOperation =
    new CreateSupernetOperation(
      provider.platformChain,
      supernetAuthAddresses,
      supernetAuthThreshold,
    )
  const summary = await mcnAccount.estimate(createSupernetOperation)
  await mcnAccount.execute(summary)

  if (summary.getExecutable().status === NetworkOperationStatus.Done) {
    console.log(
      `Created supernet with id: ${summary.getExecutable().receipts[0].transactionId}`,
    )
  }
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
