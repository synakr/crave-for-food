export type FollowRequestStatus = "PENDING" | "ACCEPTED" | "REJECTED";

export interface FollowRequest {
  id: string;

  requester_id: string;
  target_user_id: string;

  status: FollowRequestStatus;

  created_at: string;
  updated_at: string;
}
