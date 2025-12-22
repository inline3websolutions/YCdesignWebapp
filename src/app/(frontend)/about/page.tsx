import React from 'react'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { AboutClient } from './page.client'
import { Metadata } from 'next'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function AboutPage() {
  const payload = await getPayload({ config: configPromise })
  const aboutData = await payload.findGlobal({
    slug: 'about',
    depth: 2,
  })

  return <AboutClient data={aboutData} />
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'About Us | YC Design',
    description: 'The relentless pursuit of freedom, two wheels at a time.',
  }
}
