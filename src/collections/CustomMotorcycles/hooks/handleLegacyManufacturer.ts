import type { CollectionAfterReadHook } from 'payload'

/**
 * This hook handles legacy manufacturer data that was stored as a string
 * instead of as a relationship to the manufacturers collection.
 *
 * It checks if the manufacturer field contains a string (legacy data)
 * and if so, stores it in manufacturerLegacy for frontend display
 * while clearing the manufacturer field to avoid MongoDB casting errors.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const handleLegacyManufacturer: CollectionAfterReadHook = async ({ doc }) => {
  if (!doc) return doc

  // If manufacturer is a string (legacy data), move it to manufacturerLegacy
  if (doc.manufacturer && typeof doc.manufacturer === 'string') {
    doc.manufacturerLegacy = doc.manufacturer
    doc.manufacturer = null // Clear the old string value
  }

  return doc
}
