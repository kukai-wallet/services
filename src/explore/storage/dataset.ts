import ContractAliases from './contracts.json'

export class Dataset {
    private storage = Object.values(ContractAliases)

    constructor() {
        // no-op
    }

    addFilter(filter: (value: any) => any) {
        this.storage = this.storage.filter(filter)
        return this
    }

    getSnapshot() {
        return JSON.stringify(this.storage)
    }

}