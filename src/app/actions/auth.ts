'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { z } from 'zod'

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

const signupSchema = loginSchema.extend({
  fullName: z.string().min(2, 'Full name is required'),
})

export async function login(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const result = loginSchema.safeParse({ email, password })

  if (!result.success) {
    return { error: result.error.issues[0].message }
  }

  const supabase = await createClient()

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/', 'layout')
  redirect('/account')
}

export async function signup(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const fullName = formData.get('fullName') as string

  const result = signupSchema.safeParse({ email, password, fullName })

  if (!result.success) {
    return { error: result.error.issues[0].message }
  }

  const supabase = await createClient()

  // Note: By default, Supabase requires email verification.
  // The user won't be fully logged in until they verify.
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
      },
      // You can define a custom email redirect here if you want:
      // emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`
    },
  })

  if (error) {
    return { error: error.message }
  }

  // If email verification is disabled in Supabase, data.session will be present
  if (data.session) {
    revalidatePath('/', 'layout')
    redirect('/account')
  }

  return { success: 'Account created! Check your email to verify your account.' }
}

export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  revalidatePath('/', 'layout')
  redirect('/login')
}

export async function signInWithGoogle() {
  const supabase = await createClient()

  // For OAuth, we need to create a callback route, but Supabase Handles redirect URLs
  // This must be called from the client component directly, but doing it from Server Action 
  // requires returning the provider URL and redirecting from client, or redirecting from here.
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/auth/callback`,
    },
  })

  if (error) {
    return { error: error.message }
  }

  if (data.url) {
    redirect(data.url) // redirect to Google auth page
  }
}

export async function updateProfile(fullName: string) {
  const supabase = await createClient()
  
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  if (userError || !user) {
    return { error: 'Not authenticated' }
  }

  // Update profile record
  const { error } = await supabase
    .from('profiles')
    .update({ full_name: fullName })
    .eq('id', user.id)

  if (error) {
    return { error: error.message }
  }

  // Also update user metadata
  await supabase.auth.updateUser({
    data: { full_name: fullName }
  })

  revalidatePath('/account')
  return { success: true }
}

export async function updatePassword(password: string) {
  if (!password || password.length < 6) {
    return { error: 'Password must be at least 6 characters' }
  }

  const supabase = await createClient()
  
  const { error } = await supabase.auth.updateUser({
    password: password
  })

  if (error) {
    return { error: error.message }
  }

  return { success: true }
}
