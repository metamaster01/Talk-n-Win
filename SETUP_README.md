
# Course Backend Setup — Supabase + Razorpay + Cloudflare Stream (MVP)

This checklist assumes Supabase **Free** tier for development.

## 0) Secrets you will need (save in Vercel/Supabase Edge Functions)

- SUPABASE_URL
- SUPABASE_ANON_KEY
- SUPABASE_SERVICE_ROLE_KEY (server only)
- RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET
- CLOUDFLARE_API_TOKEN, CLOUDFLARE_ACCOUNT_ID (Stream)
- NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY

## 1) Apply DB schema
- Open Supabase → SQL Editor → upload & run `supabase_schema.sql` from this folder.
- This creates all tables, indexes, triggers and RLS policies.

## 2) Buckets
- Create Storage buckets:
  - `public-thumbnails` (public) — course thumbnails
  - `private-attachments` (private) — lesson notes/PDFs
- Add simple Storage policies (see end of SQL file for examples).

## 3) Auth & Profiles
- Supabase Auth enabled (email/password + optional Google).
- The trigger in SQL auto-creates `profiles` on new user.
- Set admin role by updating `profiles.role = 'admin'` manually for your admin account.

## 4) Cloudflare Stream
- Upload one **demo** and one **paid** video via Stream UI.
- Copy each video’s **video UID** and paste into `lessons.cloudflare_video_id`.
- Keep paid videos private; demo can be public.

## 5) Payments (Razorpay)
- Backend route: `POST /api/checkout` → creates Razorpay order `{amount, currency, receipt}`.
- Frontend redirects to Razorpay Checkout.
- Webhook: `POST /api/payment/webhook` (server only):
  - Verify signature.
  - Upsert into `purchases` with `status='paid'`.
  - Upsert into `enrollments (user_id, course_id)`.
  - Insert an `audit_logs` row (`event='payment_webhook'`).

## 6) Secure playback
- Backend route: `GET /api/video-token?lessonId=...`
  - Verify auth user.
  - If `lessons.is_preview` is true → allow.
  - Else check `enrollments` for (user_id, course_id).
  - Call Cloudflare Stream to create a short-lived signed URL (TTL 60–300s).
  - Return `{manifest_url, expires_at}`.
- Client plays HLS with hls.js/Cloudflare player.
- Overlay a small watermark with user email (CSS).

## 7) Progress
- Client POST `/api/progress` every ~30s with `{lesson_id, watched_seconds}`.
- Mark `is_completed` when `watched_seconds >= duration_seconds * 0.9` (client or server).

## 8) Admin workflow (MVP)
- Use Supabase dashboard to CRUD `courses/modules/lessons`.
- Thumbnails → upload to `public-thumbnails`; store full public URL in `courses.thumbnail_url`.
- Attachments (notes) → upload to `private-attachments`; store path in `attachments.file_path`.

## 9) Testing
- Public catalog loads from `public.public_courses` view.
- Demo lesson playable without purchase.
- Purchase flow marks enrollment.
- Protected lesson requires enrollment + token endpoint.
- RLS verified: users see only their `enrollments/purchases/progress`.

## 10) Upgrade path
- Move to Supabase **Pro** before charging real users.
- Add Admin UI for upload (call Stream API and save returned id).
- Add audit & alerts, billing monitors.
- Consider DRM later if piracy risk grows.
