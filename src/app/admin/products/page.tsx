import { supabaseAdmin } from '@/lib/supabase/admin'
import Link from 'next/link'
import { Plus, Pencil, MoreHorizontal } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { siteConfig } from '@/config/site'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export const dynamic = 'force-dynamic'

export default async function AdminProductsPage() {
  const supabase = supabaseAdmin

  const { data: products } = await supabase
    .from('products')
    .select('*, categories(title)')
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Products</h2>
          <p className="text-muted-foreground">Manage your digital products and notes.</p>
        </div>
        <Link href="/admin/products/new">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Add Product
          </Button>
        </Link>
      </div>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Category</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products && products.length > 0 ? (
              products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-3">
                      {product.cover_image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img 
                          src={product.cover_image} 
                          alt="" 
                          className="w-10 h-10 rounded-md object-cover bg-muted"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-md bg-muted flex items-center justify-center text-xs">
                          Img
                        </div>
                      )}
                      <span>{product.title}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {product.is_published ? (
                      <Badge className="bg-green-500 hover:bg-green-600">Published</Badge>
                    ) : (
                      <Badge variant="secondary">Draft</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    {product.is_free ? (
                      <span className="font-medium text-primary">Free</span>
                    ) : (
                      <span>
                        {new Intl.NumberFormat('en-IN', {
                          style: 'currency',
                          currency: siteConfig.currency,
                          maximumFractionDigits: 0
                        }).format(product.price)}
                      </span>
                    )}
                  </TableCell>
                  <TableCell>{product.categories?.title || '—'}</TableCell>
                  <TableCell className="text-right">
                    <Link href={`/admin/products/${product.id}/edit`}>
                      <Button variant="ghost" size="icon" title="Edit Product">
                        <Pencil className="h-4 w-4 text-muted-foreground hover:text-primary" />
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  No products found. Click &quot;Add Product&quot; to create one.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
