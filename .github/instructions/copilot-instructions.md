# Payload CMS Project Context

## Documentation Reference

Full documentation available in: `docs/PAYLOAD_CMS_DOCS.md`

## Common Tasks

### Authentication

- Enable on collection: Set `auth: true`
- JWT tokens: Automatically generated on login
- API Keys: Enable with `useAPIKey: true`
- See docs Section 8

### Collections

- Define in `src/collections/`
- Each needs unique `slug`
- Add fields in `fields: []` array
- See docs Section 4

### Hooks

- Collection hooks: beforeValidate, beforeChange, afterChange, beforeRead, afterRead
- Field hooks: beforeValidate, beforeChange, afterRead
- See docs Section 11

### Access Control

- Collection level: create, read, update, delete, admin
- Field level: create, read, update
- See docs Section 9

### Uploads

- Set `upload: {}` on collection
- Configure `imageSizes` for responsive images
- See docs Section 10
