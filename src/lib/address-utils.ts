import { createClient } from '@/lib/supabase/client'

export interface AddressData {
  fullName: string
  phone: string
  addressLine1: string
  addressLine2?: string
  city: string
  state: string
  pincode: string
}

/**
 * Saves a checkout address to the Supabase `addresses` table for the given user,
 * unless an exact matching address already exists.
 */
export async function saveUserAddress(userId: string, address: AddressData) {
  if (!userId || !address.addressLine1 || !address.city || !address.pincode) return

  const supabase = createClient()

  try {
    // Check if user already has an identical address
    const { data: existing } = await supabase
      .from('addresses')
      .select('id')
      .eq('user_id', userId)
      .eq('address_line1', address.addressLine1)
      .eq('pincode', address.pincode)

    if (existing && existing.length > 0) {
      return // Address already saved in user profile
    }

    // Check how many addresses user has to decide if this should be default
    const { count } = await supabase
      .from('addresses')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)

    await supabase.from('addresses').insert({
      user_id: userId,
      full_name: address.fullName,
      phone: address.phone,
      address_line1: address.addressLine1,
      address_line2: address.addressLine2 || null,
      city: address.city,
      state: address.state,
      pincode: address.pincode,
      is_default: count === 0,
    })
  } catch (err) {
    console.error('Error saving user address:', err)
  }
}
