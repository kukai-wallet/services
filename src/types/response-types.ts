export interface AlchemyError {
    code: number;
    message: string;
};

export interface AlchemyConfig {
    apiKey: string;
    network: string;
}