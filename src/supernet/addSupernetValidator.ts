import * as dotenv from 'dotenv'
import {
  type AddSupernetValidatorTransaction,
  Address,
  CreateSupernetTransaction,
  MCNProvider,
  MCNWallet,
  NodeId,
  SupernetId,
  TestNetwork,
  type Utxo,
  buildAddSupernetValidatorTransaction,
  fetchUtxos,
  now,
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
  const startTime: bigint = now() + BigInt(30)
  const durationInDays: number = 4
  const endTime: bigint = startTime + BigInt(3600 * 24 * durationInDays + 30)
  const weight: bigint = BigInt(100)
  const supernetId: string = 'ZxTjijy4iNthRzuFFzMH5RS2BgJemYxwgZbzqzEhZJWqSnwhP'
  const createSupernetTx: CreateSupernetTransaction =
    CreateSupernetTransaction.parse(
      (await provider.platformApi.getTx(supernetId)).tx,
    )

  // Checks before executing script
  supernetIdCheck(supernetId)
  nodeIdCheck(nodeId)

  const addSupernetValidatorTx: AddSupernetValidatorTransaction =
    buildAddSupernetValidatorTransaction(
      utxoSet,
      sendersAddresses,
      BigInt(fee),
      provider.platformChain,
      new NodeId(nodeId),
      startTime,
      endTime,
      weight,
      new SupernetId(supernetId),
      createSupernetTx.getSupernetAuth(Address.toAddresses(sendersAddresses)),
      masterWallet.getAddress(provider.platformChain),
      provider.mcn.id,
    )
  const txId: string = (
    await provider.platformApi.issueTx(
      addSupernetValidatorTx
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
