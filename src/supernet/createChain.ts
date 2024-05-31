import * as dotenv from 'dotenv'
import {
  CreateChainOperation,
  EVMAllocation,
  MCNAccount,
  MCNProvider,
  MCNWallet,
  NetworkOperationStatus,
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
  const wallet: MCNWallet = MCNWallet.recover(
    process.env.MNEMONIC ?? '',
    provider.mcn.hrp,
  )
  const mcnAccount: MCNAccount = new MCNAccount(provider, wallet)

  // Operation parameters
  const supernetId: string = 'ZxTjijy4iNthRzuFFzMH5RS2BgJemYxwgZbzqzEhZJWqSnwhP'
  const chainName: string = 'Chain A'
  const vmId: string = 'supernetevm'
  const chainId: number = 330333
  const genesisMintAddress: string =
    '0x44542FD7C3F096aE54Cc07833b1C0Dcf68B7790C'
  const genesisMintAmount: bigint = BigInt('1000000000000000000000000')
  const genesisData: string = new SupernetEVMGenesis(chainId, [
    new EVMAllocation(genesisMintAddress, genesisMintAmount),
  ]).generate()

  // Checks before executing script
  supernetIdCheck(supernetId)
  chainNameCheck(chainName)
  chainIdCheck(chainId)
  genesisMintAddressCheck(genesisMintAddress)

  // Operation instantiation and execution
  const createChainOperation: CreateChainOperation = new CreateChainOperation(
    provider.platformChain,
    supernetId,
    chainName,
    vmId,
    genesisData,
  )
  const summary = await mcnAccount.estimate(createChainOperation)
  await mcnAccount.execute(summary)

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
