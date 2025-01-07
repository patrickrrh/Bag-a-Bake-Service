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

import { JWT } from 'google-auth-library';

async function getAccessTokenAsync() {
    const key = {
        client_email: process.env.FCM_CLIENT_EMAIL,
        private_key: process.env.FCM_PRIVATE_KEY,
        project_id: process.env.FCM_PROJECT_ID,
    };

    const jwtClient = new JWT(
        key.client_email,
        undefined,
        key.private_key,
        ['https://www.googleapis.com/auth/cloud-platform'],
        undefined
    );

    const tokens = await jwtClient.authorize();
    return tokens.access_token;
}

async function sendNotifications(deviceToken: string, title: string, body: string) {
    const firebaseAccessToken = await getAccessTokenAsync();

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

    const response = await fetch(
        `https://fcm.googleapis.com/v1/projects/${process.env.FCM_PROJECT_ID}/messages:send`,
        {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${firebaseAccessToken}`,
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(messageBody),
        }
    );

    const json = await response.json();
    console.log('FCM Response:', JSON.stringify(json, null, 2));
}


export { sendNotifications };