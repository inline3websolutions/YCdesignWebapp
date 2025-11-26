import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const { name, email, phone, subject, bikeInterest, message } = body

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { success: false, message: 'Please fill in all required fields' },
        { status: 400 },
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, message: 'Please enter a valid email address' },
        { status: 400 },
      )
    }

    const payload = await getPayload({ config: configPromise })

    // Create the contact submission
    await payload.create({
      collection: 'contact-submissions',
      data: {
        name,
        email,
        phone: phone || undefined,
        subject,
        bikeInterest: subject === 'purchase' ? bikeInterest : undefined,
        message,
        status: 'new',
      },
    })

    return NextResponse.json(
      { success: true, message: 'Your message has been sent successfully!' },
      { status: 200 },
    )
  } catch (error) {
    console.error('Contact form error:', error)
    return NextResponse.json(
      { success: false, message: 'Something went wrong. Please try again later.' },
      { status: 500 },
    )
  }
}
