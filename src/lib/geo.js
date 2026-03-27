/**
 * Returns the user's approximate location from ipapi.co (free, HTTPS).
 * Result is cached in sessionStorage to avoid repeated API calls.
 */
export async function getLocation() {
  try {
    const cached = sessionStorage.getItem('_saar_geo');
    if (cached) return JSON.parse(cached);

    const res = await fetch('https://ipapi.co/json/', { signal: AbortSignal.timeout(3000) });
    if (!res.ok) throw new Error('geo failed');
    const data = await res.json();
    const location = {
      country: data.country_name || 'Unknown',
      city: data.city || 'Unknown',
      countryCode: data.country_code || 'XX',
    };
    sessionStorage.setItem('_saar_geo', JSON.stringify(location));
    return location;
  } catch {
    return { country: 'Unknown', city: 'Unknown', countryCode: 'XX' };
  }
}
