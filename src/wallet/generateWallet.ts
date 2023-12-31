import {
  MCNWallet,
  type VMWallet,
  SocotraJVMChain,
  SocotraJUNEChain,
} from 'juneojs'

async function main() {
  // generating new master wallet
  const masterWallet: MCNWallet = MCNWallet.generate()
  // generated mnemonic
  console.log(masterWallet.mnemonic)
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
