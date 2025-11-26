/**
 * Migration Script: Migrate manufacturer text to relationship
 *
 * This script helps migrate existing motorcycle documents that have
 * manufacturer as a text field to use the new Manufacturers collection relationship.
 *
 * Usage:
 * 1. Run this script after deploying the collection changes
 * 2. It will:
 *    - Find all unique manufacturer names from existing motorcycles
 *    - Create Manufacturer documents for each unique name
 *    - Update all motorcycle documents to reference the new Manufacturer documents
 *
 * Note: Run this script once after deploying the schema changes.
 * You can run it via: npx tsx src/scripts/migrate-manufacturers.ts
 */

import { getPayload } from 'payload'
import config from '../payload.config'

async function migrateManufacturers() {
  console.log('Starting manufacturer migration...')

  const payload = await getPayload({ config })

  // Step 1: Get all unique manufacturers from restored-moto
  const restoredMotos = await payload.find({
    collection: 'restored-moto',
    limit: 1000,
    depth: 0,
  })

  // Step 2: Get all unique manufacturers from custom-motorcycles
  const customMotos = await payload.find({
    collection: 'custom-motorcycles',
    limit: 1000,
    depth: 0,
  })

  // Collect unique manufacturer names
  const manufacturerNames = new Set<string>()

  restoredMotos.docs.forEach((moto) => {
    // Handle both old string format and new relationship format
    if (typeof moto.manufacturer === 'string' && moto.manufacturer) {
      manufacturerNames.add(moto.manufacturer)
    }
  })

  customMotos.docs.forEach((moto) => {
    if (typeof moto.manufacturer === 'string' && moto.manufacturer) {
      manufacturerNames.add(moto.manufacturer)
    }
  })

  console.log(
    `Found ${manufacturerNames.size} unique manufacturers:`,
    Array.from(manufacturerNames),
  )

  // Step 3: Create Manufacturer documents (or get existing ones)
  const manufacturerMap = new Map<string, number>()

  for (const name of manufacturerNames) {
    // Check if manufacturer already exists
    const existing = await payload.find({
      collection: 'manufacturers',
      where: {
        name: {
          equals: name,
        },
      },
      limit: 1,
    })

    if (existing.docs.length > 0) {
      console.log(`Manufacturer "${name}" already exists with ID: ${existing.docs[0].id}`)
      manufacturerMap.set(name, existing.docs[0].id)
    } else {
      // Create new manufacturer
      const newManufacturer = await payload.create({
        collection: 'manufacturers',
        data: {
          name,
          slug: name
            .toLowerCase()
            .replace(/\s+/g, '-')
            .replace(/[^a-z0-9-]/g, ''),
        },
      })
      console.log(`Created manufacturer "${name}" with ID: ${newManufacturer.id}`)
      manufacturerMap.set(name, newManufacturer.id)
    }
  }

  // Step 4: Update restored-moto documents
  console.log('\nUpdating restored-moto documents...')
  for (const moto of restoredMotos.docs) {
    if (typeof moto.manufacturer === 'string' && moto.manufacturer) {
      const manufacturerId = manufacturerMap.get(moto.manufacturer)
      if (manufacturerId) {
        await payload.update({
          collection: 'restored-moto',
          id: moto.id,
          data: {
            manufacturer: manufacturerId,
          },
        })
        console.log(
          `Updated restored-moto "${moto.name}" to use manufacturer ID: ${manufacturerId}`,
        )
      }
    }
  }

  // Step 5: Update custom-motorcycles documents
  console.log('\nUpdating custom-motorcycles documents...')
  for (const moto of customMotos.docs) {
    if (typeof moto.manufacturer === 'string' && moto.manufacturer) {
      const manufacturerId = manufacturerMap.get(moto.manufacturer)
      if (manufacturerId) {
        await payload.update({
          collection: 'custom-motorcycles',
          id: moto.id,
          data: {
            manufacturer: manufacturerId,
          },
        })
        console.log(
          `Updated custom-motorcycle "${moto.name}" to use manufacturer ID: ${manufacturerId}`,
        )
      }
    }
  }

  console.log('\nMigration complete!')
  process.exit(0)
}

migrateManufacturers().catch((error) => {
  console.error('Migration failed:', error)
  process.exit(1)
})
