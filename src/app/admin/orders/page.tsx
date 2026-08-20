import { supabaseAdmin } from '@/lib/supabase/admin'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { siteConfig } from '@/config/site'
import { format } from 'date-fns'

export const dynamic = 'force-dynamic'

export default async function AdminOrdersPage() {
  const supabase = supabaseAdmin

  const { data: orders } = await supabase
    .from('orders')
    .select(`
      *,
      order_items ( product_title_snapshot )
    `)
    .order('created_at', { ascending: false })

  // Fetch emails manually for the orders since we can't join auth.users directly
  const ordersWithEmails = await Promise.all((orders || []).map(async (order) => {
    let email = 'Unknown'
    const userId = order.user_id
    if (userId) {
      const { data: userData } = await supabase.auth.admin.getUserById(userId)
      if (userData?.user?.email) {
        email = userData.user.email
      }
    }
    return { ...order, userEmail: email }
  }))

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Orders</h2>
        <p className="text-muted-foreground">View and manage customer transactions.</p>
      </div>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Items</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {ordersWithEmails && ordersWithEmails.length > 0 ? (
              ordersWithEmails.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium text-xs font-mono">{order.order_number}</TableCell>
                  <TableCell className="whitespace-nowrap">
                    {format(new Date(order.created_at), 'MMM d, yyyy')}
                  </TableCell>
                  <TableCell>{order.userEmail}</TableCell>
                  <TableCell>
                    {order.order_items?.map((item: any) => item.product_title_snapshot).join(', ') || '—'}
                  </TableCell>
                  <TableCell>
                    {order.status === 'captured' ? (
                      <Badge className="bg-green-500 hover:bg-green-600">Captured</Badge>
                    ) : order.status === 'pending' ? (
                      <Badge variant="secondary">Pending</Badge>
                    ) : (
                      <Badge variant="destructive">{order.status}</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {new Intl.NumberFormat('en-IN', {
                      style: 'currency',
                      currency: order.currency || siteConfig.currency,
                    }).format(order.total)}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No orders found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
