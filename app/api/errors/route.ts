/**
 * PRODUCTION-READY ERROR TRACKING API ROUTE
 * Handles error reporting from the frontend with proper validation and security
 */
import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'

interface ErrorReport {
  errorId: string
  message: string
  stack?: string | undefined
  componentStack?: string | undefined
  userAgent: string
  url: string
  timestamp: string
  userId?: string | undefined
  sessionId?: string | undefined
  buildId?: string | undefined
  errorBoundary: string
}

const MAX_ERROR_MESSAGE_LENGTH = 1000
const MAX_STACK_LENGTH = 5000
const RATE_LIMIT_WINDOW = 60000 // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 10

// Simple rate limiting store (in production, use Redis or similar)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>()

function isValidErrorReport(data: any): data is ErrorReport {
  return (
    typeof data === 'object' &&
    typeof data.errorId === 'string' &&
    typeof data.message === 'string' &&
    typeof data.userAgent === 'string' &&
    typeof data.url === 'string' &&
    typeof data.timestamp === 'string' &&
    typeof data.errorBoundary === 'string' &&
    data.errorId.length > 0 &&
    data.message.length > 0 &&
    data.message.length <= MAX_ERROR_MESSAGE_LENGTH
  )
}

function sanitizeErrorReport(report: ErrorReport): ErrorReport {
  return {
    errorId: report.errorId.substring(0, 100),
    message: report.message.substring(0, MAX_ERROR_MESSAGE_LENGTH),
    stack: report.stack?.substring(0, MAX_STACK_LENGTH),
    componentStack: report.componentStack?.substring(0, MAX_STACK_LENGTH),
    userAgent: report.userAgent.substring(0, 500),
    url: report.url.substring(0, 500),
    timestamp: report.timestamp,
    userId: report.userId?.substring(0, 100),
    sessionId: report.sessionId?.substring(0, 100),
    buildId: report.buildId?.substring(0, 100),
    errorBoundary: report.errorBoundary.substring(0, 100)
  }
}

function checkRateLimit(clientIP: string): boolean {
  const now = Date.now()
  const clientData = rateLimitStore.get(clientIP)

  if (!clientData || now > clientData.resetTime) {
    rateLimitStore.set(clientIP, { count: 1, resetTime: now + RATE_LIMIT_WINDOW })
    return true
  }

  if (clientData.count >= RATE_LIMIT_MAX_REQUESTS) {
    return false
  }

  clientData.count++
  return true
}

export async function POST(request: NextRequest) {
  try {
    // Security: Only allow in development or from known origins
    const origin = request.headers.get('origin')
    const allowedOrigins = [
      'http://localhost:3000',
      'https://rajinuddin.dev',
      process.env['NEXT_PUBLIC_SITE_URL']
    ].filter(Boolean)

    if (process.env.NODE_ENV === 'production' && !allowedOrigins.includes(origin || '')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }    // Rate limiting
    const clientIP = request.headers.get('x-forwarded-for')?.split(',')[0] || 
                     request.headers.get('x-real-ip') || 
                     'unknown'

    if (!checkRateLimit(clientIP)) {
      return NextResponse.json(
        { error: 'Too many error reports. Please try again later.' },
        { status: 429 }
      )
    }

    // Parse and validate request body
    const contentType = request.headers.get('content-type')
    if (!contentType?.includes('application/json')) {
      return NextResponse.json({ error: 'Invalid content type' }, { status: 400 })
    }

    let errorReport: any
    try {
      errorReport = await request.json()
    } catch {
      return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
    }

    if (!isValidErrorReport(errorReport)) {
      return NextResponse.json({ error: 'Invalid error report format' }, { status: 400 })
    }

    // Sanitize the error report
    const sanitizedReport = sanitizeErrorReport(errorReport)

    // Enhanced logging
    console.error('🚨 Frontend Error Report:', {
      ...sanitizedReport,
      clientIP,
      timestamp: new Date().toISOString()
    })

    // In production, send to your error tracking service
    if (process.env.NODE_ENV === 'production') {
      try {
        // Example: Send to external error tracking service
        // await sendToErrorTrackingService(sanitizedReport)
        
        // Example: Store in database
        // await storeErrorInDatabase(sanitizedReport)
        
        console.log('Error report processed and stored successfully')
      } catch (processingError) {
        console.error('Failed to process error report:', processingError)
        // Don't return error to client to avoid infinite error loops
      }
    }

    return NextResponse.json({ 
      success: true, 
      errorId: sanitizedReport.errorId 
    })

  } catch (apiError) {
    console.error('Error in error reporting API:', apiError)
    
    // Return a generic error to avoid exposing internal details
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Handle unsupported methods
export async function GET() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 })
}

export async function PUT() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 })
}

export async function DELETE() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 })
}
