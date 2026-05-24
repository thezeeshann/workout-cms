export type DietPlanDto = {
  id: string;
  clientUserId: string;
  coachUserId: string;
  title: string;
  content: string;
  validFrom: string | null;
  validUntil: string | null;
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

export type CoachClientRow = ProfileDto & {
  subscription: SubscriptionDto | null;
};
