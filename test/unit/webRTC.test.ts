import { WebRTCService } from "../../src/api/v1/services/webRTCService"

describe('Web RTC Service test', () => {

    test('GenerateRoomIDTest_WhenCallFunctionGenerateRoomID_DoesReturnRoomIDLength12', () => {
        // example: abc-defg-hij
        const roomID = WebRTCService.generateRoomId();
        expect(roomID).toHaveLength(12);
        expect(roomID.charAt(3)).toEqual('-');
        expect(roomID.charAt(8)).toEqual('-');
    });
})