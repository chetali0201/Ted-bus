# Community & User-Generated Content Module - Implementation Checklist

## Phase 1: Repo understanding + integration points
- [x] Inspect existing backend entry + routing (`frontend/server/index.js`).
- [x] Inspect existing Angular routing (`frontend/src/app/app-routing.module.ts`).
- [x] Inspect existing session login mechanism (`sessionStorage: Loggedinuser`) via navbar.
- [ ] Inspect profile page integration points (`profile-page.component.*`).

## Phase 2: Backend (Node/Express/Mongoose)
- [x] Update Customer model to add `isAdmin` field.
- [ ] Add new community models:
  - [ ] CommunityPost
  - [ ] CommunityComment
  - [ ] CommunityLike
  - [ ] CommunityReport
  - [ ] CommunityDiscussionThread
  - [ ] CommunityDiscussionReply
- [ ] Add community router + controllers + auth helpers:
  - [ ] community routes/controller
  - [ ] auth/authorization helper to validate Loggedinuser against Customers collection
  - [ ] admin-only checks
- [ ] Mount community router in `frontend/server/index.js`.

## Phase 3: Frontend (Angular)
- [ ] Add models + service (`community.service.ts`).
- [ ] Add pages/components + routes:
  - [ ] Community feed
  - [ ] Post create form
  - [ ] Post detail (like/comment/edit/delete)
  - [ ] Forums (category, thread, replies)
  - [ ] Admin moderation UI
  - [ ] Add community stats + activities into profile page
- [ ] Update `app-routing.module.ts` and `app.module.ts` for new components.

## Phase 4: Trending/popular + sharing buttons
- [ ] Implement trending/popular in backend (engagement-based) and render on feed.
- [ ] Add social sharing buttons in post detail/feed.

## Phase 5: Testing
- [ ] Verify existing routes still work (booking/routes/customer).
- [ ] Manual test flows for:
  - [ ] Create post as logged-in user
  - [ ] Like/comment/edit/delete ownership
  - [ ] Report post
  - [ ] Forums create/reply
  - [ ] Admin moderation actions (with seeded admin)
- [ ] Provide run/test instructions and summary.
