# How to Customize Email Confirmation in Supabase for Apsarah

Follow these simple steps to replace the generic Supabase email with your custom **Apsarah** branded confirmation email.

---

### Step 1: Open Supabase Dashboard
1. Go to [https://supabase.com/dashboard](https://supabase.com/dashboard) and select your project (`apsarah`).
2. In the left navigation menu, click **Authentication** (the key icon).
3. Click **Email Templates**.

---

### Step 2: Configure "Confirm Signup" Template
1. Under **Email Templates**, select **Confirm Signup**.
2. Update the fields as follows:

- **Sender Name**: `Apsarah` (or `Apsarah Luxury Wear`)
- **Subject**: `Welcome to Apsarah — Verify Your Email Address ✨`
- **Body (HTML)**: Copy and paste the HTML content from `supabase/templates/confirm-signup.html`.

---

### Step 3: Save Changes
1. Click **Save** at the bottom of the page.
2. Done! Now whenever a new user registers on your site, they will receive a beautifully formatted email with your logo, royal maroon/gold colors, and customized Apsarah messaging.

---

### Additional Tip: Custom Sender Domain (Optional)
By default, Supabase sends emails from `noreply@mail.app.supabase.io`. 
If you want emails sent directly from your custom domain (e.g. `support@apsarah.com`):
1. In Supabase Dashboard, go to **Authentication** -> **Providers** -> **Email**.
2. Scroll to **Custom SMTP**.
3. Turn ON **Enable Custom SMTP** and enter your SMTP credentials (from Resend, SendGrid, Amazon SES, or Gmail).
