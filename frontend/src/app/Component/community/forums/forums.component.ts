import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommunityService } from '../../../service/community.service';
import { CommunityThread } from '../../../model/community.models';

@Component({
  selector: 'app-community-forums',
  templateUrl: './forums.component.html',
  styleUrls: ['./forums.component.css'],
})
export class ForumsComponent implements OnInit {
  category: 'Routes' | 'Destinations' | 'TravelAdvice' = 'Routes';
  threads: CommunityThread[] = [];
  selectedCategory: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private community: CommunityService
  ) {}

  ngOnInit(): void {
    const cat = (this.route.snapshot.paramMap.get('category') || '') as any;
    if (cat) this.category = cat;
    this.loadThreads();
  }

  loadThreads(): void {
    this.community.getThreads(this.category).subscribe({
      next: (res) => (this.threads = res.threads || []),
      error: (err) => console.error(err),
    });
  }

  navigateToThread(threadId?: string): void {
    if (!threadId) return;
    this.router.navigate(['/community/forums/thread', threadId]);
  }

  setCategory(c: 'Routes' | 'Destinations' | 'TravelAdvice') {
    this.category = c;
    this.router.navigate(['/community/forums', c]);
  }
}

