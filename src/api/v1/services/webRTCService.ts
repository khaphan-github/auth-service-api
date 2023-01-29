export class WebRTCService {
    // example: abc-defg-hij
    public static generateRoomId = (): string => {
        let roomIDResult = '';

        const characters = 'abcdefghijklmnopqrstuvwxyz';
        const charactersLength = characters.length;
        const ROOM_ID_LENGTH = 10;

        const PARTITION_INDEX_FIRST = 3;
        const PARTITION_INDEX_SECOND = 7;
        const PARTITION_CHARACTER = '-';

        let counter = 0;
        while (counter++ < ROOM_ID_LENGTH) {
            const randomIndex = Math.floor(Math.random() * charactersLength);

            roomIDResult += characters.charAt(randomIndex);

            const isCounterAtPartitionIndex =
                counter === PARTITION_INDEX_FIRST || counter === PARTITION_INDEX_SECOND;

            if (isCounterAtPartitionIndex) {
                roomIDResult += PARTITION_CHARACTER;
            }
        }

        return roomIDResult;
    }

    public static createMettingRoom = () => {
        
    }
}