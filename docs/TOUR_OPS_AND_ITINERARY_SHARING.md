# Tour Publish · Naked Itinerary Sharing · Booking Operations

**Status:** In progress  
**Branch:** `cursor/tour-ops-share-docs-0d14`  
**SQL:** `migrations/20260722_booking_operations_shares_docs.sql`  
**Run in:** Supabase SQL Editor (required before using new admin/ops features)

---

## Goals (client request)

1. **Publish tour to public or not** — Unpublished tours stay off `/tours` and tour detail URLs.
2. **Naked itinerary + share link** — Send a clean itinerary link to a client (no marketing chrome, **no rates**).
3. **Operations tab** (after booking confirm) — Record guide, driver, hotels; upload room vouchers.
4. **Staff share** — Share itinerary to guide/driver **without rates** (ops details included).
5. **Documents** — Upload SDF papers, invoices, payment proofs, room vouchers (PDF / DOC / images).

---

## What already existed

| Feature | Before |
|---------|--------|
| `tours.is_published` switch in TourForm | UI + DB column existed |
| Public tour listing | Only filtered `is_active` — **ignored publish** |
| Bookings confirm + payment ledger | Notes-based ledger + print invoice |
| Media library | Images only via Cloudinary |
| Operations / share tokens / booking docs | Missing |

---

## Visibility rules (tours)

| Switch | Meaning |
|--------|---------|
| **Active** | Soft enable; inactive tours never public |
| **Published** | Visible on public site when also Active |
| **Featured** | Homepage / featured placement |
| **Show price publicly** | Hide price → “Contact for price” |

Public queries require: `is_active = true` **AND** `is_published = true`.

Admin can still edit unpublished drafts in `/admin`.

---

## Data model

### `booking_operations` (1:1 with booking)

Guide, driver, hotels JSON, internal notes — filled once the booking is confirmed.

```json
// hotels[]
{
  "name": "Hotel Zhiwa Ling",
  "location": "Paro",
  "check_in": "2026-08-01",
  "check_out": "2026-08-03",
  "room_type": "Deluxe Twin",
  "confirmation_no": "ZL-123",
  "notes": ""
}
```

### `booking_share_links`

Tokenized public URLs:

| Audience | URL | Shows rates? | Shows ops (guide/driver)? |
|----------|-----|--------------|---------------------------|
| `client` | `/share/i/{token}` | No (naked) | No |
| `staff` | `/share/i/{token}` | No | Yes |

### `booking_documents`

| `doc_type` | Use |
|------------|-----|
| `room_voucher` | Hotel room vouchers |
| `sdf` | SDF / permit papers |
| `invoice` | Invoices |
| `payment` | Payment proofs |
| `other` | Misc |

Files go to Cloudinary (`resource_type: auto`) under `wangchuk-tour/booking-docs`.

### Optional tour-level share

`tours.naked_share_token` — share a **package** naked itinerary before a booking exists (`/share/tour/{token}`).

---

## Admin UX

### Tour form
- Clarify Published = “Show on public website”
- Button: **Copy naked itinerary link** (tour token)

### Booking detail → tabs
1. **Overview** — existing client / payment / status
2. **Operations** — guide, driver, hotels (enabled when confirmed; draft save allowed)
3. **Documents** — upload/list SDF, invoices, payments, vouchers
4. **Share** — generate Client (naked) / Guide & Driver (no rates) links

---

## Public share pages

Minimal printable layout:
- Brand + trip title + travel dates + traveler count
- Day-by-day itinerary (from linked tour)
- Client: hotels optional if saved; no prices; no staff contacts
- Staff: hotels + guide/driver contacts; no prices

---

## API surface

| Method | Path | Purpose |
|--------|------|---------|
| GET/PUT | `/api/admin/bookings/[id]/operations` | Ops CRUD |
| GET/POST/DELETE | `/api/admin/bookings/[id]/documents` | Docs |
| GET/POST/DELETE | `/api/admin/bookings/[id]/share-links` | Tokens |
| POST | `/api/admin/tours/[id]/naked-share` | Ensure tour share token |
| GET | `/api/share/itinerary/[token]` | Public payload |
| POST | `/api/upload` | Accept PDF/DOC/images (`resource_type=auto`) |

---

## Deploy checklist

1. Run `migrations/20260722_booking_operations_shares_docs.sql` in Supabase SQL Editor
2. Deploy app (Vercel)
3. Confirm a booking → fill Operations → upload docs → copy share links
4. Toggle a tour **Published** off → confirm it disappears from `/tours`

---

## Out of scope (later)

- Emailing share links automatically
- Client portal login
- Separate driver mobile app
- Replacing print-invoice HTML with stored PDF generation
