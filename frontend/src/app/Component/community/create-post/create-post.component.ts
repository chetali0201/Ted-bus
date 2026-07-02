import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommunityService } from '../../../service/community.service';
import { CommunityPostType } from '../../../model/community.models';






@Component({
  selector: 'app-create-post',
  templateUrl: './create-post.component.html',
  styleUrls: ['./create-post.component.css'],
})
export class CreatePostComponent {
  postType: CommunityPostType = 'story';

  goToCommunity(): void {
    this.router.navigate(['/community']);
  }
  title = '';
  content = '';
  destination = '';
  photoUrl = '';
  isSubmitting = false;

  constructor(private community: CommunityService, public router: Router) {}

  submit(): void {
    this.isSubmitting = true;
    this.community
      .createPost({
        type: this.postType,
        title: this.title,
        content: this.content,
        destination: this.destination,
        photoUrl: this.photoUrl,
      })
      .subscribe({
        next: (res: any) => {
          this.isSubmitting = false;
          this.router.navigate(['/community/post', res?._id]);
        },
        error: (err: any) => {
          console.error(err);
          this.isSubmitting = false;
        },
      });
  }
}

