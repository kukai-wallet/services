import { NETWORK, VERSIONS } from '../../utils/versioning'
import ContractAliasesGhostnet from './v4.ghostnet.json'
import ContractAliasesMainnet from './v4.mainnet.json'
import environment from './environments.json'

interface props {
    version: VERSIONS
    network: NETWORK
}
export class Dataset {
    private storageMainnet = Object.values(ContractAliasesMainnet)
    private storageGhostnet = Object.values(ContractAliasesGhostnet)
    private version = VERSIONS.V1
    private network = NETWORK.MAINNET

    constructor({ version, network }: props) {
        this.version = version
        this.network = network
    }

    addFilter(filter: (value: any) => any) {
        this.storageMainnet = this.storageMainnet.filter(filter)
        this.storageGhostnet = this.storageGhostnet.filter(filter)
        return this
    }

    getSnapshot() {
        if (this.version === VERSIONS.V1) {
            return JSON.stringify(this.storageMainnet)
        }

        if (this.version === VERSIONS.V2) {
            return JSON.stringify({
                environment: {
                    mainnet: {
                        ...environment.mainnet,
                        contractAliases: this.storageMainnet
                    },
                    ghostnet: {
                        ...environment.ghostnet,
                        contractAliases: this.storageGhostnet
                    }
                }
            })
        }

        // else VERSIONS.V3+
        return this.network === NETWORK.MAINNET
            ? JSON.stringify({ ...environment.mainnet, contractAliases: this.storageMainnet })
            : JSON.stringify({ ...environment.ghostnet, contractAliases: this.storageGhostnet })
    }
}