import * as dotenv from 'dotenv'
import {
  CrossOperation,
  type ExecutableOperation,
  MCNAccount,
  MCNProvider,
  MCNWallet,
  type OperationSummary,
  SocotraNetwork,
} from 'juneojs'
dotenv.config()

async function main() {
  const provider: MCNProvider = new MCNProvider(SocotraNetwork)
  const wallet: MCNWallet = MCNWallet.recover(
    process.env.MNEMONIC ?? '',
    provider.mcn.hrp,
  )
  const mcnAccount: MCNAccount = new MCNAccount(provider, wallet)
  // we instantiate a cross operation that we want to perform
  const cross: CrossOperation = new CrossOperation(
    // source
    provider.jvmChain,
    // destination
    provider.platformChain,
    provider.juneAssetId,
    BigInt(1_000_000_000), // 1 JUNE
  )
  // estimate the operation
  const summary: OperationSummary = await mcnAccount.estimate(cross)
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
