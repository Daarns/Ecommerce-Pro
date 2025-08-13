'use client'
import { useState } from 'react'
import { ProfileForm } from './ProfileForm'
import { AddressBook } from './AddressBook'
import { OrderHistory } from '@/app/orders/components/OrderHistory'
import { Heart } from 'lucide-react'
import Link from 'next/link'

export function UserDashboard() {
  const [tab, setTab] = useState('orders')

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">My Account</h1>
      <div className="flex gap-4 mb-8 border-b border-border">
        <button className={`py-2 px-4 font-medium ${tab === 'orders' ? 'border-b-2 border-primary text-primary' : 'text-text-secondary'}`} onClick={() => setTab('orders')}>Order History</button>
        <button className={`py-2 px-4 font-medium ${tab === 'profile' ? 'border-b-2 border-primary text-primary' : 'text-text-secondary'}`} onClick={() => setTab('profile')}>Profile</button>
        <button className={`py-2 px-4 font-medium ${tab === 'addresses' ? 'border-b-2 border-primary text-primary' : 'text-text-secondary'}`} onClick={() => setTab('addresses')}>Addresses</button>
        <Link href="/wishlist" className="py-2 px-4 font-medium flex items-center gap-2 text-text-secondary hover:text-primary">
          <Heart className="w-4 h-4" /> Wishlist
        </Link>
      </div>
      {tab === 'orders' && <OrderHistory compact showBreadcrumb={false} />}
      {tab === 'profile' && <ProfileForm />}
      {tab === 'addresses' && <AddressBook />}
    </div>
  )
}