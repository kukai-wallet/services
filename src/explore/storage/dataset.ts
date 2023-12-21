import { VERSIONS } from '../../utils/versioning'
import ContractAliasesGhostnet from './contracts-ghostnet.json'
import ContractAliases from './contracts.json'
import environment from './environments.json'

interface props {
    version: VERSIONS
}
export class Dataset {
    private storageMainnet = Object.values(ContractAliases)
    private storageGhostnet = Object.values(ContractAliasesGhostnet)
    private version = VERSIONS.V1

    constructor({ version }: props) {
        this.version = version
    }

    addFilter(filter: (value: any) => any) {
        this.storageMainnet = this.storageMainnet.filter(filter)
        this.storageGhostnet = this.storageGhostnet.filter(filter)
        return this
    }

    getSnapshot() {
        return this.version === VERSIONS.V2
            ? JSON.stringify({
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
            : JSON.stringify(this.storageMainnet)
    }
}