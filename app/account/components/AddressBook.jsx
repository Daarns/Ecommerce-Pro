'use client'
import { useState } from 'react'
import { Button } from '@/app/components/ui/Button'

export function AddressBook() {
  const [addresses, setAddresses] = useState([
    {
      id: 1,
      label: 'Home',
      name: 'John Doe',
      phone: '08123456789',
      address: 'Jl. Mawar No. 1, Jakarta',
      city: 'Jakarta',
      zip: '12345',
      country: 'Indonesia',
      isDefault: true
    }
  ])
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({
    label: '',
    name: '',
    phone: '',
    address: '',
    city: '',
    zip: '',
    country: ''
  })

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value })

  const handleAdd = e => {
    e.preventDefault()
    setAddresses([
      ...addresses,
      { ...form, id: Date.now(), isDefault: false }
    ])
    setShowForm(false)
    setForm({ label: '', name: '', phone: '', address: '', city: '', zip: '', country: '' })
  }

  const setDefault = id => setAddresses(addresses.map(addr => ({
    ...addr,
    isDefault: addr.id === id
  })))

  const removeAddress = id => setAddresses(addresses.filter(addr => addr.id !== id))

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold">My Addresses</h2>
        <Button variant="outline" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : 'Add Address'}
        </Button>
      </div>
      {showForm && (
        <form onSubmit={handleAdd} className="space-y-2 mb-6">
          <input name="label" placeholder="Label (e.g. Home, Office)" value={form.label} onChange={handleChange} className="w-full px-3 py-2 border border-border rounded-lg" required />
          <input name="name" placeholder="Recipient Name" value={form.name} onChange={handleChange} className="w-full px-3 py-2 border border-border rounded-lg" required />
          <input name="phone" placeholder="Phone" value={form.phone} onChange={handleChange} className="w-full px-3 py-2 border border-border rounded-lg" required />
          <input name="address" placeholder="Address" value={form.address} onChange={handleChange} className="w-full px-3 py-2 border border-border rounded-lg" required />
          <input name="city" placeholder="City" value={form.city} onChange={handleChange} className="w-full px-3 py-2 border border-border rounded-lg" required />
          <input name="zip" placeholder="ZIP Code" value={form.zip} onChange={handleChange} className="w-full px-3 py-2 border border-border rounded-lg" required />
          <input name="country" placeholder="Country" value={form.country} onChange={handleChange} className="w-full px-3 py-2 border border-border rounded-lg" required />
          <Button type="submit" className="bg-primary text-white">Save Address</Button>
        </form>
      )}
      <div className="space-y-4">
        {addresses.map(addr => (
          <div key={addr.id} className={`p-4 border rounded-lg ${addr.isDefault ? 'border-primary' : 'border-border'}`}>
            <div className="flex justify-between items-center">
              <div>
                <div className="font-semibold">{addr.label} {addr.isDefault && <span className="text-xs text-success ml-2">(Default)</span>}</div>
                <div className="text-sm">{addr.name} | {addr.phone}</div>
                <div className="text-sm">{addr.address}, {addr.city}, {addr.zip}, {addr.country}</div>
              </div>
              <div className="flex gap-2">
                {!addr.isDefault && (
                  <Button variant="outline" size="sm" onClick={() => setDefault(addr.id)}>Set Default</Button>
                )}
                <Button variant="outline" size="sm" onClick={() => removeAddress(addr.id)}>Remove</Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}