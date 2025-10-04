import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

interface DirectoryPageProps {
  searchParams?: { q?: string; city?: string }
}

export default async function DirectoryPage({ searchParams }: DirectoryPageProps) {
  const q = (searchParams?.q || '').trim()
  const city = (searchParams?.city || '').trim()

  const barbershops = await prisma.barbershop.findMany({
    where: {
      isActive: true,
      AND: [
        q
          ? {
              OR: [
                { name: { contains: q, mode: 'insensitive' } },
                { description: { contains: q, mode: 'insensitive' } },
                { city: { contains: q, mode: 'insensitive' } },
              ],
            }
          : {},
        city ? { city: { contains: city, mode: 'insensitive' } } : {},
      ],
    },
    select: { id: true, name: true, slug: true, description: true, city: true, state: true },
    orderBy: { createdAt: 'desc' },
    take: 50,
  })

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Find a Barbershop</h1>
          <p className="text-muted-foreground">Search and book an appointment</p>
        </div>

        <form className="flex gap-2 mb-6" action="/s" method="get">
          <Input name="q" placeholder="Search by name, city, or service" defaultValue={q} />
          <Input name="city" placeholder="City (optional)" className="max-w-xs" defaultValue={city} />
          <Button type="submit">Search</Button>
        </form>

        {barbershops.length === 0 ? (
          <p className="text-sm text-muted-foreground">No barbershops found. Try a different search.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {barbershops.map((b) => (
              <Card key={b.id}>
                <CardHeader>
                  <CardTitle className="text-lg">{b.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-3">
                    {b.description || 'Professional barbershop'}
                  </p>
                  <div className="text-sm mb-4">{b.city}{b.state ? `, ${b.state}` : ''}</div>
                  <Button asChild className="w-full">
                    <Link href={`/s/${b.slug}`}>Book Now</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}


