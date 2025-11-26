import React from 'react'

// Simple gear icon - can be replaced with a more detailed SVG later
export const GearIcon = React.forwardRef<SVGSVGElement, React.SVGProps<SVGSVGElement>>(
  (props, ref) => {
    return (
      <svg
        ref={ref}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        {...props}
      >
        <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" />
        <path
          d="M12 2l1.2 2.8a7.96 7.96 0 012.5.9l2.9-1.2 1.5 2.6-2.4 1.9c.2.8.3 1.6.3 2.4 0 .8-.1 1.6-.3 2.4l2.4 1.9-1.5 2.6-2.9-1.2a7.96 7.96 0 01-2.5.9L12 22l-1.2-2.8a7.96 7.96 0 01-2.5-.9l-2.9 1.2-1.5-2.6 2.4-1.9a7.96 7.96 0 01-.3-2.4c0-.8.1-1.6.3-2.4L1.9 8.2 3.4 5.6l2.9 1.2c.8-.5 1.6-.7 2.5-.9L12 2z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
      </svg>
    )
  },
)

GearIcon.displayName = 'GearIcon'
