export const TriggerType = {
  TIMESTAMP: 0,
  INTERVAL: 1,
};

export const RepeatFrequency = {
  NONE: -1,
  HOURLY: 0,
  DAILY: 1,
  WEEKLY: 2,
};

export const AndroidImportance = {
  DEFAULT: 3,
  HIGH: 4,
  LOW: 2,
  MIN: 1,
  NONE: 0,
};

export const EventType = {
  DISMISSED: 0,
  PRESS: 1,
  ACTION_PRESS: 2,
  DELIVERED: 3,
  TRIGGER_NOTIFICATION_CREATED: 7,
};

export const notifee = {
  displayNotification: async (_notification: any) => 'web-notification-id',
  createTriggerNotification: async (_notification: any, _trigger: any) => 'web-trigger-id',
  createChannel: async (_channel: any) => 'web-channel-id',
  requestPermission: async () => ({ authorizationStatus: 1 }),
  getTriggerNotificationIds: async () => [],
  cancelTriggerNotifications: async () => {},
  cancelNotification: async (_id: string) => {},
  cancelAllNotifications: async () => {},
  onForegroundEvent: (_observer: Function) => () => {},
  onBackgroundEvent: (_observer: Function) => {},
};

export default notifee;
