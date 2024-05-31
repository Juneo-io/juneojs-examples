import * as dotenv from 'dotenv'
import {
  type BalanceListener,
  type BalanceUpdateEvent,
  type ChainAccount,
  MCNAccount,
  MCNProvider,
  MCNWallet,
  SocotraNetwork,
} from 'juneojs'

dotenv.config()
async function main() {
  const provider: MCNProvider = new MCNProvider(SocotraNetwork)
  const wallet: MCNWallet = MCNWallet.recover(
    process.env.MNEMONIC ?? '',
    provider.mcn.hrp,
  )
  const mcnAccount: MCNAccount = new MCNAccount(provider, wallet)
  const juneAccount: ChainAccount = mcnAccount.getAccount(provider.juneChain.id)
  // the asset id of the balance we will listen to
  const assetId: string = provider.juneChain.assetId
  // the listener we want to use
  const listener: BalanceListener = new ExampleComponent()
  // registering the listener for balance events
  juneAccount.getBalance(assetId).registerEvents(listener)
}

class ExampleComponent implements BalanceListener {
  onBalanceUpdateEvent(event: BalanceUpdateEvent) {
    console.log(event.previousValue + ' => ' + event.value)
  }
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
