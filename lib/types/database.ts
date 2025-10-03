export type Profile = {
  id: string;
  email: string;
  full_name: string | null;
  phone_number: string | null;
  national_id: string | null;
  date_of_birth: string | null;
  address: string | null;
  profile_picture_url: string | null;
  is_verified: boolean;
  is_banned: boolean;
  created_at: string;
  updated_at: string;
};

export type SavingsGroup = {
  id: string;
  name: string;
  description: string | null;
  group_type: "rotating" | "fixed" | "flexible";
  contribution_amount: number;
  contribution_frequency: "daily" | "weekly" | "monthly";
  max_members: number;
  current_members: number;
  start_date: string;
  end_date: string | null;
  active: string;
  status: string;
  created_by: string;
  created_at: string;
  updated_at: string;
};

export type Contribution = {
  id: string;
  group_id: string;
  member_id: string;
  amount: number;
  contribution_date: string;
  payment_method: "mobile_money" | "bank_transfer" | "cash";
  transaction_reference: string | null;
  status: "pending" | "verified" | "rejected";
  proof_document_url: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

export type GroupMember = {
  id: string;
  group_id: string;
  user_id: string;
  role: "admin" | "member";
  joined_at: string;
  is_active: boolean;
};

export type GroupChatMessage = {
  id: string;
  group_id: string;
  sender_id: string;
  message: string;
  created_at: string;
};

export type ContributionReport = {
  id: string;
  group_id: string;
  report_period_start: string;
  report_period_end: string;
  report_file_url: string;
  uploaded_by: string;
  created_at: string;
};
