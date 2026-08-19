'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { createProduct, updateProduct } from '@/app/actions/admin'
import { FileUploader } from '@/components/file-uploader'
import { Loader2 } from 'lucide-react'

const productSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  slug: z.string().optional(),
  short_description: z.string().optional(),
  description: z.string().optional(),
  price: z.number().min(0, 'Price must be positive'),
  compare_at_price: z.number().optional(),
  is_free: z.boolean(),
  is_published: z.boolean(),
  estimated_time: z.string().optional(),
  prerequisites: z.string().optional(),
})

type ProductFormData = z.infer<typeof productSchema>

interface ProductFormProps {
  initialData?: any
  categories?: { id: string, title: string }[]
}

export function ProductForm({ initialData, categories }: ProductFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [coverImageUrl, setCoverImageUrl] = useState(initialData?.cover_image || '')
  const [protectedFileUrl, setProtectedFileUrl] = useState(initialData?.protected_file_url || '')
  const [categoryId, setCategoryId] = useState(initialData?.category_id || '')
  const [contentJson, setContentJson] = useState(initialData?.content_json ? JSON.stringify(initialData.content_json, null, 2) : '')

  const isEdit = !!initialData

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      title: initialData?.title || '',
      slug: initialData?.slug || '',
      short_description: initialData?.short_description || '',
      description: initialData?.description || '',
      price: initialData?.price || 0,
      compare_at_price: initialData?.compare_at_price || 0,
      is_free: initialData?.is_free || false,
      is_published: initialData?.is_published || false,
      estimated_time: initialData?.estimated_time || '',
      prerequisites: initialData?.prerequisites?.join(', ') || '',
    }
  })

  const isFree = watch('is_free')

  const onSubmit = async (data: ProductFormData) => {
    setIsLoading(true)

    // Auto-generate a URL-friendly slug if left empty
    let finalSlug = data.slug;
    if (!finalSlug || finalSlug.trim() === '') {
      finalSlug = data.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
    }

    const payload = {
      ...data,
      slug: finalSlug,
      cover_image: coverImageUrl,
      protected_file_url: protectedFileUrl,
      category_id: categoryId || null,
      content_json: contentJson || null,
    }

    try {
      let res
      if (isEdit) {
        res = await updateProduct(initialData.id, payload)
      } else {
        res = await createProduct(payload)
      }

      if (res.error) {
        throw new Error(res.error)
      }

      router.push('/admin/products')
      router.refresh()
    } catch (error: any) {
      alert(error.message || 'Something went wrong')
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 max-w-4xl">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Left Column: Basic Info */}
        <div className="md:col-span-2 space-y-6">
          <div className="space-y-4 border p-6 rounded-lg bg-card text-card-foreground">
            <h3 className="text-lg font-semibold">Basic Information</h3>
            
            <div className="space-y-2">
              <Label htmlFor="title">Title <span className="text-destructive">*</span></Label>
              <Input id="title" {...register('title')} placeholder="Product Title" />
              {errors.title && <p className="text-sm text-destructive">{errors.title.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="slug">Slug (Leave blank to auto-generate)</Label>
              <Input id="slug" {...register('slug')} placeholder="product-title-slug" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="short_description">Short Description</Label>
              <Input id="short_description" {...register('short_description')} placeholder="Brief summary for the card" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Full Description (HTML Supported)</Label>
              <Textarea id="description" {...register('description')} rows={5} placeholder="<p>Detailed description...</p>" />
            </div>

            <div className="space-y-2">
              <Label>Category</Label>
              <select 
                value={categoryId} 
                onChange={(e) => setCategoryId(e.target.value)}
                className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="">Select a Category</option>
                {categories?.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.title}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-4 border p-6 rounded-lg bg-card text-card-foreground">
            <h3 className="text-lg font-semibold">Files & Media</h3>
            
            <div className="space-y-2">
              <Label>Cover Image (Public)</Label>
              <FileUploader 
                bucket="public-assets"
                folder="covers"
                accept="image/*"
                existingUrl={coverImageUrl}
                onUploadSuccess={setCoverImageUrl}
              />
            </div>

            <div className="space-y-2">
              <Label>Digital Product File (Private / Protected PDF)</Label>
              <FileUploader 
                bucket="digital-products"
                folder="files"
                accept=".pdf,.zip"
                existingUrl={protectedFileUrl}
                onUploadSuccess={setProtectedFileUrl}
              />
            </div>
          </div>

          <div className="space-y-4 border p-6 rounded-lg bg-card text-card-foreground">
            <h3 className="text-lg font-semibold">Additional Details</h3>
            
            <div className="space-y-2">
              <Label htmlFor="estimated_time">Estimated Time</Label>
              <Input id="estimated_time" {...register('estimated_time')} placeholder="e.g. 2 Hours" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="prerequisites">Prerequisites (Comma separated)</Label>
              <Input id="prerequisites" {...register('prerequisites')} placeholder="e.g. React basics, Node.js" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="content_json">Course Contents (JSON Outline)</Label>
              <Textarea 
                id="content_json" 
                value={contentJson}
                onChange={(e) => setContentJson(e.target.value)}
                rows={5} 
                placeholder='{"chapters": [{"title": "Introduction", "description": "..."}]}' 
              />
              <p className="text-xs text-muted-foreground">Used to render the accordion tabs.</p>
            </div>
          </div>
        </div>

        {/* Right Column: Pricing & Status */}
        <div className="space-y-6">
          <div className="space-y-4 border p-6 rounded-lg bg-card text-card-foreground">
            <h3 className="text-lg font-semibold">Pricing</h3>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="is_free">Is this product free?</Label>
              <Switch 
                id="is_free" 
                checked={isFree} 
                onCheckedChange={(checked) => setValue('is_free', checked)} 
              />
            </div>

            {!isFree && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="price">Price (INR) <span className="text-destructive">*</span></Label>
                  <Input 
                    id="price" 
                    type="number" 
                    {...register('price', { valueAsNumber: true })} 
                  />
                  {errors.price && <p className="text-sm text-destructive">{errors.price.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="compare_at_price">Compare at Price (INR)</Label>
                  <Input 
                    id="compare_at_price" 
                    type="number" 
                    {...register('compare_at_price', { valueAsNumber: true })} 
                  />
                </div>
              </>
            )}
          </div>

          <div className="space-y-4 border p-6 rounded-lg bg-card text-card-foreground">
            <h3 className="text-lg font-semibold">Visibility</h3>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="is_published">Publish Product</Label>
              <Switch 
                id="is_published" 
                checked={watch('is_published')} 
                onCheckedChange={(checked) => setValue('is_published', checked)} 
              />
            </div>
            <p className="text-xs text-muted-foreground">
              If unchecked, this product will be saved as a draft.
            </p>
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isEdit ? 'Update Product' : 'Create Product'}
          </Button>
        </div>
      </div>
    </form>
  )
}
