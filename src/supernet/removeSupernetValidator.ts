import * as dotenv from 'dotenv'
import {
  type AddSupernetValidatorTransaction,
  Address,
  CreateSupernetTransaction,
  MCNProvider,
  MCNWallet,
  NodeId,
  SupernetId,
  type Utxo,
  buildRemoveSupernetValidatorTransaction,
  fetchUtxos,
  now,
  RemoveSupernetValidatorTransaction,
} from 'juneojs'
import { nodeIdCheck, supernetIdCheck } from './_checks.spec'

dotenv.config()
async function main() {
  const provider: MCNProvider = new MCNProvider()
  const masterWallet: MCNWallet = MCNWallet.recover(process.env.MNEMONIC ?? '')
  const sendersAddresses: string[] = [
    masterWallet.getAddress(provider.platform.chain),
  ]
  const utxoSet: Utxo[] = await fetchUtxos(provider.platform, sendersAddresses)
  const fee: number = (await provider.info.getTxFee()).addSupernetValidatorFee
  const nodeId: string = 'NodeID-B2GHMQ8GF6FyrvmPUX6miaGeuVLH9UwHr'
  const supernetId: string = 'ZxTjijy4iNthRzuFFzMH5RS2BgJemYxwgZbzqzEhZJWqSnwhP'
  const createSupernetTx: CreateSupernetTransaction =
    CreateSupernetTransaction.parse(
      (await provider.platform.getTx(supernetId)).tx,
    )

  // Checks before executing script
  supernetIdCheck(supernetId)
  nodeIdCheck(nodeId)

  const removeSupernetValidatorTx: RemoveSupernetValidatorTransaction =
    buildRemoveSupernetValidatorTransaction(
      utxoSet,
      sendersAddresses,
      BigInt(fee),
      provider.platform.chain,
      new NodeId(nodeId),
      new SupernetId(supernetId),
      createSupernetTx.getSupernetAuth(Address.toAddresses(sendersAddresses)),
      masterWallet.getAddress(provider.platform.chain),
      provider.mcn.id,
    )
  const txId: string = (
    await provider.platform.issueTx(
      removeSupernetValidatorTx
        .signTransaction([masterWallet.getWallet(provider.platform.chain)])
        .toCHex(),
    )
  ).txID
  console.log(txId)
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
