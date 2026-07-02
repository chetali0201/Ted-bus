import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { url } from '../config';
import {
  CommunityPost,
  CommunityComment,
  CommunityThread,
  CommunityReply,
  CommunityUserActivities,
  CommunityUserStats,
} from '../model/community.models';

@Injectable({
  providedIn: 'root',
})
export class CommunityService {
  private api = url + 'community/';

  constructor(private http: HttpClient) {}

  private getSessionUserId(): string | null {
    const raw = sessionStorage.getItem('Loggedinuser');
    if (!raw) return null;
    try {
      const user = JSON.parse(raw);
      return user?._id || user?.id || null;
    } catch {
      return null;
    }
  }

  createPost(payload: Partial<CommunityPost> & { type: any }): Observable<CommunityPost> {
    const userId = this.getSessionUserId();
    return this.http.post<CommunityPost>(this.api + 'posts', { ...payload, userId });
  }

  getTrendingPosts(limit = 10): Observable<{ posts: CommunityPost[] }> {
    return this.http.get<{ posts: CommunityPost[] }>(this.api + 'posts/trending', {
      params: { limit: String(limit) },
    });
  }

  getPostById(postId: string): Observable<{ post: CommunityPost; comments: CommunityComment[] }> {
    return this.http.get<{ post: CommunityPost; comments: CommunityComment[] }>(this.api + 'posts/' + postId);
  }

  updatePost(postId: string, payload: Partial<CommunityPost>): Observable<CommunityPost> {
    const userId = this.getSessionUserId();
    return this.http.put<CommunityPost>(this.api + 'posts/' + postId, { ...payload, userId });
  }

  deletePost(postId: string): Observable<{ message: string }> {
    const userId = this.getSessionUserId();
    return this.http.delete<{ message: string }>(this.api + 'posts/' + postId, { body: { userId } as any });
  }

  likePost(postId: string): Observable<any> {
    const userId = this.getSessionUserId();
    return this.http.post<any>(this.api + 'posts/' + postId + '/like', { userId });
  }

  unlikePost(postId: string): Observable<any> {
    const userId = this.getSessionUserId();
    return this.http.request<any>('delete', this.api + 'posts/' + postId + '/like', {
      body: { userId } as any,
    });
  }

  addComment(postId: string, text: string): Observable<CommunityComment> {
    const userId = this.getSessionUserId();
    return this.http.post<CommunityComment>(this.api + 'posts/' + postId + '/comments', { text, userId });
  }

  updateComment(commentId: string, text: string): Observable<CommunityComment> {
    const userId = this.getSessionUserId();
    return this.http.put<CommunityComment>(this.api + 'comments/' + commentId, { text, userId });
  }

  deleteComment(commentId: string): Observable<{ message: string }> {
    const userId = this.getSessionUserId();
    return this.http.delete<{ message: string }>(this.api + 'comments/' + commentId, {
      body: { userId } as any,
    });
  }

  reportPost(postId: string, reason: string): Observable<any> {
    const userId = this.getSessionUserId();
    return this.http.post<any>(this.api + 'posts/' + postId + '/reports', { reason, userId });
  }

  // Forums
  createThread(payload: { category: any; title: string; content: string }): Observable<CommunityThread> {
    const userId = this.getSessionUserId();
    return this.http.post<CommunityThread>(this.api + 'forums/threads', { ...payload, userId });
  }

  getThreads(category: 'Routes' | 'Destinations' | 'TravelAdvice'): Observable<{ threads: CommunityThread[] }> {
    return this.http.get<{ threads: CommunityThread[] }>(this.api + 'forums/threads', {
      params: { category },
    });
  }

  getThreadById(threadId: string): Observable<{ thread: CommunityThread; replies: CommunityReply[] }> {
    return this.http.get<{ thread: CommunityThread; replies: CommunityReply[] }>(this.api + 'forums/threads/' + threadId);
  }

  addReply(threadId: string, text: string): Observable<CommunityReply> {
    const userId = this.getSessionUserId();
    return this.http.post<CommunityReply>(this.api + 'forums/threads/' + threadId + '/replies', { text, userId });
  }

  adminGetReports(): Observable<any> {
    const userId = this.getSessionUserId();
    return this.http.get<any>(this.api + 'admin/reports', { params: { userId: userId || '' } });
  }

  adminDeletePost(postId: string): Observable<any> {
    const userId = this.getSessionUserId();
    return this.http.request<any>('delete', this.api + 'admin/posts/' + postId, {
      body: { userId } as any,
    });
  }

  adminUpdateReportStatus(reportId: string, status: string): Observable<any> {
    const userId = this.getSessionUserId();
    return this.http.put<any>(this.api + 'admin/reports/' + reportId + '/status', { status, userId });
  }

  adminUpdateThreadStatus(threadId: string, status: string): Observable<any> {
    const userId = this.getSessionUserId();
    return this.http.put<any>(this.api + 'admin/threads/' + threadId + '/status', { status, userId });
  }

  getUserStats(userId: string): Observable<CommunityUserStats> {
    return this.http.get<CommunityUserStats>(this.api + 'users/' + userId + '/stats');
  }

  getUserActivities(userId: string): Observable<CommunityUserActivities> {
    return this.http.get<CommunityUserActivities>(this.api + 'users/' + userId + '/activities');
  }
}

