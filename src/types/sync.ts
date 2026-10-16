export type SyncEvent = {
  id: string;
  eventId: string;
  type: string;
  status: string;
  attempts: number;
  lastError?: string | null;
  createdAt: string;
};

export type SyncStatus = {
  configured: boolean;
  pending: number;
  failed: number;
  synced: number;
  events: SyncEvent[];
};

export type SyncRetry = {
  found: number;
  queued: number;
  message: string;
};
