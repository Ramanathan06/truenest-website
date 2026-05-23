# Lead Auto-Responder Email Template

Sent automatically when a visitor submits any form on truenest.co.in
(home CTA, Inquiries, Careers, Request Brochure).

**Wiring status:** Template drafted, NOT yet sent. To activate we need:
1. A "from" inbox (e.g. `hello@truenest.co.in`) — client must confirm.
2. An SMTP provider — recommend **Resend** or **AWS SES** (free tier covers <3k mails/mo).
3. ~30 min to wire into `app/app/api/leads/route.ts` after the inbox is confirmed.

---

## Subject

`Thank you for your interest in TrueNest`

## From

`TrueNest <hello@truenest.co.in>`

## HTML body

```html
<!doctype html>
<html>
<body style="font-family:Georgia,serif;background:#F4F1EA;margin:0;padding:40px 20px;color:#1C1B18">
  <div style="max-width:560px;margin:0 auto;background:#fff;padding:48px 40px;border:1px solid #D8D1C2">
    <h1 style="font-size:24px;font-weight:500;letter-spacing:.05em;margin:0 0 8px">TRUENEST</h1>
    <p style="font-size:13px;letter-spacing:.18em;text-transform:uppercase;color:#5A554B;margin:0 0 32px">Truly in nature</p>

    <p style="font-size:16px;line-height:1.7">Dear {{name}},</p>

    <p style="font-size:16px;line-height:1.7">
      Thank you for reaching out to TrueNest. We've received your enquiry
      {{#project}}about <strong>{{project}}</strong>{{/project}} and a member
      of our residences team will be in touch within 24 hours.
    </p>

    <p style="font-size:16px;line-height:1.7">
      In the meantime, you're warmly invited to explore our
      <a href="https://truenest.co.in/projects.html" style="color:#2F4A39">current residences</a>
      or read <a href="https://truenest.co.in/story.html" style="color:#2F4A39">our story</a>.
    </p>

    <p style="font-size:16px;line-height:1.7;margin-top:32px">
      With warm regards,<br>
      The TrueNest Team
    </p>

    <hr style="border:none;border-top:1px solid #D8D1C2;margin:40px 0">
    <p style="font-size:12px;color:#5A554B;line-height:1.6">
      TrueNest · Nandi Hills, Bangalore · 915m<br>
      +91 63698 29365 · hello@truenest.co.in<br>
      RERA/KA/24/0142
    </p>
  </div>
</body>
</html>
```

## Plain-text fallback

```
Dear {{name}},

Thank you for reaching out to TrueNest. We've received your enquiry
{{#project}}about {{project}}{{/project}} and a member of our residences
team will be in touch within 24 hours.

In the meantime, explore our residences:
https://truenest.co.in/projects.html

With warm regards,
The TrueNest Team

—
TrueNest · Nandi Hills, Bangalore
+91 63698 29365 · hello@truenest.co.in
RERA/KA/24/0142
```

## Variables

| Token | Source |
|---|---|
| `{{name}}` | `leads.name` |
| `{{project}}` | `leads.project` (optional — conditional block) |

## Internal copy (sales notification)

Recommend also sending a notification to the sales inbox:

**Subject:** `New lead — {{name}} ({{source}})`
**To:** TBD (client to provide)
**Body:** Plain dump of name / email / phone / project / message / source / created_at + admin link.
