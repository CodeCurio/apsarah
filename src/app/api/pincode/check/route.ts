import { NextResponse } from 'next/server'

// Major Metro / State Postal Prefix Mapping for ultra-fast courier zone estimation
const METRO_PREFIXES: Record<string, { city: string; state: string; zone: 'metro' | 'tier1' | 'tier2' }> = {
  '11': { city: 'Delhi / NCR', state: 'Delhi', zone: 'metro' },
  '12': { city: 'Gurugram / Haryana', state: 'Haryana', zone: 'metro' },
  '13': { city: 'Faridabad / Haryana', state: 'Haryana', zone: 'metro' },
  '20': { city: 'Noida / Ghaziabad', state: 'Uttar Pradesh', zone: 'metro' },
  '40': { city: 'Mumbai', state: 'Maharashtra', zone: 'metro' },
  '41': { city: 'Pune', state: 'Maharashtra', zone: 'tier1' },
  '56': { city: 'Bengaluru', state: 'Karnataka', zone: 'metro' },
  '60': { city: 'Chennai', state: 'Tamil Nadu', zone: 'metro' },
  '70': { city: 'Kolkata', state: 'West Bengal', zone: 'metro' },
  '50': { city: 'Hyderabad', state: 'Telangana', zone: 'metro' },
  '38': { city: 'Ahmedabad', state: 'Gujarat', zone: 'tier1' },
  '30': { city: 'Jaipur', state: 'Rajasthan', zone: 'tier1' },
  '16': { city: 'Chandigarh', state: 'Punjab', zone: 'tier1' },
  '22': { city: 'Lucknow', state: 'Uttar Pradesh', zone: 'tier1' },
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const pin = (searchParams.get('pincode') || '').trim()

  // 1. Regex validation for Indian Pincode format (6 digits, non-zero start)
  if (!/^[1-9][0-9]{5}$/.test(pin)) {
    return NextResponse.json({
      serviceable: false,
      message: 'Please enter a valid 6-digit Indian Pincode (e.g., 110001).',
    })
  }

  try {
    // 2. Fetch live pincode verification from India Post API (with 2.5s timeout)
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 2500)

    const apiRes = await fetch(`https://api.postalpincode.in/pincode/${pin}`, {
      signal: controller.signal,
      headers: { 'User-Agent': 'Apsarah-Pincode-Checker' },
    })
    clearTimeout(timeoutId)

    if (apiRes.ok) {
      const data = await apiRes.json()
      if (Array.isArray(data) && data[0]?.Status === 'Success' && data[0]?.PostOffice?.length > 0) {
        const po = data[0].PostOffice[0]
        const district = po.District || po.Block || po.Name
        const state = po.State || 'India'
        const area = po.Name

        const prefix = pin.substring(0, 2)
        const isMetro = METRO_PREFIXES[prefix]?.zone === 'metro'

        // Calculate delivery dates based on Zone
        const today = new Date()
        const minDays = isMetro ? 2 : 3
        const maxDays = isMetro ? 4 : 6

        const d1 = new Date(today)
        d1.setDate(today.getDate() + minDays)
        const d2 = new Date(today)
        d2.setDate(today.getDate() + maxDays)

        const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric', weekday: 'short' }

        return NextResponse.json({
          serviceable: true,
          pincode: pin,
          city: district,
          area,
          state,
          courierPartner: isMetro ? 'Delhivery Air / BlueDart Express' : 'Shiprocket Surface / India Post',
          estimatedDays: `${minDays}–${maxDays} Business Days`,
          deliveryWindow: `${d1.toLocaleDateString('en-IN', options)} – ${d2.toLocaleDateString('en-IN', options)}`,
          codAvailable: true,
          message: `Serviceable to ${area}, ${district} (${state}).`,
        })
      }
    }
  } catch {
    // Timeout or network fallback
  }

  // 3. Fallback check using prefix table
  const prefix = pin.substring(0, 2)
  const knownInfo = METRO_PREFIXES[prefix]

  if (knownInfo) {
    const today = new Date()
    const isMetro = knownInfo.zone === 'metro'
    const minDays = isMetro ? 2 : 3
    const maxDays = isMetro ? 4 : 6

    const d1 = new Date(today)
    d1.setDate(today.getDate() + minDays)
    const d2 = new Date(today)
    d2.setDate(today.getDate() + maxDays)

    const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric', weekday: 'short' }

    return NextResponse.json({
      serviceable: true,
      pincode: pin,
      city: knownInfo.city,
      state: knownInfo.state,
      courierPartner: 'Delhivery Express / BlueDart Air',
      estimatedDays: `${minDays}–${maxDays} Business Days`,
      deliveryWindow: `${d1.toLocaleDateString('en-IN', options)} – ${d2.toLocaleDateString('en-IN', options)}`,
      codAvailable: true,
      message: `Serviceable to ${knownInfo.city} region.`,
    })
  }

  // If pincode prefix is not recognized or invalid
  return NextResponse.json({
    serviceable: false,
    pincode: pin,
    message: `Pincode ${pin} is currently non-serviceable for express courier delivery.`,
  })
}
