export const sendNotifications = async (pushToken: string, title: string, body: string) => {
    try {
        await fetch('https://exp.host/--/api/v2/push/send', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                to: pushToken,
                title,
                body,
            }),
        })
    } catch (error) {
        console.log("[src][utilities][notificationHandler][sendNotifications]", error)
    }
}