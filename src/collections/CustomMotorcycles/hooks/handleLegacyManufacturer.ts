import type { CollectionAfterReadHook } from 'payload'

/**
 * This hook handles legacy manufacturer data that was stored as a string
 * instead of as a relationship to the manufacturers collection.
 *
 * It checks if the manufacturer field contains a string (legacy data)
 * and if so, stores it in manufacturerLegacy for frontend display
 * while clearing the manufacturer field to avoid MongoDB casting errors.
 */
export const handleLegacyManufacturer: CollectionAfterReadHook = async ({ doc }) => {
  if (!doc) return doc

  // If manufacturer is a string (legacy data that's NOT an ObjectId), move it to manufacturerLegacy
  if (doc.manufacturer && typeof doc.manufacturer === 'string') {
    // Check if it's a MongoDB ObjectId (24 hex characters) - this means it's a valid relationship
    const isObjectId = /^[a-f0-9]{24}$/i.test(doc.manufacturer)

    if (!isObjectId) {
      // It's legacy string data (actual manufacturer name), preserve it
      doc.manufacturerLegacy = doc.manufacturer
      doc.manufacturer = null // Clear the old string value
    }
    // If it IS an ObjectId, leave it alone - it will be populated by Payload with depth > 0
  }

  return doc
}
