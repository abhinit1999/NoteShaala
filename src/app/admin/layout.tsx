import Link from 'next/link'
import { Package, ArrowLeft } from 'lucide-react'
import { siteConfig } from '@/config/site'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { AdminNav } from '@/components/admin-nav'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Only allow access if user is logged in AND their email matches the admin email
  // Fallback to a placeholder if the env var isn't set yet.
  const adminEmail = process.env.ADMIN_EMAIL || 'your_email@example.com'
  
  if (!user || user.email !== adminEmail) {
    redirect('/') // Kick general users back to the homepage
  }

  return (
    <div className="flex min-h-screen bg-muted/40">
      {/* Sidebar */}
      <aside className="fixed top-20 bottom-0 left-0 z-10 hidden w-64 flex-col border-r bg-background sm:flex">
        <div className="flex h-14 items-center border-b px-6">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <Package className="h-5 w-5" />
            <span className="">Admin Panel</span>
          </Link>
        </div>
        
        <AdminNav />

        <div className="mt-auto p-4">
          <Link
            href="/"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary hover:bg-muted"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Site
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-64 w-full">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
          <h1 className="text-xl font-semibold tracking-tight hidden sm:block">
            {siteConfig.name} - Workspace
          </h1>
          <div className="ml-auto flex items-center gap-4">
             {/* We can add a User Nav dropdown here later if needed */}
          </div>
        </header>
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
          {children}
        </main>
      </div>
    </div>
  )
}
