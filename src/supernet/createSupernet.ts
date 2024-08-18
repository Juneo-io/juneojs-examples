import * as dotenv from 'dotenv'
import {
  CreateSupernetOperation,
  MCNAccount,
  MCNProvider,
  NetworkOperationStatus,
  OperationSummary,
  SocotraNetwork,
} from 'juneojs'

dotenv.config()
async function main() {
  const provider: MCNProvider = new MCNProvider(SocotraNetwork)
  const account: MCNAccount = provider.recoverAccount(process.env.MNEMONIC!)

  // Operation parameters
  const supernetAuthAddresses: string[] = account
    .getAccount(provider.platformChain.id)
    .getSignersAddresses()
  const supernetAuthThreshold = supernetAuthAddresses.length

  // Operation instantiation and execution
  const createSupernetOperation = new CreateSupernetOperation(
    provider.platformChain,
    supernetAuthAddresses,
    supernetAuthThreshold,
  )
  const summary: OperationSummary = await account.estimate(
    createSupernetOperation,
  )
  await account.execute(summary)

  console.log(summary.getExecutable().status)
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
