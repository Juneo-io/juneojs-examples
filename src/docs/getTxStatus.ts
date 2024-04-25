import { MCNProvider, TestNetwork } from 'juneojs'

async function main() {
  const provider: MCNProvider = new MCNProvider(TestNetwork)
  const txID: string = '9Km2dM9UgJAcXVMeLZrpBMXAbaRW1x2zNmErgpe4yXpdAtjoS'
  const tx: string | object = await provider.platformApi.getTxStatus(txID)
  console.log(tx)
}

main()
