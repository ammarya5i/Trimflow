'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { DashboardLayout } from '@/components/dashboard-layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'

interface Customer {
  id: string
  name: string
  email: string | null
  phone: string | null
  createdAt: string
}

export default function CustomersPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { toast } = useToast()
  
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState<string | null>(null)
  const [adding, setAdding] = useState(false)
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: ''
  })

  // Redirect if not authenticated
  useEffect(() => {
    if (status === 'loading') return
    if (!session?.user) {
      router.push('/auth/signin')
      return
    }
    if (session.user.email !== 'ahmet@salonahmetbarbers.com') {
      router.push('/')
      return
    }
  }, [session, status, router])

  // Fetch customers
  useEffect(() => {
    if (session?.user) {
      fetchCustomers()
    }
  }, [session])

  const fetchCustomers = async () => {
    try {
      const response = await fetch('/api/customers')
      if (response.ok) {
        const data = await response.json()
        setCustomers(data.customers || [])
      }
    } catch (error) {
      console.error('Error fetching customers:', error)
      toast({
        title: "Error",
        description: "Failed to load customers",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleAddCustomer = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name.trim()) {
      toast({
        title: "Error",
        description: "Name is required",
        variant: "destructive",
      })
      return
    }

    setAdding(true)
    try {
      const response = await fetch('/api/customers/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          barbershopId: 'salon-ahmet-barbers-id', // Static ID for now
          name: formData.name,
          email: formData.email || null,
          phone: formData.phone || null,
        }),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        toast({
          title: "Success",
          description: "Customer added successfully",
        })
        setFormData({ name: '', email: '', phone: '' })
        fetchCustomers() // Refresh the list
      } else {
        throw new Error(data.error || 'Failed to add customer')
      }
    } catch (error) {
      console.error('Error adding customer:', error)
      toast({
        title: "Error",
        description: "Failed to add customer",
        variant: "destructive",
      })
    } finally {
      setAdding(false)
    }
  }

  const handleDeleteCustomer = async (customerId: string) => {
    if (!confirm('Are you sure you want to delete this customer?')) {
      return
    }

    setDeleting(customerId)
    try {
      const response = await fetch('/api/customers/delete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: customerId }),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        toast({
          title: "Success",
          description: "Customer deleted successfully",
        })
        setCustomers(customers.filter(c => c.id !== customerId))
      } else {
        throw new Error(data.error || 'Failed to delete customer')
      }
    } catch (error) {
      console.error('Error deleting customer:', error)
      toast({
        title: "Error",
        description: "Failed to delete customer",
        variant: "destructive",
      })
    } finally {
      setDeleting(null)
    }
  }

  if (status === 'loading' || loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading...</div>
        </div>
      </DashboardLayout>
    )
  }

  if (!session?.user) {
    return null
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Customers</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Add Customer</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddCustomer} className="space-y-3">
                <Input
                  name="name"
                  placeholder="Full name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
                <Input
                  name="email"
                  placeholder="Email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
                <Input
                  name="phone"
                  placeholder="Phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
                <Button type="submit" disabled={adding}>
                  {adding ? 'Adding...' : 'Add Customer'}
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Customers</CardTitle>
            </CardHeader>
            <CardContent>
              {customers.length === 0 ? (
                <p className="text-sm text-muted-foreground">No customers yet.</p>
              ) : (
                <div className="space-y-2">
                  {customers.map((customer) => (
                    <div key={customer.id} className="p-3 border rounded-lg flex items-center justify-between">
                      <div>
                        <div className="font-medium">{customer.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {customer.email || '—'} • {customer.phone || '—'}
                        </div>
                      </div>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteCustomer(customer.id)}
                        disabled={deleting === customer.id}
                      >
                        {deleting === customer.id ? 'Deleting...' : 'Delete'}
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}