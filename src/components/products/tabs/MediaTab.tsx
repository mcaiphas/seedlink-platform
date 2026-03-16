import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Image as ImageIcon } from 'lucide-react';

interface Props {
  form: Record<string, any>;
  update: (key: string, value: any) => void;
}

export function MediaTab({ form, update }: Props) {
  const imageUrl = form.image_url || '';
  const additionalImages: string[] = form.metadata?.additional_images || [];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><ImageIcon className="h-5 w-5" />Product Media</CardTitle>
        <CardDescription>Manage product images and media assets.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label>Primary Image URL</Label>
          <Input
            value={imageUrl}
            onChange={e => update('image_url', e.target.value)}
            placeholder="https://example.com/product-image.jpg"
          />
        </div>

        {imageUrl && (
          <div className="rounded-lg border p-4 bg-muted/30">
            <p className="text-xs text-muted-foreground mb-2">Preview</p>
            <div className="w-40 h-40 rounded-lg overflow-hidden bg-muted border">
              <img
                src={imageUrl}
                alt="Product"
                className="w-full h-full object-cover"
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
              />
            </div>
          </div>
        )}

        {!imageUrl && (
          <div className="rounded-lg border border-dashed p-10 text-center">
            <ImageIcon className="mx-auto h-10 w-10 text-muted-foreground mb-3" />
            <p className="text-sm font-medium">No image set</p>
            <p className="text-xs text-muted-foreground mt-1">Add an image URL above to display a product image.</p>
          </div>
        )}

        <div className="space-y-2">
          <Label>Additional Image URLs</Label>
          <p className="text-xs text-muted-foreground">Add up to 5 additional images, one URL per line</p>
          <textarea
            className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            value={additionalImages.join('\n')}
            onChange={e => {
              const urls = e.target.value.split('\n').filter(u => u.trim()).slice(0, 5);
              update('metadata', { ...form.metadata, additional_images: urls });
            }}
            placeholder="https://example.com/image-2.jpg&#10;https://example.com/image-3.jpg"
          />
        </div>

        {additionalImages.length > 0 && (
          <div className="flex gap-3 flex-wrap">
            {additionalImages.map((url, i) => (
              <div key={i} className="w-20 h-20 rounded-lg overflow-hidden bg-muted border">
                <img src={url} alt={`Extra ${i + 1}`} className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
