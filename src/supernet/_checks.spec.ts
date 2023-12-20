/**
 * Checks before executing a script. Please do not update this file 
 * */

export function supernetIdCheck(supernetId: string) {
    if (supernetId === 'ZxTjijy4iNthRzuFFzMH5RS2BgJemYxwgZbzqzEhZJWqSnwhP')
        throw Error('Please update the supernetId variable')
}

export function chainNameCheck(chainName: string) {
    if (chainName === 'Chain A')
        throw Error('Please update the chainName variable.')
}

export function chainIdCheck(chainId: number) {
    if (chainId === 330333) throw Error('Please update the chainId variable.')
}

export function genesisMintAddressCheck(genesisMintAddress: string) {
    if (genesisMintAddress === '0x44542FD7C3F096aE54Cc07833b1C0Dcf68B7790C')
        throw Error(
            'Please update the genesisMintAddress variable to an address you can access.',
        )
}

export function nodeIdCheck(nodeId: string) {
    if (nodeId === 'NodeID-B2GHMQ8GF6FyrvmPUX6miaGeuVLH9UwHr')
        throw Error(
            'Please update the nodeID variable to your node id.',
        )
}
