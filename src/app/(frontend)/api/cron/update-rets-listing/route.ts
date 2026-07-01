import { fetchRETSListing } from '../functions/fetchRETSListing'
import { findExistingListing } from '../functions/findExistingListing'
import { updateListing } from '../functions/updateListing'
import { NextRequest } from 'next/server'

export const maxDuration = 300

export async function POST(request: NextRequest) {
  try {
    const headers = request.headers
    const cronSecret = process.env.CRON_SECRET
    const authSecret = headers.get('Authorization')?.split(' ')[1]

    if (cronSecret !== authSecret) {
      console.log('ERROR: INVALID CREDENTIALS')
      return new Response(
        JSON.stringify({
          error: 'Unauthorized',
        }),
        {
          status: 401,
          headers: { 'Content-Type': 'application/json' },
        },
      )
    }

    let body: { ListingKeyNumeric?: unknown }
    try {
      body = await request.json()
    } catch {
      return new Response(
        JSON.stringify({
          error: 'Invalid JSON body',
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        },
      )
    }

    const listingKeyNumeric = Number(body?.ListingKeyNumeric)
    if (!body?.ListingKeyNumeric || Number.isNaN(listingKeyNumeric)) {
      return new Response(
        JSON.stringify({
          error: 'A valid ListingKeyNumeric is required in the request body',
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        },
      )
    }

    const retsListing = await fetchRETSListing(listingKeyNumeric)
    if (!retsListing) {
      return new Response(
        JSON.stringify({
          error: `No RETS listing found for ListingKeyNumeric: ${listingKeyNumeric}`,
        }),
        {
          status: 404,
          headers: { 'Content-Type': 'application/json' },
        },
      )
    }

    const existingListing = await findExistingListing(listingKeyNumeric)
    if (!existingListing) {
      return new Response(
        JSON.stringify({
          error: `No Payload listing found for ListingKeyNumeric: ${listingKeyNumeric}`,
        }),
        {
          status: 404,
          headers: { 'Content-Type': 'application/json' },
        },
      )
    }

    const updatedListing = await updateListing(existingListing, retsListing)

    if (!updatedListing) {
      return new Response(
        JSON.stringify({
          message: `Listing was not updated (likely no photos found) for ListingKeyNumeric: ${listingKeyNumeric}`,
          listing: undefined,
        }),
        {
          status: 200,
          statusText: 'Listing not updated',
          headers: { 'Content-Type': 'application/json' },
        },
      )
    }

    return new Response(
      JSON.stringify({
        listing: { id: updatedListing.id, title: updatedListing.title },
      }),
      {
        status: 200,
        statusText: 'Success',
        headers: { 'Content-Type': 'application/json' },
      },
    )
  } catch (error) {
    console.error('ERROR UPDATING RETS LISTING: ' + error)
    return new Response(
      JSON.stringify({
        error: 'Unexpected error while updating RETS Listing',
      }),
      {
        status: 500,
        statusText: 'Unexpected error while updating RETS Listing',
        headers: { 'Content-Type': 'application/json' },
      },
    )
  }
}
