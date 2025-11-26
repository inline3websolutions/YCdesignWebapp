import { Metadata } from 'next'
import { saleBikes } from '@/types/yc'
import SalesClient from './SalesClient'

export const metadata: Metadata = {
  title: 'For Sale | YC Design',
  description:
    'Browse our collection of restored and custom motorcycles available for purchase. Each bike is a one-of-a-kind build from YC Design.',
}

export default async function SalesPage() {
  // Currently using static data from types/yc.ts
  // This can be replaced with Payload collection fetch when a "sales" collection is added
  const bikes = saleBikes

  return <SalesClient bikes={bikes} />
}
