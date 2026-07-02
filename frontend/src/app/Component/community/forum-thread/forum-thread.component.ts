import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommunityService } from '../../../service/community.service';
import { CommunityReply, CommunityThread } from '../../../model/community.models';

@Component({
  selector: 'app-forum-thread',
  templateUrl: './forum-thread.component.html',
  styleUrls: ['./forum-thread.component.css'],
})
export class ForumThreadComponent implements OnInit {
  thread: CommunityThread | null = null;
  replies: CommunityReply[] = [];
  replyText = '';

  constructor(private route: ActivatedRoute, private community: CommunityService) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('threadId') || '';
    this.community.getThreadById(id).subscribe({
      next: (res) => {
        this.thread = res.thread;
        this.replies = res.replies || [];
      },
      error: (err) => console.error(err),
    });
  }

  postReply(): void {
    if (!this.thread?._id) return;
    if (!this.replyText.trim()) return;
    this.community.addReply(this.thread._id, this.replyText).subscribe({
      next: () => {
        this.replyText = '';
        this.ngOnInit();
      },
      error: (err) => console.error(err),
    });
  }
}

