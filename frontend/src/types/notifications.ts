export type NotificationType = 'emergency' | 'warning' | 'information' | 'system';
export type NotificationSource = 'official' | 'community' | 'system' | 'derived';

export type FloodGuardNotification = {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  location_label?: string | null;
  source: NotificationSource;
  is_read: boolean;
  requires_action: boolean;
  created_at: string;
  updated_at?: string | null;
  expires_at?: string | null;
  is_demo: boolean;
};

export type NotificationListResponse = {
  items: FloodGuardNotification[];
  next_cursor?: string | null;
  total: number;
  is_demo: boolean;
};
