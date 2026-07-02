import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommunityService } from '../../../service/community.service';
import { CommunityPost } from '../../../model/community.models';

@Component({
  selector: 'app-community-feed',
  templateUrl: './community-feed.component.html',
  styleUrls: ['./community-feed.component.css'],
})
export class CommunityFeedComponent implements OnInit {
  posts: CommunityPost[] = [];
  limit = 10;

  constructor(private community: CommunityService, private router: Router) {}

  ngOnInit(): void {
    this.loadTrending();
  }

  loadTrending(): void {
    this.community.getTrendingPosts(this.limit).subscribe({
      next: (res) => (this.posts = res.posts || []),
      error: (err) => console.error(err),
    });
  }

  navigateToPost(id?: string): void {
    if (!id) return;
    this.router.navigate(['/community/post', id]);
  }

  goCreate(): void {
    this.router.navigate(['/community/create']);
  }
}

