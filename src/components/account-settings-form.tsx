'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { updateProfile, updatePassword } from '@/app/actions/auth'
import { Loader2, CheckCircle2 } from 'lucide-react'

interface AccountSettingsFormProps {
  initialFullName: string
  email: string
}

export function AccountSettingsForm({ initialFullName, email }: AccountSettingsFormProps) {
  // Profile State
  const [fullName, setFullName] = useState(initialFullName)
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false)
  const [profileMessage, setProfileMessage] = useState<{type: 'success' | 'error', text: string} | null>(null)

  // Password State
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false)
  const [passwordMessage, setPasswordMessage] = useState<{type: 'success' | 'error', text: string} | null>(null)

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setProfileMessage(null)
    setIsUpdatingProfile(true)

    const res = await updateProfile(fullName)
    
    if (res?.error) {
      setProfileMessage({ type: 'error', text: res.error })
    } else {
      setProfileMessage({ type: 'success', text: 'Profile updated successfully!' })
      // Clear success message after 3 seconds
      setTimeout(() => setProfileMessage(null), 3000)
    }
    
    setIsUpdatingProfile(false)
  }

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setPasswordMessage(null)
    
    if (password !== confirmPassword) {
      setPasswordMessage({ type: 'error', text: 'Passwords do not match' })
      return
    }
    
    if (password.length < 6) {
      setPasswordMessage({ type: 'error', text: 'Password must be at least 6 characters' })
      return
    }

    setIsUpdatingPassword(true)

    const res = await updatePassword(password)
    
    if (res?.error) {
      setPasswordMessage({ type: 'error', text: res.error })
    } else {
      setPasswordMessage({ type: 'success', text: 'Password changed successfully!' })
      setPassword('')
      setConfirmPassword('')
      // Clear success message after 3 seconds
      setTimeout(() => setPasswordMessage(null), 3000)
    }
    
    setIsUpdatingPassword(false)
  }

  return (
    <div className="space-y-6">
      {/* General Profile Settings */}
      <Card>
        <form onSubmit={handleUpdateProfile}>
          <CardHeader>
            <CardTitle>Profile Details</CardTitle>
            <CardDescription>Update your personal information.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" value={email} disabled className="bg-muted/50" />
              <p className="text-xs text-muted-foreground">Your email address cannot be changed.</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input 
                id="fullName" 
                value={fullName} 
                onChange={(e) => setFullName(e.target.value)} 
                placeholder="John Doe" 
                required 
              />
            </div>
            {profileMessage && (
              <div className={`p-3 text-sm rounded-md flex items-center gap-2 ${
                profileMessage.type === 'success' ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 'bg-destructive/10 text-destructive border border-destructive/20'
              }`}>
                {profileMessage.type === 'success' && <CheckCircle2 className="w-4 h-4" />}
                {profileMessage.text}
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isUpdatingProfile || fullName === initialFullName}>
              {isUpdatingProfile && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Changes
            </Button>
          </CardFooter>
        </form>
      </Card>

      {/* Security / Change Password */}
      <Card>
        <form onSubmit={handleUpdatePassword}>
          <CardHeader>
            <CardTitle>Security</CardTitle>
            <CardDescription>Update your password to keep your account secure.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="newPassword">New Password</Label>
              <Input 
                id="newPassword" 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                placeholder="••••••••" 
                required 
                minLength={6}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <Input 
                id="confirmPassword" 
                type="password" 
                value={confirmPassword} 
                onChange={(e) => setConfirmPassword(e.target.value)} 
                placeholder="••••••••" 
                required 
                minLength={6}
              />
            </div>
            {passwordMessage && (
              <div className={`p-3 text-sm rounded-md flex items-center gap-2 ${
                passwordMessage.type === 'success' ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 'bg-destructive/10 text-destructive border border-destructive/20'
              }`}>
                {passwordMessage.type === 'success' && <CheckCircle2 className="w-4 h-4" />}
                {passwordMessage.text}
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button type="submit" variant="secondary" disabled={isUpdatingPassword || !password}>
              {isUpdatingPassword && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Update Password
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
