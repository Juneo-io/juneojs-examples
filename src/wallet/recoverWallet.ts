import * as dotenv from 'dotenv'
import {
  MCNProvider,
  MCNWallet,
  SocotraJUNEChain,
  SocotraJVMChain,
  SocotraNetwork,
  type VMWallet,
} from 'juneojs'

dotenv.config()
async function main() {
  const provider: MCNProvider = new MCNProvider(SocotraNetwork)
  // recovering wallet from mnemonic
  const wallet: MCNWallet = provider.mcn.recoverWallet(process.env.MNEMONIC!)
  // can also be done this way with 12 being words count
  const wallet2 = new MCNWallet(provider.mcn.hrp, process.env.MNEMONIC!)
  const jvmChainAddress: string = wallet.getAddress(SocotraJVMChain)
  console.log(jvmChainAddress)
  const juneChainWallet: VMWallet = wallet.getWallet(SocotraJUNEChain)
  // june chain jeth address
  console.log(juneChainWallet.getJuneoAddress())
  // june chain evm hex address
  console.log(juneChainWallet.getAddress())
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
