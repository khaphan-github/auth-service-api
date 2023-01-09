import { CacheContainer } from "node-ts-cache";
import { MemoryStorage } from "node-ts-cache-storage-memory";

const ResponseCache = new CacheContainer(new MemoryStorage());

export class MemCache {
    static getItemFromCacheBy = async (name: CACHENAME) => {
        return await ResponseCache.getItem<any>(name.toString());
    }
    
    static invalidCacheBy = async () => {
        await ResponseCache.clear();
    }
    static setItemFromCacheBy = async (name: CACHENAME, value: any, invalidTime: number) => {
       await ResponseCache.setItem(name.toString(), value, { ttl: invalidTime });
    }
}

export enum CACHENAME {
    PRIVATEKEY,
    PUBLICKEY,
}