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
  SocotraJUNEAssetId,
  SocotraJUNEChain,
  SocotraJVMChain,
} from 'juneojs'

dotenv.config()
async function main() {
  const provider: MCNProvider = new MCNProvider()
  const wallet: MCNWallet = MCNWallet.recover(process.env.MNEMONIC ?? '')
  const mcnAccount: MCNAccount = new MCNAccount(provider, wallet)
  // the chain which we will perform the cross from
  const juneChain: JEVMBlockchain = SocotraJUNEChain
  // the chain we will perform the cross to
  const jvmChain: JVMBlockchain = SocotraJVMChain
  // we need balances to perform the operation
  await mcnAccount.fetchChainsBalances()
  const assetId: string = SocotraJUNEAssetId
  const amount: bigint = BigInt(1_000_000_000) // 1 JUNE
  const address: string = wallet.getAddress(jvmChain)
  // we instantiate a cross operation that we want to perform
  const cross: CrossOperation = new CrossOperation(
    juneChain,
    jvmChain,
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
