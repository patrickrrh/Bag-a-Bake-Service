"use strict";
// export const sendNotifications = async (pushToken: string, title: string, body: string) => {
//     try {
//         await fetch('https://exp.host/--/api/v2/push/send', {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//             body: JSON.stringify({
//                 to: pushToken,
//                 title,
//                 body,
//             }),
//         })
//     } catch (error) {
//         console.log("[src][utilities][notificationHandler][sendNotifications]", error)
//     }
// }
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendNotifications = sendNotifications;
const google_auth_library_1 = require("google-auth-library");
function getAccessTokenAsync() {
    return __awaiter(this, void 0, void 0, function* () {
        const key = {
            client_email: process.env.FCM_CLIENT_EMAIL,
            private_key: process.env.FCM_PRIVATE_KEY,
            project_id: process.env.FCM_PROJECT_ID,
        };
        const jwtClient = new google_auth_library_1.JWT(key.client_email, undefined, key.private_key, ['https://www.googleapis.com/auth/cloud-platform'], undefined);
        const tokens = yield jwtClient.authorize();
        return tokens.access_token;
    });
}
function sendNotifications(deviceToken, title, body) {
    return __awaiter(this, void 0, void 0, function* () {
        const firebaseAccessToken = yield getAccessTokenAsync();
        const messageBody = {
            message: {
                token: deviceToken,
                data: {
                    channelId: 'default',
                    message: body,
                    title,
                    body
                },
            },
        };
        const response = yield fetch(`https://fcm.googleapis.com/v1/projects/${process.env.FCM_PROJECT_ID}/messages:send`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${firebaseAccessToken}`,
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(messageBody),
        });
        const json = yield response.json();
        console.log('FCM Response:', JSON.stringify(json, null, 2));
    });
}
