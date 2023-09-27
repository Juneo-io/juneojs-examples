import * as dotenv from 'dotenv';
import { MCNWallet, SocotraJUNEChain, SocotraJVMChain, VMWallet } from 'juneojs';

dotenv.config();
async function main() {
    // recovering wallet from mnemonic
    const masterWallet: MCNWallet = MCNWallet.recover(process.env.MNEMONIC ?? '')
    const jvmChainAddress: string = masterWallet.getAddress(SocotraJVMChain)
    console.log(jvmChainAddress)
    const juneChainWallet: VMWallet = masterWallet.getWallet(SocotraJUNEChain)
    // june chain jeth address
    console.log(juneChainWallet.getJuneoAddress())
    // june chain evm hex address
    console.log(juneChainWallet.getAddress())
}

main().catch((error) => {
    console.error(error)
    process.exitCode = 1
})
