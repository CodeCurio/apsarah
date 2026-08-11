/**
 * Utility to generate live tracking URLs for major courier partners in India
 */
export function getTrackingUrl(carrier: string, trackingNumber: string): string {
  if (!trackingNumber) return '#'

  const cleanCarrier = carrier?.toLowerCase().trim() || ''
  const cleanAwb = trackingNumber.trim()

  if (cleanCarrier.includes('bluedart') || cleanCarrier.includes('blue dart')) {
    return `https://www.bluedart.com/tracking?awb=${cleanAwb}`
  }
  if (cleanCarrier.includes('delhivery')) {
    return `https://www.delhivery.com/track/package/${cleanAwb}`
  }
  if (cleanCarrier.includes('shiprocket')) {
    return `https://shiprocket.co/tracking/${cleanAwb}`
  }
  if (cleanCarrier.includes('dtdc')) {
    return `https://www.dtdc.in/tracking.asp?strNbr=${cleanAwb}`
  }
  if (cleanCarrier.includes('post') || cleanCarrier.includes('speed')) {
    return `https://www.indiapost.gov.in/_layouts/15/dop.portal.tracking/trackconsignment.aspx`
  }

  // Fallback default search / direct tracking
  return `https://www.google.com/search?q=${encodeURIComponent(`${carrier} tracking ${cleanAwb}`)}`
}
