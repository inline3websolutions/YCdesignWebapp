# PAYLOAD CMS COMPLETE DOCUMENTATION

**Compiled from Official Payload CMS Documentation**  
Date: November 19, 2025

---

## TABLE OF CONTENTS

1. [Introduction & Overview](#introduction--overview)
2. [Getting Started](#getting-started)
3. [Configuration](#configuration)
4. [Collections](#collections)
5. [Globals](#globals)
6. [Fields](#fields)
7. [Admin Panel](#admin-panel)
8. [Authentication](#authentication)
9. [Access Control](#access-control)
10. [Uploads](#uploads)
11. [Hooks](#hooks)
12. [Queries & Operations](#queries--operations)
13. [APIs](#apis)
14. [Database & Migrations](#database--migrations)
15. [Localization](#localization)
16. [Plugins & Custom Components](#plugins--custom-components)
17. [Relationships](#relationships)
18. [Best Practices](#best-practices)

---

## Introduction & Overview

### What is Payload?

Payload is a next-gen application framework that can be used as a Content Management System, enterprise tool framework, headless commerce platform, and more. It is a config-based, code-first CMS and application framework built with TypeScript and React.

**Key Features:**

- A full Admin Panel using React server/client components, matching the shape of your data and completely extensible with your own React components
- Automatic database schema, including direct DB access and ownership, with migrations, transactions, proper indexing, and more
- Instant REST, GraphQL, and straight-to-DB Node.js APIs
- Authentication which can be used in your own apps
- A deeply customizable access control pattern
- File storage and image management tools like cropping/focal point selection
- Live preview - see your frontend render content changes in realtime as you update
- Lots more

### Payload Concepts

Payload is based around a small and intuitive set of concepts:

**Collections:** Collections are the primary way to define your data structures. Collections can be thought of as "types" of documents that you will be managing. Each Collection corresponds to a database table/collection.

**Globals:** Globals are in many ways similar to Collections, except they correspond to only a single Document. Each Global is stored in the Database based on the Fields that you define.

**Fields:** Fields are the building blocks of Payload. They define the schema of the Documents that will be stored in the Database, as well as automatically generate the corresponding UI within the Admin Panel.

---

## Getting Started

### Installation

#### Step 1: Install Payload in your Next.js app

For projects using the `/app` folder structure, you should organize your files appropriately.

#### Step 2: Create the (payload) directory structure

In your `/app` folder, you should have something like this:

```
app
├─ (payload)
├── admin
├─── [[...segments]]
├──── page.tsx
├──── not-found.tsx
├── api
├─── [...slug]
├──── route.ts
├── graphql
├──── route.ts
├── graphql-playground
├──── route.ts
├── custom.scss
├── layout.tsx
```

You may need to copy all of your existing frontend files, including your existing root layout, into its own newly created Route Group.

#### Step 3: Create a Payload Config

Generally the Payload Config is located at the root of your repository, or next to your `/app` folder, and is named `payload.config.ts`.

---

## Configuration

### The Payload Config

The Payload Config is central to everything that Payload does, allowing for deep configuration of your application through a simple and intuitive API. The Payload Config is a fully-typed JavaScript object that can be infinitely extended upon.

Everything from your Database choice to the appearance of the Admin Panel is fully controlled through the Payload Config. From here you can define Fields, add Localization, enable Authentication, configure Access Control, and so much more.

**Simple Example:**

```typescript
import { buildConfig } from 'payload'
import { mongooseAdapter } from '@payloadcms/db-mongodb'

export default buildConfig({
  secret: process.env.PAYLOAD_SECRET,
  db: mongooseAdapter({
    url: process.env.DATABASE_URI,
  }),
  collections: [
    {
      slug: 'pages',
      fields: [
        {
          name: 'title',
          type: 'text',
        },
      ],
    },
  ],
})
```

### Configuration Options

| Option | Description |
|--------|-------------|
| admin | Configuration options for the Admin Panel, including Custom Components, Live Preview, etc. |
| bin | Register custom bin scripts for Payload to execute |
| editor | The Rich Text Editor which will be used by rich-text fields |
| db | The Database Adapter which will be used by Payload |
| serverURL | A string used to define the absolute URL of your app, including the protocol |
| collections | An array of Collections for Payload to manage |
| cors | Cross-origin resource sharing (CORS) configuration |
| globals | An array of Globals for Payload to manage |
| hooks | An array of Root Hooks |
| plugins | An array of Plugins |
| endpoints | An array of Custom Endpoints added to the Payload router |
| custom | Extension point for adding custom data (e.g. for plugins) |
| i18n | Internationalization configuration |

---

## Collections

### Collection Configs

Collections are the primary way to organize documents in Payload. Each Collection Config defines a document type that can be created, read, updated, and deleted.

**Key Configuration Options:**

| Option | Description |
|--------|-------------|
| slug | Unique, URL-friendly string to identify this Collection |
| fields | Array of fields that define the schema |
| access | Object containing access control functions |
| admin | Admin-specific configuration |
| hooks | Entry point for Hooks |
| auth | Enable authentication on this collection |
| upload | Enable file upload capabilities |
| versions | Enable versioning for documents |
| timestamps | Automatically add createdAt and updatedAt fields |
| labels | Singular and plural labels for use in UI |
| defaultSort | Default field to sort by in List View |
| disableDuplicate | When true, hide the "Duplicate" button |
| custom | Extension point for custom data |

### Admin Options

The behavior of Collections within the Admin Panel can be fully customized:

| Option | Description |
|--------|-------------|
| group | Text used to group Collection links in navigation |
| hidden | Set to true or function to exclude from navigation |
| useAsTitle | Field to use as document title in Admin Panel |
| description | Text displayed below Collection label |
| defaultColumns | Array of field names to show in List View |
| pagination | Configure pagination behavior |
| listSearchableFields | Define which fields are searchable |
| formatDocURL | Function to customize document links |
| preview | Generate preview URLs for your app |

### Pagination

All Collections receive their own List View with configurable pagination:

| Option | Description |
|--------|-------------|
| defaultLimit | Default per-page limit (defaults to 10) |
| limits | Array of integers for per-page options |

### Example Collection

```typescript
import type { CollectionConfig } from 'payload'

const Posts: CollectionConfig = {
  slug: 'posts',
  admin: {
    useAsTitle: 'title',
    group: 'Content',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'content',
      type: 'richText',
      required: true,
    },
    {
      name: 'publishedDate',
      type: 'date',
      required: true,
    },
    {
      name: 'author',
      type: 'relationship',
      relationTo: 'users',
      required: true,
    },
  ],
  timestamps: true,
}

export default Posts
```

---

## Globals

Globals are in many ways similar to Collections, except they correspond to only a single Document. Each Global is stored in the Database based on the Fields that you define.

### Creating a Global

```typescript
import type { GlobalConfig } from 'payload'

const Header: GlobalConfig = {
  slug: 'header',
  fields: [
    {
      name: 'headerLinks',
      type: 'array',
      minRows: 1,
      maxRows: 5,
      fields: [
        {
          name: 'name',
          type: 'text',
        },
        {
          name: 'destination',
          type: 'relationship',
          relationTo: 'pages',
        },
        {
          name: 'newTab',
          type: 'checkbox',
        },
      ],
    },
  ],
}

export default Header
```

### Global vs Collection

| Aspect | Global | Collection |
|--------|--------|-----------|
| Number of documents | Single document | Multiple documents |
| Access control | Only `read` and `update` | Full CRUD operations |
| Complexity | Simpler | More complex |
| Use cases | Site-wide settings, navigation | Posts, products, users |

---

## Fields

### Fields Overview

Fields are the building blocks of Payload. They define the schema of the Documents that will be stored in the Database, as well as automatically generate the corresponding UI within the Admin Panel.

There are many Field Types to choose from, ranging anywhere from simple text strings to nested arrays and blocks. Most fields save data to the database, while others are strictly presentational.

### Data Fields

Data Fields are used to store data in the database:

- **Array** - for repeating content, supports nested fields
- **Blocks** - for block-based content, supports nested fields
- **Checkbox** - saves boolean true/false values
- **Code** - renders a code editor interface that saves a string
- **Date** - renders a date picker and saves a timestamp
- **Email** - ensures the value is a properly formatted email address
- **JSON** - stores JSON data
- **Number** - saves numeric values
- **Point** - stores geographic coordinates
- **Radio** - saves a single option from predefined choices
- **Relationship** - relates documents together
- **Rich Text** - stores formatted text content
- **Select** - saves one or more options from predefined choices
- **Text** - stores simple text strings
- **Textarea** - stores multi-line text
- **Upload** - relates to upload-enabled collections

### Presentational Fields

Presentational Fields do not store data in the database. Instead, they are used to organize and present other fields in the Admin Panel:

- **Collapsible** - nests fields within a collapsible component
- **Row** - aligns fields horizontally
- **Tabs (Unnamed)** - nests fields within a tabbed layout
- **Group (Unnamed)** - nests fields within a keyed object
- **UI** - blank field for custom UI components

### Field Options

All fields require at least the `type` property. Common options include:

| Option | Description |
|--------|-------------|
| name | Property name when stored/retrieved from database |
| type | Determines field appearance and behavior |
| label | Field label in Admin Panel |
| required | Make field mandatory |
| unique | Enforce unique values |
| index | Build database index for faster queries |
| access | Field-level access control |
| hooks | Field-level hooks |
| validate | Custom validation function |
| admin | Admin-specific configuration |
| localized | Enable field localization |
| conditional | Show/hide based on other fields |

### Example Field Configuration

```typescript
{
  name: 'email',
  type: 'email',
  required: true,
  unique: true,
  index: true,
  label: 'Email Address',
  admin: {
    placeholder: 'user@example.com',
  },
}
```

### Field Descriptions

Field Descriptions provide additional information to editors:

```typescript
{
  name: 'title',
  type: 'text',
  label: 'Post Title',
  description: 'The main title of your blog post. Keep it under 60 characters for SEO.',
}
```

### Custom Components

Fields can be fully customized with Custom Components:

| Component | Description |
|-----------|-------------|
| Field | The form field rendered in Edit View |
| Cell | The table cell rendered in List View |
| Filter | The filter component in List View |
| Label | Override the default Label |
| Error | Override the default Error component |
| Description | Override the default Description |
| BeforeInput | Elements added before the input |
| AfterInput | Elements added after the input |

---

## Admin Panel

### The Admin Panel

Payload dynamically generates a beautiful, fully type-safe Admin Panel to manage your users and data. It is highly performant, even with 100+ fields, and is translated in over 30 languages.

### Project Structure

The Admin Panel serves as the entire HTTP layer for Payload, providing a full CRUD interface. Both the REST and GraphQL APIs are Next.js Routes that exist alongside your front-end application.

All Payload routes are nested within the `(payload)` route group, creating a boundary between the Admin Panel and the rest of your application.

### Admin-level Routes

Admin-level routes are behind the `/admin` path:

| Route | Default Path | Description |
|-------|--------------|-------------|
| account | /admin/account | User's account page |
| createFirstUser | /admin/create-first-user | Page to create first user |
| inactivity | /admin/inactivity | Redirect after inactivity |
| login | /admin/login | Login page |
| logout | /admin/logout | Logout page |
| reset | /admin/reset | Password reset page |
| unauthorized | /admin/unauthorized | Unauthorized page |

### Root Components

Root Components allow you to inject Custom Components into various parts of the Admin Panel:

| Path | Description |
|------|-------------|
| settingsMenu | Components in popup menu (gear icon) |
| Nav | Complete sidebar/mobile menu replacement |
| beforeDashboard | Components before Dashboard |
| afterDashboard | Components after Dashboard |
| beforeLogin | Components before Login |
| afterLogin | Components after Login |
| beforeNavLinks | Components before Nav links |
| afterNavLinks | Components after Nav links |
| graphics.Logo | Full logo for contexts like Nav |
| graphics.Icon | Simplified logo for Nav |

### Customizing Views

Views can be fully customized or replaced:

**Root Views:**
- Dashboard
- Account
- Custom views

**Collection Views:**
- List View
- Edit View (with nested Document Views)
- Custom views

**Global Views:**
- Edit View (with nested Document Views)
- Custom views

---

## Authentication

### Authentication Overview

Payload provides highly secure user Authentication out of the box. You can fully customize, override, or remove the default Authentication support.

Any Collection can opt-in to supporting Authentication. Once enabled, each Document within the Collection becomes a "user" with complete authentication workflow including logging in/out, resetting passwords, and more.

### Enabling Authentication

```typescript
import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  auth: true,
  fields: [
    {
      name: 'email',
      type: 'email',
      required: true,
    },
    {
      name: 'role',
      type: 'select',
      options: [
        { label: 'Admin', value: 'admin' },
        { label: 'Editor', value: 'editor' },
        { label: 'Viewer', value: 'viewer' },
      ],
    },
  ],
}
```

### Authentication Options

| Option | Description |
|--------|-------------|
| cookies | Set cookie options, including secure, sameSite, domain |
| depth | How many levels deep a user document is populated |
| disableLocalStrategy | Disable Payload's built-in local auth strategy |
| forgotPassword | Customize the way forgot-password functionality works |
| lockTime | Time (in ms) a user should be locked out after failed attempts |
| loginWithUsername | Allow users to login with username field |
| maxLoginAttempts | Maximum failed login attempts before lockout |
| removeTokenFromResponses | Remove token from API responses |
| tokenExpiration | How long auth tokens stay valid |
| useAPIKey | Enable API keys for authentication |
| verify | Enable email verification |

### JSON Web Tokens

JWT (JSON Web Tokens) are utilized to perform authentication. Tokens are generated on `login`, `refresh`, and `me` operations and can be attached to future requests.

### API Keys

API Keys can be enabled on auth collections. These are particularly useful when authenticating from third-party services.

```typescript
auth: {
  useAPIKey: true,
}
```

---

## Access Control

### Access Control Overview

Payload makes it simple to define and manage Access Control. By declaring roles, you can set permissions and restrict what your users can interact with.

Access Control functions are scoped to the operation, meaning you can have different rules for `create`, `read`, `update`, `delete`, etc. Access Control functions are executed before any changes are made.

### Default Access Control

Payload provides default Access Control that secures your data behind Authentication:

```typescript
const defaultPayloadAccess = ({ req: { user } }) => {
  // Return `true` if a user is found
  // and `false` if it is undefined or null
  return Boolean(user)
}
```

### Collection-level Access Control

Access Control can be configured at the Collection level:

| Function | Purpose |
|----------|---------|
| create | Control who can create documents |
| read | Control who can read documents |
| update | Control who can update documents |
| delete | Control who can delete documents |
| admin | Control who can access the Admin Panel |

```typescript
const Posts: CollectionConfig = {
  slug: 'posts',
  access: {
    create: ({ req: { user } }) => Boolean(user),
    read: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) => user?.role === 'admin',
    delete: ({ req: { user } }) => user?.role === 'admin',
  },
  fields: [],
}
```

### Field-level Access Control

Access Control can also be configured at the Field level:

| Function | Purpose |
|----------|---------|
| create | Control ability to set field value on create |
| read | Control ability to read field value |
| update | Control ability to update field value |

```typescript
{
  name: 'internalNotes',
  type: 'textarea',
  access: {
    create: ({ req: { user } }) => user?.role === 'admin',
    read: ({ req: { user } }) => user?.role === 'admin',
    update: ({ req: { user } }) => user?.role === 'admin',
  },
}
```

### Access Control Functions

Access Control functions receive arguments:

| Argument | Description |
|----------|-------------|
| req | Request object containing authenticated user |
| id | ID of document being accessed (if applicable) |
| data | Data being created/updated (if applicable) |
| siblingData | Data of sibling fields |

### Locale Specific Access Control

You can implement locale-specific access control using `req.locale`:

```typescript
const access = ({ req }) => {
  if (req.locale === 'en') {
    return true
  }
  return false
}
```

---

## Uploads

### Uploads Overview

Payload provides everything you need to enable file upload, storage, and management directly on your server—including extremely powerful file access control.

### Enabling Uploads

To enable uploads on a Collection, set the `upload` property:

```typescript
import type { CollectionConfig } from 'payload'

const Media: CollectionConfig = {
  slug: 'media',
  upload: {
    staticDir: 'media',
    imageSizes: [
      {
        name: 'thumbnail',
        width: 400,
        height: 300,
        position: 'centre',
      },
      {
        name: 'card',
        width: 768,
        height: 1024,
        position: 'centre',
      },
    ],
    adminThumbnail: 'thumbnail',
    mimeTypes: ['image/*'],
  },
  fields: [],
}
```

### Upload Options

| Option | Description |
|--------|-------------|
| staticDir | Path to directory for file storage |
| imageSizes | Array of image sizes to generate |
| adminThumbnail | Which image size to use in Admin Panel |
| mimeTypes | Array of accepted MIME types |
| disableLocalStorage | Disable local file storage |
| crop | Enable image cropping |
| focalPoint | Enable focal point selection |
| formatOptions | Image format options |
| resizeOptions | Image resize options |
| withMetadata | Preserve image metadata |
| handlers | Custom request handlers for file fetching |
| pasteURL | Configure URL pasting behavior |

### Upload Field

The Upload Field allows selection of a Document from an Upload-enabled Collection:

| Option | Description |
|--------|-------------|
| name | Property name when stored/retrieved |
| relationTo | Single collection slug |
| filterOptions | Query to filter which options appear |
| hasMany | Allow multiple relations |
| maxRows | Maximum items when hasMany is true |
| minRows | Minimum items when hasMany is true |

---

## Hooks

### Hooks Overview

Hooks allow you to execute your own logic during specific events of the Document lifecycle. There are Collection Hooks, Global Hooks, and Field Hooks.

### Collection Hooks

Collection Hooks run on Documents at the Collection level:

- **beforeValidate** - Runs during create and update operations before validation
- **beforeChange** - Runs after validation, before document is saved
- **afterChange** - Runs after document is saved
- **beforeRead** - Runs before document is read
- **afterRead** - Runs after document is read
- **beforeDelete** - Runs before document is deleted
- **afterDelete** - Runs after document is deleted
- **beforeOperation** - Runs before any operation
- **afterOperation** - Runs after any operation

### Field Hooks

Field Hooks run on Documents on a per-field basis:

- **beforeValidate** - Add or format data before validation
- **beforeChange** - Immediately following validation
- **afterRead** - Transform data after reading from database

### Hook Arguments

Hooks receive various arguments:

| Argument | Description |
|----------|-------------|
| collection | Collection slug where hook is running |
| context | Additional context object |
| data | Incoming data |
| operation | Name of operation (create, update, etc.) |
| originalDoc | Original document before changes |
| req | Request object with user, payload, etc. |
| value | Current value of field (field hooks) |

### Example Hooks

```typescript
// Collection hook example
const Posts: CollectionConfig = {
  slug: 'posts',
  hooks: {
    beforeChange: [
      async ({ data, req }) => {
        // Add current user as author if not already set
        if (!data.author) {
          data.author = req.user?.id
        }
        return data
      },
    ],
    afterChange: [
      async ({ doc, req }) => {
        console.log(`Post "${doc.title}" was saved`)
      },
    ],
  },
  fields: [],
}

// Field hook example
{
  name: 'slug',
  type: 'text',
  hooks: {
    beforeValidate: [
      async ({ value }) => {
        return value?.toLowerCase().replace(/\s+/g, '-')
      },
    ],
  },
}
```

---

## Queries & Operations

### Querying Documents

Payload provides a querying language through all APIs, allowing you to filter or search through documents within a Collection.

### Query Operators

Payload supports various query operators:

**Comparison:**
- equals
- not_equals
- greater_than
- greater_than_equal
- less_than
- less_than_equal
- like
- contains
- in
- not_in
- all
- exists

**Logical:**
- and
- or

### Example Queries

```javascript
// Simple query
const results = await payload.find({
  collection: 'posts',
  where: {
    status: {
      equals: 'published',
    },
  },
})

// Complex query with AND/OR
const results = await payload.find({
  collection: 'posts',
  where: {
    and: [
      {
        title: {
          like: 'Hello',
        },
      },
      {
        status: {
          equals: 'published',
        },
      },
    ],
  },
})

// Filtering with relationships
const results = await payload.find({
  collection: 'posts',
  where: {
    author: {
      equals: authorId,
    },
  },
})
```

---

## APIs

### REST API

The REST API is a fully functional HTTP client that allows you to interact with your Documents in a RESTful manner. It supports all CRUD operations.

By default, the REST API is exposed via `/api`, but you can customize this URL.

**Basic REST Endpoints:**

```
GET    /api/collection-name              # List all documents
GET    /api/collection-name/:id          # Get single document
POST   /api/collection-name              # Create document
PATCH  /api/collection-name/:id          # Update document
DELETE /api/collection-name/:id          # Delete document
```

### GraphQL API

Payload ships with a fully featured and extensible GraphQL API. By default, it's exposed via `/api/graphql`.

**Automatic Queries:**
- Find documents
- Find by ID
- Count documents
- Access permissions

**Automatic Mutations:**
- Create
- Update
- Delete
- Login
- Logout
- Refresh token
- Forgot password
- Reset password
- Verify user
- Unlock user

### GraphQL Options

| Option | Description |
|--------|-------------|
| mutations | Custom Mutations to add |
| queries | Custom Queries to add |
| maxComplexity | Maximum allowed query complexity |
| disablePlaygroundInProduction | Disable GraphQL playground in production |

### Local API

The Local API gives you the ability to execute the same operations that are available through REST and GraphQL within Node, directly on your server.

**Available Operations:**
- find
- findByID
- create
- update
- updateByID
- delete
- deleteByID
- login
- logout
- refresh
- forgotPassword
- resetPassword
- unlock
- verifyEmail

**Example:**

```typescript
const page = await payload.create({
  collection: 'pages',
  data: {
    title: 'My Page',
    content: 'Page content',
  },
  user: dummyUserDoc,
  overrideAccess: true,
})

const posts = await payload.find({
  collection: 'posts',
  where: {
    status: { equals: 'published' },
  },
})

const post = await payload.findByID({
  collection: 'posts',
  id: 'postId123',
})
```

---

## Database & Migrations

### Database Overview

Payload is designed to interact with your database through a Database Adapter, which is a thin layer that translates Payload's internal data structures into database-specific operations.

### Database Adapters

- **MongoDB** - Using Mongoose
- **PostgreSQL** - Using Drizzle ORM
- **SQLite** - Using Drizzle ORM

### Migrations

Migrations allow you to manage database schema changes in a controlled way.

### Migration Commands

```bash
# Create a new migration
payload migrate:create

# Run pending migrations
payload migrate

# Check migration status
payload migrate:status

# Rollback migrations
payload migrate:down

# Rollback and re-run migrations
payload migrate:refresh
```

### Migration Example

```typescript
import { MigrateUpArgs, MigrateDownArgs } from '@payloadcms/your-db-adapter'

export async function up({ payload, req }: MigrateUpArgs): Promise<void> {
  // Perform changes to your database here
  await payload.db.query('ALTER TABLE posts ADD COLUMN featured BOOLEAN')
}

export async function down({ payload, req }: MigrateDownArgs): Promise<void> {
  // Revert changes if the up function fails
  await payload.db.query('ALTER TABLE posts DROP COLUMN featured')
}
```

### Using Transactions

When migrations are run, each migration is performed in a new transaction. Pass the `req` object to any Local API or direct database calls to make changes inside the transaction.

### PostgreSQL Workflow

1. **Work locally using push mode** - Drizzle automatically syncs changes in development
2. **Create a migration** - Run `payload migrate:create` when ready
3. **Set up build process** - Run migrations before building for production

### Transactions

Database transactions allow your application to make a series of database changes in an all-or-nothing commit. Payload uses transactions for all data changing operations by default.

**Transaction Methods:**
- `payload.db.beginTransaction` - Start a new transaction
- `payload.db.commitTransaction` - Finalize changes
- `payload.db.rollbackTransaction` - Discard changes

---

## Localization

### Localization Overview

With Localization, you can serve personalized content to your users based on their specific language preferences. There are no limits to the number of locales you can add to your Payload project.

### Enabling Localization

```typescript
import { buildConfig } from 'payload'

export default buildConfig({
  localization: {
    locales: ['en', 'es', 'de'],
    defaultLocale: 'en',
    fallback: true,
  },
  collections: [],
  globals: [],
})
```

### Config Options

| Option | Description |
|--------|-------------|
| locales | Array of locale codes to support |
| defaultLocale | Default locale for the application |
| fallback | Whether to fallback to default locale |

### Field Localization

Payload Localization works on a field level—not a document level. Specify which fields should be localized:

```typescript
{
  name: 'title',
  type: 'text',
  localized: true,
}
```

### Retrieving Localized Documents

When retrieving documents, specify which locale you'd like to receive:

```typescript
const page = await payload.findByID({
  collection: 'pages',
  id: '123',
  locale: 'es',
  fallbackLocale: 'en',
})
```

---

## Plugins & Custom Components

### Plugins

Plugins extend Payload's functionality. They can:

- Add custom fields
- Add custom collections or globals
- Add custom hooks
- Modify the Payload Config
- Add custom endpoints or GraphQL queries/mutations
- Integrate with third-party services

### Official Plugins

Payload maintains a set of official plugins including:

- SEO Plugin
- Nested Docs Plugin
- Redirects Plugin
- Search Plugin
- Form Builder Plugin
- Cloud Storage Plugin

### Creating a Plugin

```typescript
import { Config } from 'payload'

export const myPlugin = (options: PluginOptions) => (config: Config) => {
  return {
    ...config,
    // Modify config here
  }
}
```

### Custom Components

Payload supports Custom Components throughout the application:

**Field Components:**
- Custom Field
- Custom Cell
- Custom Filter
- Custom Label
- Custom Error
- Custom Description

**View Components:**
- Custom Dashboard
- Custom Edit View
- Custom List View
- Custom Login View

### Building Custom Components

Custom Components receive props including:

- path - Path to the field
- value - Current value
- readOnly - Whether field is read-only
- validate - Validation function
- user - Currently authenticated user

**Example Custom Field Component:**

```typescript
'use client'
import { useField } from '@payloadcms/ui'

export const CustomField = ({ path }) => {
  const { value, setValue } = useField({ path })
  
  return (
    <input
      value={value || ''}
      onChange={(e) => setValue(e.target.value)}
      placeholder="Enter value..."
    />
  )
}
```

---

## Relationships

### Relationship Field

The Relationship field provides the ability to relate documents together. It allows you to:

- Relate to one or multiple collections
- Have one or many relationships
- Filter available options
- Set minimum and maximum items
- Configure depth of population

**Example:**

```typescript
{
  name: 'author',
  type: 'relationship',
  relationTo: 'users',
  required: true,
}
```

**Multiple Relations:**

```typescript
{
  name: 'authors',
  type: 'relationship',
  relationTo: 'users',
  hasMany: true,
  minRows: 1,
  maxRows: 5,
}
```

**Polymorphic Relations:**

```typescript
{
  name: 'relatedContent',
  type: 'relationship',
  relationTo: ['posts', 'pages', 'media'],
}
```

### Relationship Options

| Option | Description |
|--------|-------------|
| relationTo | Collection(s) to relate to |
| hasMany | Allow multiple relationships |
| minRows | Minimum items required |
| maxRows | Maximum items allowed |
| filterOptions | Query to filter available options |
| depth | How deep to populate relationships |

### Bi-directional Relationships

Use the `join` field in the related collection to create bi-directional relationships, allowing you to see where documents are being used.

```typescript
// In Posts collection
{
  name: 'author',
  type: 'relationship',
  relationTo: 'users',
}

// In Users collection
{
  name: 'posts',
  type: 'relationship',
  relationTo: 'posts',
  hasMany: true,
}
```

---

## Authentication Operations

### Available Operations

Enabling Authentication on a Collection automatically exposes additional auth-based operations:

- **Login** - Accepts email/username and password, returns user and token
- **Logout** - Removes authentication token
- **Refresh Token** - Refreshes the authentication token
- **Forgot Password** - Initiates password reset flow
- **Reset Password** - Completes password reset
- **Verify by Email** - Verifies user email address
- **Unlock** - Unlocks a locked user account
- **Access** - Check what user can access

### Access Operation

The Access Operation returns a reflection of what the currently authenticated user can do:

```typescript
{
  canAccessAdmin: true,
  collections: {
    pages: {
      create: { permission: true },
      read: { permission: true },
      update: { permission: true },
      delete: { permission: true },
      fields: {
        title: {
          create: { permission: true },
          read: { permission: true },
          update: { permission: true },
        }
      }
    }
  }
}
```

---

## Best Practices

### Performance Optimization

1. **Index Fields** - Add indexes to fields that are frequently queried
2. **Limit Depth** - Control relationship population depth to avoid over-fetching
3. **Use Projections** - Only query fields you need, not entire documents
4. **Optimize Images** - Configure appropriate image sizes for different use cases
5. **Cache Static Assets** - Use CDN for uploaded files to improve load times
6. **Pagination** - Always paginate large result sets
7. **Database Indexes** - Create indexes on frequently filtered fields

### Security Best Practices

1. **Use Environment Variables** - Never hardcode secrets in code
2. **Implement Proper Access Control** - Define granular permissions at collection and field levels
3. **Enable CSRF Protection** - Use built-in CSRF protection middleware
4. **Sanitize User Input** - Validate all incoming data on server-side
5. **Use HTTPS** - Always use secure connections in production
6. **Rotate Secrets** - Regularly rotate API keys and secrets
7. **Log Security Events** - Monitor and log authentication and authorization events

### Development Workflow

1. **Use TypeScript** - Take advantage of full type safety throughout your project
2. **Version Control Migrations** - Commit migration files to version control
3. **Test Access Control** - Thoroughly test permissions before deployment
4. **Document Custom Components** - Maintain clear documentation for team members
5. **Use Environment-specific Configs** - Separate development and production settings
6. **Code Review** - Review access control and hook implementations carefully
7. **Automated Testing** - Write tests for critical access control logic

### Admin Panel Customization

1. **Custom Components** - Create reusable component library for consistency
2. **Organize Navigation** - Group related collections logically
3. **Set Appropriate Titles** - Use useAsTitle for better document identification
4. **Configure List Views** - Show only relevant columns in List Views
5. **Add Descriptions** - Help editors understand complex fields
6. **Use Visual Hierarchy** - Group related fields with collapsibles and tabs
7. **Implement Conditional Fields** - Hide fields that aren't relevant based on document state

### Database Best Practices

1. **Choose Appropriate Adapter** - Select the best database for your use case
2. **Plan Schema** - Think through relationships and data structure early
3. **Create Migrations** - Always create migrations for schema changes
4. **Use Transactions** - Wrap multi-step operations in transactions
5. **Monitor Performance** - Track slow queries and optimize indexes
6. **Backup Regularly** - Implement automated database backups
7. **Test Migrations** - Test migrations in staging before production

---

## Conclusion

This document provides a comprehensive overview of Payload CMS documentation covering all major topics including:

- Configuration and setup
- Collections and Globals
- Fields and validation
- Authentication and Access Control
- File uploads and management
- Hooks and lifecycle events
- REST, GraphQL, and Local APIs
- Database adapters and migrations
- Localization support
- Plugins and custom components
- Relationships and transactions

For the most up-to-date information, always refer to the official Payload CMS documentation at https://payloadcms.com/docs

---

## Additional Resources

- **Official Documentation:** https://payloadcms.com/docs
- **GitHub Repository:** https://github.com/payloadcms/payload
- **Discord Community:** Join the Payload Discord for community support
- **Examples & Templates:** Check the Payload repository for examples
- **Blog & Tutorials:** https://payloadcms.com/blog
- **Payload Templates:** Pre-built project templates for common use cases

---

## Version Information

This documentation compilation is based on **Payload CMS version 3.x** and was compiled on **November 19, 2025**. Always check the official documentation for the latest updates and changes.

### Change Log & Updates

When upgrading Payload versions, check the official migration guide for breaking changes and new features.

---

**Last Updated:** November 19, 2025  
**Compiled for:** Payload CMS v3.x  
**Format:** Markdown (.md)