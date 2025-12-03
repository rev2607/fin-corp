import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { Client } from '../types';
import { format, startOfDay } from 'date-fns';

// Configure how notifications are handled when app is in foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export const notificationService = {
  async requestPermissions(): Promise<boolean> {
    try {
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
      
      let finalStatus = existingStatus;
      
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      
      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('followups', {
          name: 'Follow-up Reminders',
          importance: Notifications.AndroidImportance.HIGH,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#D4AF37',
        });
      }
      
      return finalStatus === 'granted';
    } catch (error) {
      console.error('Error requesting notification permissions:', error);
      return false;
    }
  },

  async scheduleFollowUpNotification(client: Client): Promise<string | null> {
    try {
      if (!client.followUpDate) {
        return null;
      }

      // Cancel existing notification if any
      await this.cancelFollowUpNotification(client.id);

      const followUpDate = new Date(client.followUpDate);
      const notificationDate = new Date(followUpDate);
      
      // Set notification time to 9:00 AM on the follow-up date
      notificationDate.setHours(9, 0, 0, 0);

      // If the date is in the past, don't schedule
      if (notificationDate < new Date()) {
        return null;
      }

      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Follow-up Reminder',
          body: `Follow up with ${client.nameOfCustomer} today`,
          data: { clientId: client.id },
          sound: true,
        },
        trigger: {
          type: 'date',
          date: notificationDate,
        },
      });

      return notificationId;
    } catch (error) {
      console.error('Error scheduling notification:', error);
      return null;
    }
  },

  async cancelFollowUpNotification(clientId: string): Promise<void> {
    try {
      const allNotifications =
        await Notifications.getAllScheduledNotificationsAsync();
      
      const clientNotification = allNotifications.find(
        (notification) =>
          notification.content.data?.clientId === clientId
      );
      
      if (clientNotification) {
        await Notifications.cancelScheduledNotificationAsync(
          clientNotification.identifier
        );
      }
    } catch (error) {
      console.error('Error canceling notification:', error);
    }
  },

  async getAllScheduledNotifications(): Promise<
    Notifications.NotificationRequest[]
  > {
    try {
      return await Notifications.getAllScheduledNotificationsAsync();
    } catch (error) {
      console.error('Error getting scheduled notifications:', error);
      return [];
    }
  },

  async getClientNotificationInfo(
    clientId: string
  ): Promise<{ identifier: string; triggerDate: Date } | null> {
    try {
      const notifications = await this.getAllScheduledNotifications();
      const notification = notifications.find(
        (n) => n.content.data?.clientId === clientId
      );
      
      if (notification && notification.trigger.type === 'date') {
        return {
          identifier: notification.identifier,
          triggerDate: new Date(notification.trigger.value as number),
        };
      }
      
      return null;
    } catch (error) {
      console.error('Error getting notification info:', error);
      return null;
    }
  },
};

