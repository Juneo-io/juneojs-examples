import {
  GetCurrentValidatorsResponse,
  MCNProvider,
  SocotraNetwork,
} from 'juneojs'

async function main() {
  const provider: MCNProvider = new MCNProvider(SocotraNetwork)
  const currentValidators: GetCurrentValidatorsResponse =
    await provider.platformApi.getCurrentValidators()
  const nodeId: string = 'NodeID-DXGCAZFrcwfBmgXMePrTm2EU8N3s46wEq'
  console.log(`Looking for node: ${nodeId}...`)
  for (const validator of currentValidators.validators) {
    if (validator.nodeID === nodeId) {
      console.log(JSON.stringify(validator))
    }
  }
  console.log('Done')
}

main()
