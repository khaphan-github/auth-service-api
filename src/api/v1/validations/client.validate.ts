import { client } from "../payload/request/client";

export const isRightClient = (_client: client): boolean => {
    const defaultClientID ='9f8faca3-ff0e-4f38-ba0a-a898ad98c31e';
    const defaultClientSecret = 'e198c72fda9984d4c28f846550fdd91e';
    return (_client.clientID === defaultClientID &&  _client.clientSecret === defaultClientSecret);
}