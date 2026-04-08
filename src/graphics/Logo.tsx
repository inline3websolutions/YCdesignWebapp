import React from 'react'
import { Logo as YCLogo } from '@/components/yc'

/**
 * Full YCDesign logo for the Payload admin login page.
 * Reuses the unified navbar logo component directly.
 */
const Logo: React.FC = () => {
  return (
    <div style={{ maxWidth: '250px', width: '100%', display: 'flex', justifyContent: 'center' }}>
      <YCLogo className="w-full h-auto text-black dark:text-white" />
    </div>
  )
}

export default Logo
