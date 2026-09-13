import { Comment } from "../models/Comment";
import { Follow } from "../models/Follow";
import { FollowRequest } from "../models/FollowRequest";
import { Like } from "../models/Like";
import { MapPromotion } from "../models/MapPromotion";
import { Mention } from "../models/Mention";
import { Place } from "../models/Place";
import { Post } from "../models/Post";
import { PostContent } from "../models/PostContent";
import { User } from "../models/User";
import { UserLocation } from "../models/UserLocation";

export interface MockDatabase {
  users: User[];
  places: Place[];
  posts: Post[];
  post_contents: PostContent[];
  likes: Like[];
  comments: Comment[];
  follows: Follow[];
  follow_requests: FollowRequest[];
  mentions: Mention[];
  map_promotions: MapPromotion[];
  user_locations: UserLocation[];
}

export const db: MockDatabase = {
  users: [],
  places: [],
  posts: [],
  post_contents: [],
  likes: [],
  comments: [],
  follows: [],
  follow_requests: [],
  mentions: [],
  map_promotions: [],
  user_locations: [],
};
