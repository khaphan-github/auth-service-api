import { CacheContainer } from "node-ts-cache";
import { MemoryStorage } from "node-ts-cache-storage-memory";

const ResponseCache = new CacheContainer(new MemoryStorage());

export class memCache {
    static getItemFromResponseCacheBy = async (name: string) => {
        return await ResponseCache.getItem<any>(name);
    }
    
    static invalidResponseCacheBy = async () => {
        await ResponseCache.clear();
    }
    static setItemFromResponseCacheBy = async (name: string, value: any, invalidTime: number) => {
       await ResponseCache.setItem(name, value, { ttl: invalidTime });
    }
}