# CRM WhatsApp / Email Alerts

Get a WhatsApp (and/or email) ping when someone books or inquires — without opening the CRM daily.

## Admin UI

**Admin → Settings → General** → **CRM alerts (WhatsApp + email)**

1. Turn **Enable alerts** on  
2. Enter your WhatsApp number (`+97517643416`)  
3. Optional: alert email  
4. **Save** → **Send test alert**

## WhatsApp providers (pick one — set in Vercel env)

### Option A — CallMeBot (easiest for personal phone)

1. Add [CallMeBot](https://www.callmebot.com/blog/free-api-whatsapp-messages/) on WhatsApp and get an API key  
2. Vercel env:
   ```
   CALLMEBOT_APIKEY=your_key
   CRM_ALERT_WHATSAPP=+97517643416
   ```
3. Redeploy → Send test alert

### Option B — Twilio WhatsApp (more “business” / reliable)

```
TWILIO_ACCOUNT_SID=...
TWILIO_AUTH_TOKEN=...
TWILIO_WHATSAPP_FROM=whatsapp:+14155238886
CRM_ALERT_WHATSAPP=+97517643416
```

(Use Twilio sandbox first, then a approved WhatsApp sender.)

### Option C — Make.com / n8n webhook

```
WHATSAPP_ALERT_WEBHOOK_URL=https://hook.make.com/xxxxx
```

POST JSON: `{ phone, message, channel: "whatsapp" }`  
Or use URL placeholders: `...?phone={phone}&text={message}`

## Email backup

```
RESEND_API_KEY=...
CRM_ALERT_EMAIL=you@wangchuktour.com
```

(or set the email in Admin → CRM alerts)

## What triggers alerts

- Public **booking / inquire** on a tour → WhatsApp + email  
- Public **contact form** → WhatsApp + email  

Alerts never block the customer form — if WhatsApp fails, the lead is still saved in CRM.

## Optional env toggles

```
CRM_ALERTS_ENABLED=true
CRM_ALERT_WHATSAPP=+97517643416
CRM_ALERT_EMAIL=you@email.com
NEXT_PUBLIC_SITE_URL=https://wangchukstour.vercel.app
```
