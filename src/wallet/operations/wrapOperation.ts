import * as dotenv from 'dotenv'
import {
  type ExecutableOperation,
  MCNAccount,
  MCNProvider,
  NetworkOperationStatus,
  type OperationSummary,
  SocotraNetwork,
  WrapOperation,
} from 'juneojs'

dotenv.config()
async function main() {
  const provider: MCNProvider = new MCNProvider(SocotraNetwork)
  const account: MCNAccount = provider.recoverAccount(process.env.MNEMONIC!)
  // we instantiate a wrap operation that we want to perform on the june chain
  // note that wrap operation can only be done on EVM chains
  const wrapOperation = new WrapOperation(
    provider.juneChain,
    provider.juneChain.wrappedAsset,
    BigInt('1000000000000000000'),
  )
  // estimate the operation to get a summary
  const summary: OperationSummary = await account.estimate(wrapOperation)
  // from the summary we can get the executable operation that will be used to perform it
  const executable: ExecutableOperation = summary.getExecutable()
  // execute the operation
  await account.execute(summary)
  // check if the operation is successfull
  console.log(executable.status === NetworkOperationStatus.Done)
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
