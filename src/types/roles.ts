export type Role = {
  id: string;
  role: string;
  name: string | null;
  limitCents: number | null;
};

export interface CreateParticipantRole {
  role: string;
  name: string;
  limitCents?: number;
}
