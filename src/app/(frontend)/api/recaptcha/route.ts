import { NextResponse } from 'next/server'

/**
 * POST /api/recaptcha
 * Expects JSON body: { token: string }
 *
 * Environment:
 * - GOOGLE_API_KEY - your Google API key
 * - NEXT_PUBLIC_RECAPTCHA_SITE_KEY - your reCAPTCHA site key
 */

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}))
    const token = body?.token

    if (!token || typeof token !== 'string') {
      return NextResponse.json(
        { success: false, message: 'Missing or invalid token' },
        { status: 400 },
      )
    }

    const secret = process.env.GOOGLE_API_KEY
    if (!secret) {
      return NextResponse.json(
        { success: false, message: 'Google API key not configured' },
        { status: 500 },
      )
    }

    const recaptchaResponse = await fetch(
      `https://recaptchaenterprise.googleapis.com/v1/projects/onward-real-esta-1751297843955/assessments?key=${String(
        process.env.GOOGLE_API_KEY,
      )}`,
      {
        method: 'POST',
        body: JSON.stringify({
          event: {
            token: token,
            expectedAction: 'form_submit',
            siteKey: process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY,
          },
        }),
      },
    )
    const recaptchaData = await recaptchaResponse.json()

    if (
      !recaptchaData?.riskAnalysis?.score ||
      recaptchaData?.riskAnalysis?.score < 0.75 ||
      recaptchaData?.tokenProperties?.valid !== true
    ) {
      console.log('Recaptcha failed', JSON.stringify(recaptchaData, null, 2))
      return NextResponse.json({ success: false, message: 'Recaptcha failed' }, { status: 400 })
    }
    console.log('Recaptcha passed', JSON.stringify(recaptchaData, null, 2))
    return NextResponse.json({ success: true, message: 'Recaptcha passed' }, { status: 200 })
  } catch (err) {
    console.error('recaptcha verification error', err)
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 })
  }
}
