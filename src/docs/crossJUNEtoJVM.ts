import * as dotenv from 'dotenv'
import {
  CrossOperation,
  type ExecutableOperation,
  MCNAccount,
  MCNProvider,
  type OperationSummary,
  SocotraNetwork,
} from 'juneojs'
dotenv.config()

async function main() {
  const provider: MCNProvider = new MCNProvider(SocotraNetwork)
  const account: MCNAccount = provider.recoverAccount(process.env.MNEMONIC!)
  // we instantiate a cross operation that we want to perform
  const cross = new CrossOperation(
    // source
    provider.juneChain,
    // destination
    provider.jvmChain,
    provider.juneAssetId,
    BigInt('1100000000000000000'), // 1.1 JUNE
  )
  // estimate the operation
  const summary: OperationSummary = await account.estimate(cross)
  // execute the operation
  await account.execute(summary)
  const executable: ExecutableOperation = summary.getExecutable()
  // the receipts should contain multiple transaction ids
  // that were performed to complete the cross operation
  console.log(executable.receipts)
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
