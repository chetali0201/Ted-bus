import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandingPageComponent } from './Component/landing-page/landing-page.component';
import { SelectbusPageComponent } from './Component/selectbus-page/selectbus-page.component';
import { PaymentPageComponent } from './Component/payment-page/payment-page.component';
import { ProfilePageComponent } from './Component/profile-page/profile-page.component';
import { CommunityFeedComponent } from './Component/community/community-feed/community-feed.component';
import { CreatePostComponent } from './Component/community/create-post/create-post.component';
import { PostDetailsComponent } from './Component/community/post-details/post-details.component';
import { ForumsComponent } from './Component/community/forums/forums.component';
import { ForumThreadComponent } from './Component/community/forum-thread/forum-thread.component';
import { AdminModerationComponent } from './Component/community/admin-moderation/admin-moderation.component';

const routes: Routes = [
  {path: '',component:LandingPageComponent},
  {path: 'select-bus',component:SelectbusPageComponent},
  {path:'payment',component:PaymentPageComponent},
  {path:'profile',component:ProfilePageComponent},
  {path:'community',component:CommunityFeedComponent},
  {path:'community/create',component:CreatePostComponent},
  {path:'community/post/:id',component:PostDetailsComponent},
  {path:'community/forums',component:ForumsComponent},
  {path:'community/forums/:category',component:ForumsComponent},
  {path:'community/forums/thread/:threadId',component:ForumThreadComponent},
  {path:'community/admin',component:AdminModerationComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
