import * as dotenv from 'dotenv'
import {
  CrossOperation,
  type ExecutableOperation,
  type JEVMBlockchain,
  type JVMBlockchain,
  MCNAccount,
  MCNProvider,
  type OperationSummary,
  SocotraNetwork,
} from 'juneojs'

dotenv.config()
async function main() {
  const provider: MCNProvider = new MCNProvider(SocotraNetwork)
  const account: MCNAccount = provider.recoverAccount(process.env.MNEMONIC!)
  // the chain which we will perform the cross from
  const sourceChain: JEVMBlockchain = provider.juneChain
  // the chain we will perform the cross to
  const destinationChain: JVMBlockchain = provider.jvmChain
  // asset id of JUNE Chain is JUNE asset id
  const assetId: string = sourceChain.assetId
  const amount = BigInt(1_000_000_000) // 1 JUNE
  // we instantiate a cross operation that we want to perform
  const cross = new CrossOperation(
    sourceChain,
    destinationChain,
    assetId,
    amount,
  )
  // estimate the operation
  const summary: OperationSummary = await account.estimate(cross)
  console.log(summary.fees)
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
