export type SubscriptionDto = {
  id: string;
  clientUserId: string;
  status: "active" | "inactive" | "trial";
  startsAt: string | null;
  endsAt: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
};

export type ProfileDto = {
  id: string;
  email: string;
  displayName: string | null;
  phone: string | null;
  role: "admin" | "coach" | "client";
  createdAt: string;
  updatedAt: string;
};

export type AdminClientRow = ProfileDto & {
  subscription: SubscriptionDto | null;
  presentDays: number;
};

export type AttendanceDto = {
  id: string;
  clientUserId: string;
  day: string;
  createdAt: string;
};

export type ClientDetailResponse = {
  client: ProfileDto;
  subscriptions: SubscriptionDto[];
  attendance: AttendanceDto[];
  coaches: ProfileDto[];
};
