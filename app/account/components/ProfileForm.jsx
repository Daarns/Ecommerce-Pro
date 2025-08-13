'use client'
import { useState } from 'react'
import { Button } from '@/app/components/ui/Button'

export function ProfileForm() {
  const [profile, setProfile] = useState({
    name: 'John Doe',
    email: 'john@example.com',
    phone: '08123456789'
  })
  const [editing, setEditing] = useState(false)

  const handleChange = e => setProfile({ ...profile, [e.target.name]: e.target.value })

  const handleSubmit = e => {
    e.preventDefault()
    setEditing(false)
    // TODO: Save to backend or context
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-md space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Name</label>
        <input name="name" value={profile.name} onChange={handleChange} disabled={!editing}
          className="w-full px-3 py-2 border border-border rounded-lg" />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Email</label>
        <input name="email" value={profile.email} onChange={handleChange} disabled={!editing}
          className="w-full px-3 py-2 border border-border rounded-lg" />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Phone</label>
        <input name="phone" value={profile.phone} onChange={handleChange} disabled={!editing}
          className="w-full px-3 py-2 border border-border rounded-lg" />
      </div>
      <div className="flex gap-2">
        {editing ? (
          <>
            <Button type="submit" className="bg-primary text-white">Save</Button>
            <Button type="button" variant="outline" onClick={() => setEditing(false)}>Cancel</Button>
          </>
        ) : (
          <Button type="button" variant="outline" onClick={() => setEditing(true)}>Edit Profile</Button>
        )}
      </div>
    </form>
  )
}