'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Bell, Loader2, MessageSquare, Mail, Save, Send } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FormField } from '@/components/ui/form-field';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

type AlertSettings = {
  crm_alerts_enabled: boolean;
  crm_alert_whatsapp: string;
  crm_alert_email: string;
};

type Providers = {
  twilio: boolean;
  callmebot: boolean;
  webhook: boolean;
  email: boolean;
};

export function CrmAlertsForm() {
  const [settings, setSettings] = useState<AlertSettings>({
    crm_alerts_enabled: true,
    crm_alert_whatsapp: '',
    crm_alert_email: '',
  });
  const [providers, setProviders] = useState<Providers>({
    twilio: false,
    callmebot: false,
    webhook: false,
    email: false,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);

  useEffect(() => {
    fetch('/api/admin/alerts')
      .then((r) => r.json())
      .then((data) => {
        if (data.settings) setSettings(data.settings);
        if (data.providers) setProviders(data.providers);
      })
      .catch(() => toast.error('Failed to load alert settings'))
      .finally(() => setLoading(false));
  }, []);

  const save = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/admin/alerts', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Save failed');
      toast.success('CRM alert settings saved');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const sendTest = async () => {
    setTesting(true);
    try {
      await save();
      const res = await fetch('/api/admin/alerts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          whatsapp: settings.crm_alert_whatsapp,
          email: settings.crm_alert_email,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Test failed');

      const wa = json.results?.whatsapp;
      const em = json.results?.email;
      if (wa?.sent || em?.sent) {
        toast.success('Test alert sent — check WhatsApp/email');
      } else {
        toast.error(
          wa?.error ||
            em?.error ||
            'No provider sent. Configure Twilio, CallMeBot, or Resend env vars.'
        );
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Test failed');
    } finally {
      setTesting(false);
    }
  };

  if (loading) {
    return (
      <Card className="flex items-center justify-center p-8">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </Card>
    );
  }

  const anyWhatsAppProvider = providers.twilio || providers.callmebot || providers.webhook;

  return (
    <Card className="space-y-6 p-6">
      <div>
        <h3 className="font-heading mb-1 flex items-center gap-2 text-xl font-bold">
          <Bell className="h-5 w-5 text-primary" />
          CRM alerts (WhatsApp + email)
        </h3>
        <p className="text-sm text-muted-foreground">
          Get notified on your phone when a booking or inquiry arrives — even if you don&apos;t open
          the CRM.
        </p>
      </div>

      <div className="flex items-center gap-3 rounded-lg border border-border bg-muted/30 px-4 py-3">
        <Switch
          id="crm-alerts-enabled"
          checked={settings.crm_alerts_enabled}
          onCheckedChange={(v) => setSettings((s) => ({ ...s, crm_alerts_enabled: v }))}
        />
        <Label htmlFor="crm-alerts-enabled" className="cursor-pointer font-normal">
          Enable alerts for new bookings & inquiries
        </Label>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-1">
          <div className="mb-1 flex items-center gap-2 text-sm font-medium">
            <MessageSquare className="h-4 w-4" /> WhatsApp number
          </div>
          <FormField
            label=""
            value={settings.crm_alert_whatsapp}
            onChange={(e) => setSettings((s) => ({ ...s, crm_alert_whatsapp: e.target.value }))}
            placeholder="+97517643416"
          />
          <p className="text-xs text-muted-foreground">Use full country code, no spaces preferred.</p>
        </div>
        <div className="space-y-1">
          <div className="mb-1 flex items-center gap-2 text-sm font-medium">
            <Mail className="h-4 w-4" /> Alert email (backup)
          </div>
          <FormField
            label=""
            value={settings.crm_alert_email}
            onChange={(e) => setSettings((s) => ({ ...s, crm_alert_email: e.target.value }))}
            placeholder="you@wangchuktour.com"
          />
        </div>
      </div>

      <div className="rounded-lg border border-border bg-muted/20 p-4 text-sm">
        <p className="mb-2 font-medium">Provider status (Vercel env)</p>
        <ul className="space-y-1 text-muted-foreground">
          <li>Twilio WhatsApp: {providers.twilio ? '✅ ready' : '⬜ not set'}</li>
          <li>CallMeBot (simple): {providers.callmebot ? '✅ ready' : '⬜ not set'}</li>
          <li>Custom webhook: {providers.webhook ? '✅ ready' : '⬜ not set'}</li>
          <li>Email (Resend): {providers.email ? '✅ ready' : '⬜ not set'}</li>
        </ul>
        {!anyWhatsAppProvider ? (
          <p className="mt-3 text-amber-700 dark:text-amber-400">
            WhatsApp needs one provider in Vercel env — easiest start: CallMeBot (free personal alerts).
            See docs/CRM_WHATSAPP_ALERTS.md
          </p>
        ) : null}
      </div>

      <div className="flex flex-wrap gap-2">
        <Button type="button" onClick={save} disabled={saving}>
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Save
        </Button>
        <Button type="button" variant="outline" onClick={sendTest} disabled={testing}>
          {testing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          Send test alert
        </Button>
      </div>
    </Card>
  );
}
