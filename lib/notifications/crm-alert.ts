import { createAdminClient } from '@/utils/supabase/admin'
import { sendEmail } from '@/lib/email/send'

export type CrmAlertKind = 'booking' | 'inquiry'

export type CrmAlertPayload = {
  kind: CrmAlertKind
  name: string
  email: string
  phone?: string | null
  message?: string | null
  tourTitle?: string | null
  travelDates?: string | null
  groupSize?: string | number | null
  bookingNumber?: string | null
}

type AlertSettings = {
  enabled: boolean
  whatsapp: string
  email: string
}

function digitsPhone(phone: string): string {
  return phone.replace(/[^\d]/g, '')
}

function formatAlertText(payload: CrmAlertPayload, adminUrl: string): string {
  const kindLabel = payload.kind === 'booking' ? 'NEW BOOKING' : 'NEW INQUIRY'
  const lines = [
    `🏔️ Wangchuks CRM — ${kindLabel}`,
    '',
    `Name: ${payload.name}`,
    `Email: ${payload.email}`,
    payload.phone ? `Phone: ${payload.phone}` : null,
    payload.tourTitle ? `Tour: ${payload.tourTitle}` : null,
    payload.travelDates ? `Dates: ${payload.travelDates}` : null,
    payload.groupSize ? `Group: ${payload.groupSize}` : null,
    payload.bookingNumber ? `Booking #: ${payload.bookingNumber}` : null,
    payload.message ? `Message: ${payload.message.slice(0, 400)}` : null,
    '',
    `Open CRM: ${adminUrl}`,
  ].filter(Boolean)

  return lines.join('\n')
}

async function readAlertSettings(): Promise<AlertSettings> {
  const enabledEnv = process.env.CRM_ALERTS_ENABLED
  const defaults: AlertSettings = {
    enabled: enabledEnv == null ? true : enabledEnv !== 'false' && enabledEnv !== '0',
    whatsapp: process.env.CRM_ALERT_WHATSAPP || '',
    email: process.env.CRM_ALERT_EMAIL || process.env.EMAIL_FROM?.match(/<([^>]+)>/)?.[1] || '',
  }

  try {
    const supabase = createAdminClient()
    const { data } = await supabase
      .from('site_settings')
      .select('key, value')
      .in('key', [
        'crm_alerts_enabled',
        'crm_alert_whatsapp',
        'crm_alert_email',
      ])

    if (!data?.length) return defaults

    const map = Object.fromEntries(data.map((row) => [row.key, row.value]))
    const enabledRaw = map.crm_alerts_enabled
    const enabled =
      enabledRaw === undefined || enabledRaw === null
        ? defaults.enabled
        : enabledRaw === true ||
          enabledRaw === 'true' ||
          enabledRaw === 1 ||
          enabledRaw === '1'

    return {
      enabled,
      whatsapp: String(map.crm_alert_whatsapp || defaults.whatsapp || '').trim(),
      email: String(map.crm_alert_email || defaults.email || '').trim(),
    }
  } catch {
    return defaults
  }
}

async function sendWhatsAppViaTwilio(toPhone: string, text: string): Promise<{ ok: boolean; error?: string }> {
  const sid = process.env.TWILIO_ACCOUNT_SID
  const token = process.env.TWILIO_AUTH_TOKEN
  const from = process.env.TWILIO_WHATSAPP_FROM // e.g. whatsapp:+14155238886

  if (!sid || !token || !from) {
    return { ok: false, error: 'Twilio not configured' }
  }

  const to = toPhone.startsWith('whatsapp:')
    ? toPhone
    : `whatsapp:+${digitsPhone(toPhone)}`

  const body = new URLSearchParams({
    From: from.startsWith('whatsapp:') ? from : `whatsapp:${from}`,
    To: to,
    Body: text,
  })

  const auth = Buffer.from(`${sid}:${token}`).toString('base64')
  const res = await fetch(
    `https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`,
    {
      method: 'POST',
      headers: {
        Authorization: `Basic ${auth}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body,
    }
  )

  if (!res.ok) {
    const errText = await res.text()
    return { ok: false, error: errText }
  }
  return { ok: true }
}

/** CallMeBot — simple personal WhatsApp alerts (needs free apikey from bot). */
async function sendWhatsAppViaCallMeBot(
  toPhone: string,
  text: string
): Promise<{ ok: boolean; error?: string }> {
  const apiKey = process.env.CALLMEBOT_APIKEY
  if (!apiKey) return { ok: false, error: 'CALLMEBOT_APIKEY not set' }

  const phone = digitsPhone(toPhone)
  const url = `https://api.callmebot.com/whatsapp.php?phone=${encodeURIComponent(phone)}&text=${encodeURIComponent(text)}&apikey=${encodeURIComponent(apiKey)}`
  const res = await fetch(url)
  if (!res.ok) {
    return { ok: false, error: await res.text() }
  }
  return { ok: true }
}

/** Generic webhook — Make.com / n8n / custom. Supports {message} {phone} {text} placeholders. */
async function sendWhatsAppViaWebhook(
  toPhone: string,
  text: string
): Promise<{ ok: boolean; error?: string }> {
  const template = process.env.WHATSAPP_ALERT_WEBHOOK_URL
  if (!template) return { ok: false, error: 'WHATSAPP_ALERT_WEBHOOK_URL not set' }

  const phone = digitsPhone(toPhone)
  if (template.includes('{') ) {
    const url = template
      .replaceAll('{phone}', encodeURIComponent(phone))
      .replaceAll('{message}', encodeURIComponent(text))
      .replaceAll('{text}', encodeURIComponent(text))
    const res = await fetch(url)
    if (!res.ok) return { ok: false, error: await res.text() }
    return { ok: true }
  }

  const res = await fetch(template, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phone, message: text, channel: 'whatsapp' }),
  })
  if (!res.ok) return { ok: false, error: await res.text() }
  return { ok: true }
}

async function sendWhatsAppAlert(
  toPhone: string,
  text: string
): Promise<{ sent: boolean; provider?: string; error?: string }> {
  // Prefer Twilio → CallMeBot → webhook
  if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN && process.env.TWILIO_WHATSAPP_FROM) {
    const r = await sendWhatsAppViaTwilio(toPhone, text)
    return { sent: r.ok, provider: 'twilio', error: r.error }
  }
  if (process.env.CALLMEBOT_APIKEY) {
    const r = await sendWhatsAppViaCallMeBot(toPhone, text)
    return { sent: r.ok, provider: 'callmebot', error: r.error }
  }
  if (process.env.WHATSAPP_ALERT_WEBHOOK_URL) {
    const r = await sendWhatsAppViaWebhook(toPhone, text)
    return { sent: r.ok, provider: 'webhook', error: r.error }
  }
  return {
    sent: false,
    error:
      'No WhatsApp provider configured. Set TWILIO_* or CALLMEBOT_APIKEY or WHATSAPP_ALERT_WEBHOOK_URL.',
  }
}

/**
 * Fire-and-forget CRM alert for new booking / inquiry.
 * Never throws — booking/inquiry must succeed even if alert fails.
 */
export async function notifyCrmAlert(payload: CrmAlertPayload): Promise<void> {
  try {
    const settings = await readAlertSettings()
    if (!settings.enabled) {
      console.info('[crm-alert] disabled')
      return
    }

    const siteUrl =
      process.env.NEXT_PUBLIC_SITE_URL ||
      process.env.SITE_URL ||
      'https://wangchukstour.vercel.app'
    const adminPath =
      payload.kind === 'booking' ? '/admin/bookings' : '/admin/inquiries'
    const adminUrl = `${siteUrl.replace(/\/$/, '')}${adminPath}`
    const text = formatAlertText(payload, adminUrl)

    const jobs: Promise<unknown>[] = []

    if (settings.whatsapp) {
      jobs.push(
        sendWhatsAppAlert(settings.whatsapp, text).then((r) => {
          if (!r.sent) console.error('[crm-alert:whatsapp]', r.provider, r.error)
          else console.info('[crm-alert:whatsapp] sent via', r.provider)
          return r
        })
      )
    }

    if (settings.email) {
      const subject =
        payload.kind === 'booking'
          ? `New booking: ${payload.name}${payload.tourTitle ? ` — ${payload.tourTitle}` : ''}`
          : `New inquiry: ${payload.name}${payload.tourTitle ? ` — ${payload.tourTitle}` : ''}`

      jobs.push(
        sendEmail({
          to: settings.email,
          subject,
          text,
          html: `<pre style="font-family:ui-sans-serif,system-ui;white-space:pre-wrap">${text
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')}</pre>`,
        }).then((r) => {
          if (!r.sent) console.error('[crm-alert:email]', r.error)
          else console.info('[crm-alert:email] sent via', r.provider)
          return r
        })
      )
    }

    if (jobs.length === 0) {
      console.warn(
        '[crm-alert] no WhatsApp/email configured. Set crm_alert_whatsapp / crm_alert_email in admin settings or env.'
      )
      return
    }

    await Promise.allSettled(jobs)
  } catch (error) {
    console.error('[crm-alert] unexpected error', error)
  }
}

/** Used by admin test endpoint. */
export async function sendTestCrmAlert(toWhatsApp?: string, toEmail?: string) {
  const settings = await readAlertSettings()
  const payload: CrmAlertPayload = {
    kind: 'inquiry',
    name: 'Test Guest',
    email: 'test@example.com',
    phone: '+975 17 000 000',
    message: 'This is a test CRM alert from Wangchuks admin.',
    tourTitle: 'Test Tour',
  }
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.SITE_URL ||
    'https://wangchukstour.vercel.app'
  const text = formatAlertText(payload, `${siteUrl.replace(/\/$/, '')}/admin/inquiries`)

  const results: Record<string, unknown> = {}
  const wa = (toWhatsApp || settings.whatsapp || '').trim()
  const em = (toEmail || settings.email || '').trim()

  if (wa) {
    results.whatsapp = await sendWhatsAppAlert(wa, text)
  } else {
    results.whatsapp = { sent: false, error: 'No WhatsApp number configured' }
  }

  if (em) {
    results.email = await sendEmail({
      to: em,
      subject: 'Test CRM alert — Wangchuks',
      text,
      html: `<pre>${text}</pre>`,
    })
  } else {
    results.email = { sent: false, error: 'No alert email configured' }
  }

  return results
}
