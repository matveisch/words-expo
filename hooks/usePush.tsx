import { useEffect } from 'react';
import { Platform } from 'react-native';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import { observer } from 'mobx-react';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

async function scheduleDailyNotification() {
  await Notifications.scheduleNotificationAsync({
    content: {
      sound: 'default',
      title: 'Learn new words',
      body: "Don't forget to study today!",
      data: { someData: 'goes here' },
    },
    trigger: {
      hour: 9,
      minute: 0,
      repeats: true,
    },
  });
}

async function checkAndScheduleNotification() {
  try {
    const existingNotifications = await Notifications.getAllScheduledNotificationsAsync();
    const hasScheduledNotification = existingNotifications.some(
      (notification) =>
        notification.content.title === 'Learn new words' &&
        notification.content.body === "Don't forget to study today!"
    );

    if (!hasScheduledNotification) {
      await scheduleDailyNotification();
    }
  } catch (e) {
    console.error(e);
  }
}

function handleRegistrationError(errorMessage: string) {
  alert(errorMessage);
  throw new Error(errorMessage);
}

async function registerForPushNotificationsAsync() {
  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  if (!Device.isDevice) {
    handleRegistrationError('Must use physical device for push notifications');
    return;
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  if (finalStatus !== 'granted') {
    handleRegistrationError('Permission not granted to get push token for push notification!');
    return;
  }

  const projectId = Constants?.expoConfig?.extra?.eas?.projectId ?? Constants?.easConfig?.projectId;
  if (!projectId) {
    handleRegistrationError('Project ID not found');
    return;
  }

  try {
    const pushTokenData = await Notifications.getExpoPushTokenAsync({
      projectId,
    });
    return pushTokenData.data;
  } catch (e: unknown) {
    handleRegistrationError(`${e}`);
  }
}

const UsePush = observer(() => {
  useEffect(() => {
    registerForPushNotificationsAsync()
      .then((token) => {
        if (token) {
          checkAndScheduleNotification();
        }
      })
      .catch((error: any) => console.error(error));
  }, []);

  return null;
});

export default UsePush;
