import * as dotenv from 'dotenv'
import {
  type CreateSupernetTransaction,
  MCNProvider,
  MCNWallet,
  SocotraNetwork,
  type Utxo,
  buildCreateSupernetTransaction,
  fetchUtxos,
} from 'juneojs'

dotenv.config()
async function main() {
  const provider: MCNProvider = new MCNProvider(SocotraNetwork)
  const masterWallet: MCNWallet = MCNWallet.recover(process.env.MNEMONIC ?? '')
  const sendersAddresses: string[] = [
    masterWallet.getAddress(provider.platformChain),
  ]
  const utxoSet: Utxo[] = await fetchUtxos(
    provider.platformApi,
    sendersAddresses,
  )
  const fee: number = (await provider.info.getTxFee()).createSupernetTxFee
  const createSupernetTx: CreateSupernetTransaction =
    buildCreateSupernetTransaction(
      utxoSet,
      sendersAddresses,
      BigInt(fee),
      provider.platformChain,
      sendersAddresses,
      sendersAddresses.length,
      masterWallet.getAddress(provider.platformChain),
      provider.mcn.id,
    )
  const txId: string = (
    await provider.platformApi.issueTx(
      createSupernetTx
        .signTransaction([masterWallet.getWallet(provider.platformChain)])
        .toCHex(),
    )
  ).txID
  console.log(`Created supernet with id: ${txId}`)
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
