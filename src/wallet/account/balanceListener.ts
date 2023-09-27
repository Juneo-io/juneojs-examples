import * as dotenv from 'dotenv';
import { BalanceListener, BalanceUpdateEvent, ChainAccount, MCNAccount, MCNProvider, MCNWallet, SocotraJUNEAssetId, SocotraJUNEChain } from "juneojs";

dotenv.config();
async function main () {
    const provider: MCNProvider = new MCNProvider()
    const wallet: MCNWallet = MCNWallet.recover(process.env.MNEMONIC ?? '')
    const mcnAccount: MCNAccount = new MCNAccount(provider, wallet)
    const juneAccount: ChainAccount = mcnAccount.getAccount(SocotraJUNEChain.id)
    // the asset id of the balance we will listen to
    const assetId: string = SocotraJUNEAssetId
    // the listener we want to use
    const listener: BalanceListener = new ExampleComponent()
    // registering the listener for balance events
    juneAccount.addBalanceListener(assetId, listener)
}

class ExampleComponent implements BalanceListener {
    onBalanceUpdateEvent (event: BalanceUpdateEvent) {
        console.log(event.previousValue + ' => ' + event.value)
    }
}

main().catch((error) => {
    console.error(error)
    process.exitCode = 1
})
