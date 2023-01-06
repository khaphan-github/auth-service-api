export interface ResponsePayload {
    id: string;
    timestemp: string;
    apiVersion: Version;
    status: ResponseStatus;
    message: string;
    data: any;
}

export enum ResponseStatus {
    SUCCESS = 'SUCCESS',
    FAILURE = 'FAILURE',
    ERROR = 'ERROR',
    TIMEOUT = 'TIMEOUT',
    WRONG_FORMAT = 'WRONG_FORMAT',
    NO_PERMISSIONS = 'NO_PERMISSIONS',
}

export enum Version {
    V1 = 'v0.0.1'
}