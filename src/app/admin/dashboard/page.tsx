import { supabaseAdmin } from '@/lib/supabase/admin'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { IndianRupee, Users, Package, ShoppingCart } from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { format } from 'date-fns'

export const dynamic = 'force-dynamic'

export default async function AdminDashboardPage() {
  const supabase = supabaseAdmin

  // Fetch metrics and recent payments concurrently
  const [
    { count: productsCount },
    { count: ordersCount },
    { count: customersCount },
    { data: revenueData },
    { data: recentPayments }
  ] = await Promise.all([
    supabase.from('products').select('*', { count: 'exact', head: true }),
    supabase.from('orders').select('*', { count: 'exact', head: true }).eq('status', 'captured'),
    supabase.from('profiles').select('*', { count: 'exact', head: true }),
    supabase.from('payments').select('amount').eq('status', 'captured'),
    supabase
      .from('payments')
      .select(`
        *,
        orders (
          order_number,
          profiles ( email )
        )
      `)
      .order('created_at', { ascending: false })
      .limit(10)
  ])

  // Calculate total revenue
  const totalRevenue = revenueData?.reduce((acc, payment) => acc + Number(payment.amount), 0) || 0

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">Welcome to your admin dashboard.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <IndianRupee className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Intl.NumberFormat('en-IN', {
                style: 'currency',
                currency: 'INR',
                maximumFractionDigits: 0
              }).format(totalRevenue)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">From successful payments</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+{ordersCount || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">Lifetime captured orders</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{productsCount || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">Total items in catalog</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+{customersCount || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">Registered users</p>
          </CardContent>
        </Card>

      </div>

      <div className="space-y-4">
        <h3 className="text-xl font-bold tracking-tight">Recent Razorpay Transactions</h3>
        <div className="border rounded-md bg-surface">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Razorpay ID</TableHead>
                <TableHead>Order #</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentPayments && recentPayments.length > 0 ? (
                recentPayments.map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell className="whitespace-nowrap">
                      {format(new Date(payment.created_at), 'MMM d, h:mm a')}
                    </TableCell>
                    <TableCell className="font-mono text-xs text-muted-foreground">
                      {payment.razorpay_payment_id || '—'}
                    </TableCell>
                    <TableCell className="font-mono text-xs">
                      {payment.orders?.order_number || '—'}
                    </TableCell>
                    <TableCell>
                      {payment.orders?.profiles?.email || 'Unknown'}
                    </TableCell>
                    <TableCell>
                      {payment.status === 'captured' ? (
                        <Badge className="bg-green-500 hover:bg-green-600">Captured</Badge>
                      ) : payment.status === 'pending' ? (
                        <Badge variant="secondary">Pending</Badge>
                      ) : (
                        <Badge variant="destructive">{payment.status}</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {new Intl.NumberFormat('en-IN', {
                        style: 'currency',
                        currency: payment.currency || 'INR',
                      }).format(payment.amount)}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                    No transactions found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}
