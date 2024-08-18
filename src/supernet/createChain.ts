import * as dotenv from 'dotenv'
import {
  CreateChainOperation,
  EVMAllocation,
  MCNAccount,
  MCNProvider,
  NetworkOperationStatus,
  OperationSummary,
  SocotraNetwork,
  SupernetEVMGenesis,
} from 'juneojs'
import {
  chainIdCheck,
  chainNameCheck,
  genesisMintAddressCheck,
  supernetIdCheck,
} from './_checks.spec'

dotenv.config()
async function main() {
  const provider: MCNProvider = new MCNProvider(SocotraNetwork)
  const account: MCNAccount = provider.recoverAccount(process.env.MNEMONIC!)

  // Operation parameters
  const supernetId = 'ZxTjijy4iNthRzuFFzMH5RS2BgJemYxwgZbzqzEhZJWqSnwhP'
  const chainName = 'Chain A'
  const vmId = 'supernetevm'
  const chainId = 330333
  const genesisMintAddress = '0x44542FD7C3F096aE54Cc07833b1C0Dcf68B7790C'
  const genesisMintAmount = BigInt('1000000000000000000000000')
  const genesisData: string = new SupernetEVMGenesis(chainId, [
    new EVMAllocation(genesisMintAddress, genesisMintAmount),
  ]).generate()

  // Checks before executing script
  supernetIdCheck(supernetId)
  chainNameCheck(chainName)
  chainIdCheck(chainId)
  genesisMintAddressCheck(genesisMintAddress)

  // Operation instantiation and execution
  const createChainOperation = new CreateChainOperation(
    provider.platformChain,
    supernetId,
    chainName,
    vmId,
    genesisData,
  )
  const summary: OperationSummary = await account.estimate(createChainOperation)
  await account.execute(summary)

  console.log(summary.getExecutable().status)
  if (summary.getExecutable().status === NetworkOperationStatus.Done) {
    console.log(
      `Created chain with id: ${summary.getExecutable().receipts[0].transactionId}`,
    )
  }
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
