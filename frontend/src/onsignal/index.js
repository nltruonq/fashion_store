import OneSignal from "react-onesignal";

export default async function runOneSignal() {
    // 09db827f-5580-4392-8f41-4f6786bbe386 My
    // 2fb3d4d8-356c-4bb9-b8d3-1fca51aa9736 anh Chuong
    await OneSignal.init({
        appId: "6105283e-af19-4795-a9c9-16440b51798e",
        autoResubscribe: false,
        allowLocalhostAsSecureOrigin: true,
        notifyButton: {
            enable: true /* Required to use the Subscription Bell */,
            /* SUBSCRIPTION BELL CUSTOMIZATIONS START HERE */
            prenotify: true,
            size: "medium" /* One of 'small', 'medium', or 'large' */,
            theme: "default" /* One of 'default' (red-white) or 'inverse" (white-red) */,
            position:
                "bottom-right" /* Either 'bottom-left' or 'bottom-right' */,
            offset: {
                bottom: "10px",
                left: "10px" /* Only applied if bottom-left */,
                right: "10px" /* Only applied if bottom-right */,
            },
            showCredit: false /* Hide the OneSignal logo */,
            text: {
                "tip.state.unsubscribed": "Subscribe to notifications",
                "tip.state.subscribed": "You're subscribed to notifications",
                "tip.state.blocked": "You've blocked notifications",
                "message.prenotify": "Click to subscribe to notifications",
                "message.action.subscribed": "Thanks for subscribing!",
                "message.action.resubscribed":
                    "You're subscribed to notifications",
                "message.action.unsubscribed":
                    "You won't receive notifications again",
                "dialog.main.title": "Manage Site Notifications",
                "dialog.main.button.subscribe": "SUBSCRIBE",
                "dialog.main.button.unsubscribe": "UNSUBSCRIBE",
                "dialog.blocked.title": "Unblock Notifications",
                "dialog.blocked.message":
                    "Follow these instructions to allow notifications:",
            },
            colors: {
                // Customize the colors of the main button and dialog popup button
                "circle.background": "rgb(84,110,123)",
                "circle.foreground": "white",
                "badge.background": "rgb(84,110,123)",
                "badge.foreground": "white",
                "badge.bordercolor": "white",
                "pulse.color": "white",
                "dialog.button.background.hovering": "rgb(77, 101, 113)",
                "dialog.button.background.active": "rgb(70, 92, 103)",
                "dialog.button.background": "rgb(84,110,123)",
                "dialog.button.foreground": "white",
            },
        },
    });
    OneSignal.registerForPushNotifications();
    OneSignal.showSlidedownPrompt().then(() => {
        OneSignal.isPushNotificationsEnabled((isPushEnabled) => {
            if (isPushEnabled) {
                OneSignal.getUserId((userId) => {
                    localStorage.setItem("oneSignalId.bmd", userId);
                });
            }
        });
    });
}
