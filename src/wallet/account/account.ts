import * as dotenv from 'dotenv'
import {
  EVMAccount,
  JVMAccount,
  MCNAccount,
  MCNProvider,
  SocotraNetwork,
  SocotraWJUNEAsset,
  UtxoAccount,
  type AssetValue,
  type ChainAccount,
} from 'juneojs'

dotenv.config()
async function main() {
  const provider: MCNProvider = new MCNProvider(SocotraNetwork)
  // create a MCNAccount from the provider with the chains of the default used MCN
  const account: MCNAccount = provider.recoverAccount(process.env.MNEMONIC!)
  // getting the account of one chain
  // note that if you are trying to retrieve the account of a chain that is not registered
  // in the creation of the MCNAccount you will get an error
  const chainAccount: ChainAccount = account.getAccount(provider.juneChain.id)
  // we can fetch the balances
  // it can be done individually
  await chainAccount.fetchBalance(provider.juneChain.assetId)
  // or with multiple values
  await chainAccount.fetchBalances([
    SocotraWJUNEAsset.assetId,
    provider.juneAssetId,
  ])
  // the balance can be retrieved with either a provider and an asset id
  // the provider will try to gather information about the asset id from the network
  let balance: AssetValue = await chainAccount.getValue(
    provider,
    provider.juneAssetId,
  )
  // or with a TokenAsset that already holds information about the asset (type, name, symbol, decimals)
  balance = chainAccount.getAssetValue(provider.juneChain.asset)
  // the returned balance will be an AssetValue which contains useful methods
  // this is the value that must be used to create transactions
  console.log(balance.value)
  // this value is human friendly and shows all the decimals
  console.log(balance.getReadableValue())
  // this value is rounded down up to 2 decimals
  console.log(balance.getReadableValueRounded())
  // this value is rounded down up to 6 decimals
  console.log(balance.getReadableValueRounded(6))

  // note that the JVM-Chain and Platform-Chain are both utxo accounts
  // and EVM chains are using nonce accounts
  const jvmAccount: UtxoAccount = new JVMAccount(provider, account.wallet)
  const juneAccount: EVMAccount = new EVMAccount(
    provider,
    provider.juneChain.id,
    account.wallet,
  )
  // in utxo accounts all the balances that are on the account on the network
  // should already be fetched because of the nature of utxos.
  // however in nonce accounts not all the balances at a given block can be
  // fetched that easily from the network. So if you want to get the balance
  // of a specific asset on such account, you should make sure that it is fetched first.
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
