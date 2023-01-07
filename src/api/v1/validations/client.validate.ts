import { ClientKey } from "../payload/request/ClientKey";

export const isRightClient = (_client: ClientKey): boolean => {
    const defaultClientID ='9f8faca3-ff0e-4f38-ba0a-a898ad98c31e';
    const defaultClientSecret = 'e198c72fda9984d4c28f846550fdd91e';
    return (_client.clientID === defaultClientID &&  _client.clientSecret === defaultClientSecret);
}