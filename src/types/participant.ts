export type Participant = {
  id: string;
  code: string;
  name: string;
  limitCents: number | null;
  role: string;
  limitMode: "INHERIT" | "CUSTOM" | "UNLIMITED";
  participantRoles: ParticipantRole;
};

type ParticipantRole = {
  id: string;
  role: string;
  limitCents: number;
};
