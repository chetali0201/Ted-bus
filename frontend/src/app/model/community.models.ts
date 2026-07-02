export type CommunityPostType = 'story' | 'tip' | 'photo';


export interface CommunityPost {

  _id?: string;
  userId: string;
  type: 'story' | 'tip' | 'photo';
  title?: string;
  content: string;
  routeId?: string;
  destination?: string;
  photoUrl?: string;
  likesCount?: number;
  commentsCount?: number;
  engagementScore?: number;
  status?: 'active' | 'deleted';
  createdAt?: string;
}

export interface CommunityComment {
  _id?: string;
  postId: string;
  userId: string;
  text: string;
  status?: 'active' | 'deleted';
  createdAt?: string;
}

export interface CommunityThread {
  _id?: string;
  userId: string;
  category: 'Routes' | 'Destinations' | 'TravelAdvice';
  title: string;
  content: string;
  status?: string;
  createdAt?: string;
}

export interface CommunityReply {
  _id?: string;
  threadId: string;
  userId: string;
  text: string;
  createdAt?: string;
}

export interface CommunityUserStats {
  totalPosts: number;
  likesReceived: number;
  totalComments: number;
}

export interface CommunityUserActivities {
  recentPosts: CommunityPost[];
  recentComments: CommunityComment[];
  recentThreads: CommunityThread[];
}

export interface CommunityUserActivity {
  type: string;
  data: any;
}

