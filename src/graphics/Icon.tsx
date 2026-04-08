import React from 'react'
import { Logo as YCLogo } from '@/components/yc'

/**
 * Small YCDesign icon for the Payload admin panel tab/favicon.
 * Reuses the unified navbar logo component directly.
 */
const Icon: React.FC = () => {
  return <YCLogo className="w-6 h-auto text-black dark:text-white" />
}

export default Icon
