import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-social-sharing',
  templateUrl: './social-sharing.component.html',
  styleUrls: ['./social-sharing.component.css'],
})
export class SocialSharingComponent {
  @Input() shareUrl: string = '';

  shareFacebook(): void {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(this.shareUrl)}`, '_blank');
  }

  shareTwitter(): void {
    window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(this.shareUrl)}`, '_blank');
  }

  shareWhatsApp(): void {
    window.open(`https://wa.me/?text=${encodeURIComponent(this.shareUrl)}`, '_blank');
  }
}

