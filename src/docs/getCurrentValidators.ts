import { MCNProvider, SocotraNetwork } from 'juneojs'

async function main() {
  const provider: MCNProvider = new MCNProvider(SocotraNetwork)
  const nodeId = 'NodeID-DXGCAZFrcwfBmgXMePrTm2EU8N3s46wEq'
  const currentValidators = await provider.platformApi.getCurrentValidators(
    provider.mcn.primary.id,
    [nodeId],
  )
  console.log(`Looking for node: ${nodeId}...`)
  console.log(JSON.stringify(currentValidators.validators[0]))
  console.log('Done')
}

main()
