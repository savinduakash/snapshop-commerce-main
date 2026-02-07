import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useSiteSettings } from '@/hooks/use-products';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const AdminSettings = () => {
  const qc = useQueryClient();
  const { data: settings, isLoading } = useSiteSettings();
  const [form, setForm] = useState({
    store_name: '',
    store_description: '',
    whatsapp_number: '',
    currency: 'USD',
    currency_symbol: '$',
  });

  useEffect(() => {
    if (settings) {
      setForm({
        store_name: settings.store_name,
        store_description: settings.store_description ?? '',
        whatsapp_number: settings.whatsapp_number,
        currency: settings.currency,
        currency_symbol: settings.currency_symbol,
      });
    }
  }, [settings]);

  const mutation = useMutation({
    mutationFn: async () => {
      if (!settings) return;
      const { error } = await supabase
        .from('site_settings')
        .update({
          store_name: form.store_name,
          store_description: form.store_description || null,
          whatsapp_number: form.whatsapp_number,
          currency: form.currency,
          currency_symbol: form.currency_symbol,
        })
        .eq('id', settings.id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['site-settings'] });
      toast({ title: 'Settings saved' });
    },
    onError: (e: any) => toast({ title: 'Error', description: e.message, variant: 'destructive' }),
  });

  if (isLoading) return <p>Loading...</p>;

  return (
    <div>
      <h1 className="font-display text-2xl font-bold">Store Settings</h1>
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>General</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={(e) => { e.preventDefault(); mutation.mutate(); }} className="space-y-4">
            <div>
              <label className="text-sm font-medium">Store Name</label>
              <Input value={form.store_name} onChange={(e) => setForm({ ...form, store_name: e.target.value })} />
            </div>
            <div>
              <label className="text-sm font-medium">Store Description</label>
              <Textarea value={form.store_description} onChange={(e) => setForm({ ...form, store_description: e.target.value })} />
            </div>
            <div>
              <label className="text-sm font-medium">WhatsApp Number (with country code, e.g. 919876543210)</label>
              <Input value={form.whatsapp_number} onChange={(e) => setForm({ ...form, whatsapp_number: e.target.value })} placeholder="919876543210" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Currency Code</label>
                <Input value={form.currency} onChange={(e) => setForm({ ...form, currency: e.target.value })} />
              </div>
              <div>
                <label className="text-sm font-medium">Currency Symbol</label>
                <Input value={form.currency_symbol} onChange={(e) => setForm({ ...form, currency_symbol: e.target.value })} />
              </div>
            </div>
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? 'Saving...' : 'Save Settings'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminSettings;
