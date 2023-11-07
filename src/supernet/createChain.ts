import * as dotenv from 'dotenv'
import {
  Address,
  type CreateChainTransaction,
  CreateSupernetTransaction,
  DynamicId,
  EVMAllocation,
  MCNProvider,
  MCNWallet,
  SupernetEVMGenesis,
  type Utxo,
  buildCreateChainTransaction,
  fetchUtxos,
} from 'juneojs'

dotenv.config()
async function main() {
  const provider: MCNProvider = new MCNProvider()
  const masterWallet: MCNWallet = MCNWallet.recover(process.env.MNEMONIC ?? '')
  const sendersAddresses: string[] = [
    masterWallet.getAddress(provider.platform.chain),
  ]
  const utxoSet: Utxo[] = await fetchUtxos(provider.platform, sendersAddresses)
  const fee: number = (await provider.info.getTxFee()).createBlockchainTxFee
  const supernetId: string = 'ZxTjijy4iNthRzuFFzMH5RS2BgJemYxwgZbzqzEhZJWqSnwhP'
  const createSupernetTx: CreateSupernetTransaction =
    CreateSupernetTransaction.parse(
      (await provider.platform.getTx(supernetId)).tx,
    )
  const chainName: string = 'Chain A'
  const vmId: DynamicId = new DynamicId('supernetevm')
  const fxIds: DynamicId[] = []
  const chainId: number = 330333
  const genesisMintAddress: string = '0x44542FD7C3F096aE54Cc07833b1C0Dcf68B7790C'
  const genesisMintAmount: bigint = BigInt('1000000000000000000000000')
  const genesisData: string = new SupernetEVMGenesis(chainId, [
    new EVMAllocation(
      genesisMintAddress,
      genesisMintAmount
    ),
  ]).generate()

  // Checks, if not updated will throw error
  if(supernetId === 'ZxTjijy4iNthRzuFFzMH5RS2BgJemYxwgZbzqzEhZJWqSnwhP') throw Error("Please update the supernetId variable to that of a supernet you wish to validate.")
  if(chainName === 'Chain A') throw Error("Please update the chainName variable.")
  if(chainId === 330333) throw Error("Please update the chainId vairable.")
  if(genesisMintAddress === '0x44542FD7C3F096aE54Cc07833b1C0Dcf68B7790C') throw Error("Please update the genesisMintAddress variable to an address you can access.")
  
  const createChainTx: CreateChainTransaction = buildCreateChainTransaction(
    utxoSet,
    sendersAddresses,
    BigInt(fee),
    provider.platform.chain,
    supernetId,
    chainName,
    provider.platform.chain.assetId,
    vmId,
    fxIds,
    genesisData,
    createSupernetTx.getSupernetAuth(Address.toAddresses(sendersAddresses)),
    masterWallet.getAddress(provider.platform.chain),
    provider.mcn.id,
  )
  const txId: string = (
    await provider.platform.issueTx(
      createChainTx
        .signTransaction([masterWallet.getWallet(provider.platform.chain)])
        .toCHex(),
    )
  ).txID
  console.log(`Created chain with id: ${txId}`)
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
