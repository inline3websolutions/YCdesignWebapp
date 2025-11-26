import { Metadata } from 'next'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import BlogClient from './BlogClient'

export const metadata: Metadata = {
  title: 'Blog | YC Design',
  description:
    'Stories from the workshop. Read about our latest builds, restoration tips, motorcycle culture, and behind-the-scenes insights.',
}

export const revalidate = 600 // Revalidate every 10 minutes

async function getPosts() {
  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'posts',
    depth: 2,
    limit: 20,
    where: {
      _status: { equals: 'published' },
    },
    sort: '-publishedAt',
  })

  return result.docs
}

async function getCategories() {
  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'categories',
    limit: 50,
  })

  return result.docs
}

export default async function BlogPage() {
  const [posts, categories] = await Promise.all([getPosts(), getCategories()])

  return <BlogClient posts={posts} categories={categories} />
}
