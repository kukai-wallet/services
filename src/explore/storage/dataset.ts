import { VERSIONS } from '../../utils/versioning'
import ContractAliases from './contracts.json'
import environment from './environments.json'

interface props {
    version: VERSIONS
}
export class Dataset {
    private storage = Object.values(ContractAliases)
    private version = VERSIONS.V1

    constructor({ version }: props) {
        this.version = version
    }

    addFilter(filter: (value: any) => any) {
        this.storage = this.storage.filter(filter)
        return this
    }

    getSnapshot() {
        return this.version === VERSIONS.V2
            ? JSON.stringify({ environment, contractAliases: this.storage })
            : JSON.stringify(this.storage)
    }
}