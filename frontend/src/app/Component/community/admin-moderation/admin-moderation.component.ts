import { Component, OnInit } from '@angular/core';
import { CommunityService } from '../../../service/community.service';

@Component({
  selector: 'app-admin-moderation',
  templateUrl: './admin-moderation.component.html',
  styleUrls: ['./admin-moderation.component.css'],
})
export class AdminModerationComponent implements OnInit {
  reports: any[] = [];

  constructor(private community: CommunityService) {}

  ngOnInit(): void {
    this.loadReports();
  }

  loadReports(): void {
    this.community.adminGetReports().subscribe({
      next: (res) => (this.reports = res.reports || []),
      error: (err) => console.error(err),
    });
  }

  resolve(reportId: string): void {
    this.community.adminUpdateReportStatus(reportId, 'resolved').subscribe({
      next: () => this.loadReports(),
      error: (err) => console.error(err),
    });
  }

  dismiss(reportId: string): void {
    this.community.adminUpdateReportStatus(reportId, 'dismissed').subscribe({
      next: () => this.loadReports(),
      error: (err) => console.error(err),
    });
  }

  deletePost(postId: string): void {
    if (!confirm('Delete this reported post?')) return;
    this.community.adminDeletePost(postId).subscribe({
      next: () => this.loadReports(),
      error: (err) => console.error(err),
    });
  }
}

