import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommunityService } from '../../../service/community.service';
import { CommunityPost, CommunityComment } from '../../../model/community.models';

@Component({
  selector: 'app-post-details',
  templateUrl: './post-details.component.html',
  styleUrls: ['./post-details.component.css'],
})
export class PostDetailsComponent implements OnInit {
  post: CommunityPost | null = null;
  comments: CommunityComment[] = [];
  commentText = '';

  editing = false;
  editText = '';
  editCommentId: string | null = null;

  userId: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private community: CommunityService
  ) {}

  getShareUrl(id?: string): string {
    const origin = (location as any)?.origin || '';
    return origin + '/#/community/post/' + (id || '');
  }

  ngOnInit(): void {
    const logged = sessionStorage.getItem('Loggedinuser');
    this.userId = logged ? JSON.parse(logged)?._id || JSON.parse(logged)?.id : null;

    const id = this.route.snapshot.paramMap.get('id') || '';
    this.community.getPostById(id).subscribe({
      next: (res: any) => {
        this.post = res.post;
        this.comments = res.comments || [];
      },
      error: (err: any) => console.error(err),
    });
  }

  like(): void {
    if (!this.post?._id) return;
    this.community.likePost(this.post._id).subscribe({
      next: () => this.refresh(),
      error: (err: any) => console.error(err),
    });
  }

  unlike(): void {
    if (!this.post?._id) return;
    this.community.unlikePost(this.post._id).subscribe({
      next: () => this.refresh(),
      error: (err: any) => console.error(err),
    });
  }

  addComment(): void {
    if (!this.post?._id || !this.commentText.trim()) return;
    this.community.addComment(this.post._id, this.commentText).subscribe({
      next: () => {
        this.commentText = '';
        this.refresh();
      },
      error: (err: any) => console.error(err),
    });
  }

  startEditComment(c: CommunityComment): void {
    if (!c._id) return;
    this.editing = true;
    this.editCommentId = c._id;
    this.editText = c.text;
  }

  cancelEdit(): void {
    this.editing = false;
    this.editCommentId = null;
    this.editText = '';
  }

  saveEditComment(): void {
    if (!this.editCommentId || !this.editText.trim()) return;
    this.community.updateComment(this.editCommentId, this.editText).subscribe({
      next: () => this.refresh(),
      error: (err: any) => console.error(err),
    });
    this.cancelEdit();
  }

  deleteComment(c: CommunityComment): void {
    if (!c._id) return;
    this.community.deleteComment(c._id).subscribe({
      next: () => this.refresh(),
      error: (err: any) => console.error(err),
    });
  }

  isOwner(itemUserId?: string): boolean {
    return !!this.userId && !!itemUserId && itemUserId.toString() === this.userId.toString();
  }

  updatePostPrompt(): void {
    if (!this.post?._id) return;
    const newTitle = prompt('Edit title', this.post.title);
    if (newTitle === null) return;
    const newContent = prompt('Edit content', this.post.content);
    if (newContent === null) return;

    this.community
      .updatePost(this.post._id, { title: newTitle, content: newContent })
      .subscribe({
        next: () => this.refresh(),
        error: (err: any) => console.error(err),
      });
  }

  deletePost(): void {
    if (!this.post?._id) return;
    if (!confirm('Delete this post?')) return;
    this.community.deletePost(this.post._id).subscribe({
      next: () => this.router.navigate(['/community']),
      error: (err: any) => console.error(err),
    });
  }

  report(): void {
    if (!this.post?._id) return;
    const reason = prompt('Reason for report', 'Inappropriate content');
    if (!reason) return;
    this.community.reportPost(this.post._id, reason).subscribe({
      next: () => alert('Reported to moderators.'),
      error: (err: any) => console.error(err),
    });
  }

  private refresh(): void {
    const id = this.route.snapshot.paramMap.get('id') || '';
    this.community.getPostById(id).subscribe({
      next: (res: any) => {
        this.post = res.post;
        this.comments = res.comments || [];
      },
      error: (err: any) => console.error(err),
    });
  }
}

