import * as dotenv from 'dotenv'
import {
  CrossOperation,
  type ExecutableOperation,
  type JEVMBlockchain,
  type JVMBlockchain,
  MCNAccount,
  MCNProvider,
  MCNWallet,
  type OperationSummary,
  TestNetwork,
} from 'juneojs'

dotenv.config()
async function main() {
  const provider: MCNProvider = new MCNProvider(TestNetwork)
  const wallet: MCNWallet = MCNWallet.recover(process.env.MNEMONIC ?? '')
  const mcnAccount: MCNAccount = new MCNAccount(provider, wallet)
  // the chain which we will perform the cross from
  const sourceChain: JEVMBlockchain = provider.juneChain
  // the chain we will perform the cross to
  const destinationChain: JVMBlockchain = provider.jvmChain
  // asset id of JUNE Chain is JUNE asset id
  const assetId: string = sourceChain.assetId
  const amount: bigint = BigInt(1_000_000_000) // 1 JUNE
  // we instantiate a cross operation that we want to perform
  const cross: CrossOperation = new CrossOperation(
    sourceChain,
    destinationChain,
    assetId,
    amount,
  )
  // estimate the operation
  const summary: OperationSummary = await mcnAccount.estimate(cross)
  console.log(summary.fees)
  // execute the operation
  await mcnAccount.execute(summary)
  const executable: ExecutableOperation = summary.getExecutable()
  // the receipts should contain multiple transaction ids
  // that were performed to complete the cross operation
  console.log(executable.receipts)
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
