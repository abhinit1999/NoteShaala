import { createClient } from '@/lib/supabase/server'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { format } from 'date-fns'

export const dynamic = 'force-dynamic'

export default async function AdminCustomersPage() {
  const supabase = await createClient()

  // Fetch profiles and join with orders to get a quick summary
  const { data: customers } = await supabase
    .from('profiles')
    .select(`
      *,
      orders ( id, total, status )
    `)
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Customers</h2>
        <p className="text-muted-foreground">View your registered users and their lifetime value.</p>
      </div>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Email</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Joined Date</TableHead>
              <TableHead>Orders</TableHead>
              <TableHead className="text-right">Lifetime Value</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {customers && customers.length > 0 ? (
              customers.map((customer) => {
                const capturedOrders = customer.orders?.filter((o: any) => o.status === 'captured') || []
                const lifetimeValue = capturedOrders.reduce((acc: number, order: any) => acc + Number(order.total), 0)

                return (
                  <TableRow key={customer.id}>
                    <TableCell className="font-medium">{customer.email}</TableCell>
                    <TableCell>{customer.full_name || '—'}</TableCell>
                    <TableCell className="whitespace-nowrap">
                      {format(new Date(customer.created_at), 'MMM d, yyyy')}
                    </TableCell>
                    <TableCell>{capturedOrders.length}</TableCell>
                    <TableCell className="text-right font-medium">
                      {new Intl.NumberFormat('en-IN', {
                        style: 'currency',
                        currency: 'INR',
                        maximumFractionDigits: 0
                      }).format(lifetimeValue)}
                    </TableCell>
                  </TableRow>
                )
              })
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  No customers found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
