import clsx from 'clsx'
import React from 'react'
import { Logo as YCLogo } from '@/components/yc'

interface Props {
  className?: string
  loading?: 'lazy' | 'eager'
  priority?: 'auto' | 'high' | 'low'
}

export const Logo = (props: Props) => {
  const { className } = props

  return (
    <YCLogo className={clsx('max-w-[9.375rem] w-full h-auto', className)} />
  )
}
