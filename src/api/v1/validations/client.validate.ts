import { ClientKey } from "../payload/request/clientkey.req";

export class Validation {
    static isPasswordRole = (password: string): boolean => {
        const strongRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/;
        return strongRegex.test(password);
    };
    static isRightClient = (_client: ClientKey): boolean => {
        const defaultClientID ='9f8faca3-ff0e-4f38-ba0a-a898ad98c31e';
        const defaultClientSecret = 'e198c72fda9984d4c28f846550fdd91e';
        return (_client.clientId === defaultClientID &&  _client.clientSecret === defaultClientSecret);
    };
    
}