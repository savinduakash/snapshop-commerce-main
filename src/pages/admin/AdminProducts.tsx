import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Switch } from '@/components/ui/switch';
import { Plus, Trash2, Pencil } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const AdminProducts = () => {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: '', description: '', price: '', category_id: '', featured: false, active: true });
  const [imageFile, setImageFile] = useState<File | null>(null);

  const { data: products, isLoading } = useQuery({
    queryKey: ['admin-products'],
    queryFn: async () => {
      const { data, error } = await supabase.from('products').select('*, categories(name)').order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const { data: categories } = useQuery({
    queryKey: ['admin-categories'],
    queryFn: async () => {
      const { data, error } = await supabase.from('categories').select('*').order('name');
      if (error) throw error;
      return data;
    },
  });

  const resetForm = () => {
    setForm({ name: '', description: '', price: '', category_id: '', featured: false, active: true });
    setImageFile(null);
    setEditId(null);
  };

  const saveMutation = useMutation({
    mutationFn: async () => {
      let image_url: string | undefined;
      if (imageFile) {
        const ext = imageFile.name.split('.').pop();
        const path = `${Date.now()}.${ext}`;
        const { error: uploadError } = await supabase.storage.from('product-images').upload(path, imageFile);
        if (uploadError) throw uploadError;
        const { data: urlData } = supabase.storage.from('product-images').getPublicUrl(path);
        image_url = urlData.publicUrl;
      }

      const payload = {
        name: form.name,
        description: form.description || null,
        price: parseFloat(form.price) || 0,
        category_id: form.category_id || null,
        featured: form.featured,
        active: form.active,
        ...(image_url && { image_url }),
      };

      if (editId) {
        const { error } = await supabase.from('products').update(payload).eq('id', editId);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('products').insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-products'] });
      qc.invalidateQueries({ queryKey: ['products'] });
      qc.invalidateQueries({ queryKey: ['admin-product-count'] });
      toast({ title: editId ? 'Product updated' : 'Product created' });
      setOpen(false);
      resetForm();
    },
    onError: (e: any) => toast({ title: 'Error', description: e.message, variant: 'destructive' }),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('products').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-products'] });
      qc.invalidateQueries({ queryKey: ['products'] });
      qc.invalidateQueries({ queryKey: ['admin-product-count'] });
      toast({ title: 'Product deleted' });
    },
  });

  const startEdit = (p: any) => {
    setEditId(p.id);
    setForm({
      name: p.name,
      description: p.description ?? '',
      price: String(p.price),
      category_id: p.category_id ?? '',
      featured: p.featured,
      active: p.active,
    });
    setOpen(true);
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold">Products</h1>
        <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) resetForm(); }}>
          <DialogTrigger asChild>
            <Button><Plus className="mr-2 h-4 w-4" /> Add Product</Button>
          </DialogTrigger>
          <DialogContent className="max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editId ? 'Edit Product' : 'New Product'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={(e) => { e.preventDefault(); saveMutation.mutate(); }} className="space-y-4">
              <div>
                <label className="text-sm font-medium">Name</label>
                <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
              </div>
              <div>
                <label className="text-sm font-medium">Description</label>
                <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
              </div>
              <div>
                <label className="text-sm font-medium">Price</label>
                <Input type="number" step="0.01" min="0" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required />
              </div>
              <div>
                <label className="text-sm font-medium">Category</label>
                <Select value={form.category_id} onValueChange={(v) => setForm({ ...form, category_id: v })}>
                  <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                  <SelectContent>
                    {categories?.map((c) => (
                      <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium">Image</label>
                <Input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files?.[0] ?? null)} />
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Switch checked={form.featured} onCheckedChange={(v) => setForm({ ...form, featured: v })} />
                  <label className="text-sm">Featured</label>
                </div>
                <div className="flex items-center gap-2">
                  <Switch checked={form.active} onCheckedChange={(v) => setForm({ ...form, active: v })} />
                  <label className="text-sm">Active</label>
                </div>
              </div>
              <Button type="submit" disabled={saveMutation.isPending} className="w-full">
                {saveMutation.isPending ? 'Saving...' : 'Save'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="mt-6 rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Image</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-24">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && <TableRow><TableCell colSpan={6} className="text-center">Loading...</TableCell></TableRow>}
            {products?.map((p) => (
              <TableRow key={p.id}>
                <TableCell>
                  <div className="h-10 w-10 overflow-hidden rounded bg-muted">
                    {p.image_url ? <img src={p.image_url} alt="" className="h-full w-full object-cover" /> : null}
                  </div>
                </TableCell>
                <TableCell className="font-medium">{p.name}</TableCell>
                <TableCell>${p.price.toFixed(2)}</TableCell>
                <TableCell>{(p.categories as any)?.name ?? '—'}</TableCell>
                <TableCell>
                  <span className={`rounded-full px-2 py-0.5 text-xs ${p.active ? 'bg-whatsapp/10 text-whatsapp' : 'bg-muted text-muted-foreground'}`}>
                    {p.active ? 'Active' : 'Inactive'}
                  </span>
                  {p.featured && <span className="ml-1 rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary">Featured</span>}
                </TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" onClick={() => startEdit(p)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="text-destructive" onClick={() => deleteMutation.mutate(p.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {!isLoading && (!products || products.length === 0) && (
              <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground">No products yet.</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default AdminProducts;
