import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { signOut } from '@/app/actions/auth'
import { Button, buttonVariants } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Plus, Package, CreditCard, Clock, LogOut } from 'lucide-react'
import { AccountSettingsForm } from '@/components/account-settings-form'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export default async function AccountPage() {
  const supabase = await createClient()
  
  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) {
    redirect('/login')
  }

  const isAdmin = user.email === process.env.ADMIN_EMAIL

  // 1. Fetch Profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  // 2. Fetch User Stats (Owned Products Count)
  const { count: productsCount } = await supabase
    .from('user_products')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id)
    .eq('access_status', 'active')

  // 3. Fetch Orders for Total Spent & History
  const { data: orders } = await supabase
    .from('orders')
    .select('id, order_number, total, created_at, status')
    .eq('user_id', user.id)
    .eq('status', 'captured')
    .order('created_at', { ascending: false })

  const totalSpent = orders?.reduce((acc, order) => acc + (order.total || 0), 0) || 0

  return (
    <div className="container max-w-6xl pt-32 pb-16 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Account Dashboard</h1>
          <p className="text-muted-foreground">Manage your settings and view your activity.</p>
        </div>
        <div className="flex items-center gap-3">
          {isAdmin && (
            <Link href="/admin/products/new" className={buttonVariants({ variant: "default" })}>
              <Plus className="w-4 h-4 mr-2" /> Add Product
            </Link>
          )}
          <form action={signOut}>
            <Button variant="outline" type="submit">
              <LogOut className="w-4 h-4 mr-2" /> Sign Out
            </Button>
          </form>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Stats & Activity */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Quick Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Products Owned</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{productsCount || 0}</div>
                <p className="text-xs text-muted-foreground mt-1">Resources in your library</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
                <CreditCard className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">₹{totalSpent.toFixed(2)}</div>
                <p className="text-xs text-muted-foreground mt-1">Lifetime investment</p>
              </CardContent>
            </Card>
          </div>

          {/* Recent Orders Table */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5" /> Order History
              </CardTitle>
              <CardDescription>Your most recent successful purchases.</CardDescription>
            </CardHeader>
            <CardContent>
              {!orders || orders.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground text-sm border border-dashed rounded-md">
                  No purchases found yet.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Order ID</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead className="text-right">Total</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {orders.map((order) => (
                        <TableRow key={order.id}>
                          <TableCell className="font-medium text-xs">{order.order_number}</TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {new Date(order.created_at).toLocaleDateString()}
                          </TableCell>
                          <TableCell className="text-right font-semibold">₹{order.total.toFixed(2)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Profile Settings Form */}
        <div className="lg:col-span-1">
          <AccountSettingsForm 
            email={user.email || ''} 
            initialFullName={profile?.full_name || ''} 
          />
        </div>

      </div>
    </div>
  )
}
