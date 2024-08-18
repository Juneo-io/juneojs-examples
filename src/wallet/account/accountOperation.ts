import * as dotenv from 'dotenv'
import {
  type ExecutableOperation,
  MCNAccount,
  MCNProvider,
  NetworkOperationStatus,
  type OperationSummary,
  SendOperation,
  SocotraNetwork,
} from 'juneojs'

dotenv.config()
async function main() {
  const provider: MCNProvider = new MCNProvider(SocotraNetwork)
  const account: MCNAccount = provider.recoverAccount(process.env.MNEMONIC!)
  // we instantiate an operation that we want to perform on the chain
  const operation = new SendOperation(
    provider.juneChain,
    provider.juneChain.assetId,
    BigInt('1000000000000000000'), // 1 JUNE
    '0x8fc822F43B9d4C4E83E5198C56A4FfBc43dbd19a',
  )
  // estimate returns a summary of the operation that contains data about it such as the fees to pay
  // note that if you try to estimate an operation which is not compatible with the chain
  // an error will be thrown. If you try to do an operation on a chain which is not
  // registered in the MCNAccount you will also encounter an error
  const summary: OperationSummary = await account.estimate(operation)
  console.log(summary.fees)
  // from the summary we can get the executable operation that will be used to perform it
  const executable: ExecutableOperation = summary.getExecutable()
  await account.execute(summary)
  // the executable has fields that can help keeping track of the current state of the operation
  console.log(executable.status === NetworkOperationStatus.Done)
  // a list of the current receipts created by the operation is also available
  console.log(executable.receipts)
  // once a finished status is set there should be no newer receipts into it
  // MCNOperationStatus.Done indicates that the executable successfully achieved all transactions
  // MCNOperationStatus.Error indicates that an error occured on one of the transactions and it stopped the operation
  // MCNOperationStatus.Timeout indicates that the executable stopped its execution because it was too long

  // because in this example we are doing a send operation which is pretty simple
  // there should be no more than one receipt into it but for more complex operations
  // there could be more transactions that are sent
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
