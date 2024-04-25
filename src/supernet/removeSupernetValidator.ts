import * as dotenv from 'dotenv'
import {
  Address,
  CreateSupernetTransaction,
  MCNProvider,
  MCNWallet,
  NodeId,
  SupernetId,
  type Utxo,
  buildRemoveSupernetValidatorTransaction,
  fetchUtxos,
  RemoveSupernetValidatorTransaction,
  TestNetwork,
} from 'juneojs'
import { nodeIdCheck, supernetIdCheck } from './_checks.spec'

dotenv.config()
async function main() {
  const provider: MCNProvider = new MCNProvider(TestNetwork)
  const masterWallet: MCNWallet = MCNWallet.recover(process.env.MNEMONIC ?? '')
  const sendersAddresses: string[] = [
    masterWallet.getAddress(provider.platformChain),
  ]
  const utxoSet: Utxo[] = await fetchUtxos(
    provider.platformApi,
    sendersAddresses,
  )
  const fee: number = (await provider.info.getTxFee()).addSupernetValidatorFee
  const nodeId: string = 'NodeID-B2GHMQ8GF6FyrvmPUX6miaGeuVLH9UwHr'
  const supernetId: string = 'ZxTjijy4iNthRzuFFzMH5RS2BgJemYxwgZbzqzEhZJWqSnwhP'
  const createSupernetTx: CreateSupernetTransaction =
    CreateSupernetTransaction.parse(
      (await provider.platformApi.getTx(supernetId)).tx,
    )

  // Checks before executing script
  supernetIdCheck(supernetId)
  nodeIdCheck(nodeId)

  const removeSupernetValidatorTx: RemoveSupernetValidatorTransaction =
    buildRemoveSupernetValidatorTransaction(
      utxoSet,
      sendersAddresses,
      BigInt(fee),
      provider.platformChain,
      new NodeId(nodeId),
      new SupernetId(supernetId),
      createSupernetTx.getSupernetAuth(Address.toAddresses(sendersAddresses)),
      masterWallet.getAddress(provider.platformChain),
      provider.mcn.id,
    )
  const txId: string = (
    await provider.platformApi.issueTx(
      removeSupernetValidatorTx
        .signTransaction([masterWallet.getWallet(provider.platformChain)])
        .toCHex(),
    )
  ).txID
  console.log(txId)
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
