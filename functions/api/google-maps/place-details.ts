/**
 * Cloudflare Pages Function: Get Google Maps Place Details
 * GET /api/google-maps/place-details?place_id=ChIJ...
 * Returns formatted address and location details
 */

interface Env {
  GOOGLE_MAPS_API_KEY: string;
}

export async function onRequestGet(context: { request: Request; env: Env }) {
  const { request, env } = context;

  try {
    const url = new URL(request.url);
    const placeId = url.searchParams.get('place_id');

    if (!placeId) {
      return new Response(JSON.stringify({ 
        error: 'place_id parameter is required' 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (!env.GOOGLE_MAPS_API_KEY) {
      return new Response(JSON.stringify({ 
        error: 'Google Maps API key not configured' 
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    console.log(`📍 Fetching place details for: ${placeId}`);

    // Fetch place details from Google Maps API
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/place/details/json?` +
      `place_id=${placeId}&fields=formatted_address,address_components,name,geometry&key=${env.GOOGLE_MAPS_API_KEY}`
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`❌ Google Maps API error: ${response.status} - ${errorText}`);
      return new Response(JSON.stringify({ 
        error: `Google Maps API request failed: ${response.status}` 
      }), {
        status: response.status,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const data = await response.json();

    if (data.error_message) {
      console.error(`❌ Google Maps API error: ${data.error_message}`);
      return new Response(JSON.stringify({ 
        error: data.error_message 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const result = data.result;

    if (!result) {
      return new Response(JSON.stringify({ 
        error: 'No place found for this Place ID' 
      }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Extract address components
    const addressComponents = result.address_components || [];
    let city = '';
    let state = '';
    let country = '';
    let postalCode = '';

    for (const component of addressComponents) {
      const types = component.types;
      
      if (types.includes('locality')) {
        city = component.long_name;
      } else if (types.includes('administrative_area_level_1')) {
        state = component.long_name;
      } else if (types.includes('country')) {
        country = component.long_name;
      } else if (types.includes('postal_code')) {
        postalCode = component.long_name;
      }
    }

    const formattedAddress = result.formatted_address || '';
    const placeName = result.name || '';
    const location = result.geometry?.location;

    console.log(`✅ Place details retrieved: ${formattedAddress}`);

    return new Response(JSON.stringify({
      success: true,
      address: formattedAddress,
      name: placeName,
      city: city,
      state: state,
      country: country,
      postalCode: postalCode,
      location: city || state, // For the location field
      latitude: location?.lat,
      longitude: location?.lng,
    }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    console.error('❌ Place details fetch error:', error);
    return new Response(JSON.stringify({ 
      error: error.message || 'Failed to fetch place details' 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
