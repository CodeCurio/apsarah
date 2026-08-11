export interface OrderItemEmailData {
  title: string
  quantity: number
  unit_price: number
  line_total: number
  image_url?: string
  size?: string
}

export interface ShippingAddressEmailData {
  fullName: string
  email: string
  phone: string
  addressLine1: string
  addressLine2?: string
  city: string
  state: string
  pincode: string
  country?: string
}

export interface OrderConfirmationEmailProps {
  orderNumber: string
  customerName: string
  items: OrderItemEmailData[]
  shippingAddress: ShippingAddressEmailData
  subtotal: number
  discount: number
  shippingCost: number
  total: number
  paymentMethod: string
}

export interface AdminOrderAlertEmailProps {
  orderNumber: string
  customerName: string
  customerEmail: string
  customerPhone: string
  items: OrderItemEmailData[]
  total: number
  paymentMethod: string
  shippingCity: string
}

export interface OrderShippedEmailProps {
  orderNumber: string
  customerName: string
  carrier: string
  trackingNumber: string
  trackingUrl?: string
  shippingAddress: ShippingAddressEmailData
}

function formatEmailImageUrl(url?: string): string {
  if (!url) return ''
  if (url.startsWith('http://') || url.startsWith('https://')) return url
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://apsarah.in'
  const cleanSiteUrl = siteUrl.endsWith('/') ? siteUrl.slice(0, -1) : siteUrl
  const cleanPath = url.startsWith('/') ? url : `/${url}`
  return `${cleanSiteUrl}${cleanPath}`
}

/**
 * 1. Generates Customer Order Confirmation HTML Email
 */
export function renderOrderConfirmationEmailHtml(data: OrderConfirmationEmailProps): string {
  const itemsHtml = data.items
    .map(
      (item) => {
        const imgUrl = formatEmailImageUrl(item.image_url)
        return `
    <tr>
      <td style="padding: 12px 0; border-bottom: 1px solid #f0e6dd; vertical-align: top;">
        <table border="0" cellpadding="0" cellspacing="0">
          <tr>
            ${
              imgUrl
                ? `<td style="padding-right: 12px; vertical-align: top;">
                    <img src="${imgUrl}" alt="${item.title}" width="50" height="65" style="width: 50px; height: 65px; object-fit: cover; border-radius: 8px; border: 1px solid #E2D4C7; display: block;" />
                   </td>`
                : ''
            }
            <td style="vertical-align: top;">
              <p style="margin: 0; font-size: 13px; font-weight: bold; color: #2B1713;">${item.title}</p>
              <p style="margin: 3px 0 0 0; font-size: 11px; color: #7a6a65;">Qty: ${item.quantity} ${item.size ? `• Size: ${item.size}` : ''}</p>
              <p style="margin: 3px 0 0 0; font-size: 12px; font-weight: bold; color: #8F1020;">₹${item.unit_price.toLocaleString()}</p>
            </td>
          </tr>
        </table>
      </td>
      <td align="right" style="padding: 12px 0; border-bottom: 1px solid #f0e6dd; vertical-align: top; font-size: 13px; font-weight: bold; color: #2B1713;">
        ₹${item.line_total.toLocaleString()}
      </td>
    </tr>
  `
      }
    )
    .join('')

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Order Confirmation - ${data.orderNumber} | Apsarah</title>
</head>
<body style="margin: 0; padding: 0; background-color: #FAF6F0; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;">
  <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #FAF6F0; padding: 30px 10px;">
    <tr>
      <td align="center">
        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background-color: #ffffff; border-radius: 20px; overflow: hidden; border: 1px solid #E2D4C7; box-shadow: 0 8px 24px rgba(43,23,19,0.06);">
          
          <!-- Header Banner -->
          <tr>
            <td align="center" style="background-color: #8F1020; padding: 32px 20px; border-bottom: 3px solid #efbd3b;">
              <h1 style="margin: 0; color: #ffffff; font-family: Georgia, serif; font-size: 26px; font-weight: bold; letter-spacing: 3px; text-transform: uppercase;">
                APSARAH
              </h1>
              <p style="margin: 4px 0 0 0; color: #efbd3b; font-size: 10px; font-weight: bold; letter-spacing: 2px; text-transform: uppercase;">
                Royal &amp; Heritage Ethnic Wear
              </p>
            </td>
          </tr>

          <!-- Content Body -->
          <tr>
            <td style="padding: 35px 30px; color: #2B1713;">
              <div style="background-color: #fcf9f5; border-radius: 14px; border: 1px solid #E2D4C7; padding: 18px; margin-bottom: 24px; text-align: center;">
                <p style="margin: 0 0 4px 0; font-size: 11px; font-weight: bold; color: #8F1020; letter-spacing: 1px; text-transform: uppercase;">Order Confirmed</p>
                <h2 style="margin: 0; font-family: Georgia, serif; font-size: 20px; font-weight: bold; color: #2B1713;">Order #${data.orderNumber}</h2>
              </div>

              <p style="margin: 0 0 16px 0; font-size: 14px; line-height: 1.6; color: #4a3e3b;">
                Namaste <strong>${data.customerName}</strong>,
              </p>
              <p style="margin: 0 0 24px 0; font-size: 14px; line-height: 1.6; color: #4a3e3b;">
                Thank you for choosing <strong>Apsarah</strong>! We have received your order and our artisan team is preparing your handcrafted couture with utmost care.
              </p>

              <!-- Order Summary Box -->
              <h3 style="margin: 0 0 12px 0; font-family: Georgia, serif; font-size: 15px; color: #8F1020; border-bottom: 2px solid #FAF6F0; padding-bottom: 6px;">
                Items in Your Order
              </h3>

              <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 20px;">
                ${itemsHtml}
              </table>

              <!-- Totals Table -->
              <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #FAF6F0; border-radius: 12px; padding: 16px; margin-bottom: 24px;">
                <tr>
                  <td style="font-size: 12px; color: #6b5c58; padding-bottom: 6px;">Subtotal</td>
                  <td align="right" style="font-size: 12px; color: #2B1713; font-weight: bold; padding-bottom: 6px;">₹${data.subtotal.toLocaleString()}</td>
                </tr>
                ${
                  data.discount > 0
                    ? `
                <tr>
                  <td style="font-size: 12px; color: #16a34a; padding-bottom: 6px;">Discount</td>
                  <td align="right" style="font-size: 12px; color: #16a34a; font-weight: bold; padding-bottom: 6px;">-₹${data.discount.toLocaleString()}</td>
                </tr>`
                    : ''
                }
                <tr>
                  <td style="font-size: 12px; color: #6b5c58; padding-bottom: 8px;">Delivery Charge</td>
                  <td align="right" style="font-size: 12px; color: #2B1713; font-weight: bold; padding-bottom: 8px;">${data.shippingCost === 0 ? 'FREE' : `₹${data.shippingCost}`}</td>
                </tr>
                <tr>
                  <td style="font-size: 14px; font-weight: bold; color: #2B1713; border-top: 1px solid #E2D4C7; padding-top: 8px;">
                    Total Amount ${data.paymentMethod?.toLowerCase() === 'razorpay' ? '<span style="color: #16a34a; font-size: 12px;">(Paid Online via Razorpay)</span>' : '<span style="color: #8F1020; font-size: 12px;">(Cash on Delivery)</span>'}
                  </td>
                  <td align="right" style="font-size: 16px; font-weight: bold; color: #8F1020; border-top: 1px solid #E2D4C7; padding-top: 8px;">₹${data.total.toLocaleString()}</td>
                </tr>
              </table>

              <!-- Shipping Address -->
              <h3 style="margin: 0 0 8px 0; font-family: Georgia, serif; font-size: 14px; color: #8F1020;">
                Delivery Destination
              </h3>
              <p style="margin: 0; font-size: 12px; line-height: 1.6; color: #4a3e3b; background-color: #ffffff; border: 1px solid #E2D4C7; padding: 14px; border-radius: 12px;">
                <strong>${data.shippingAddress.fullName}</strong><br>
                ${data.shippingAddress.addressLine1}${data.shippingAddress.addressLine2 ? `, ${data.shippingAddress.addressLine2}` : ''}<br>
                ${data.shippingAddress.city}, ${data.shippingAddress.state} - ${data.shippingAddress.pincode}<br>
                Phone: ${data.shippingAddress.phone}
              </p>

              <!-- Track Order Button -->
              <div style="text-align: center; margin-top: 28px;">
                <a href="https://apsarah.in/account/orders" target="_blank" style="display: inline-block; background-color: #8F1020; color: #ffffff; font-size: 13px; font-weight: bold; text-decoration: none; padding: 14px 32px; border-radius: 12px; text-transform: uppercase; letter-spacing: 1px;">
                  View Order Status &rarr;
                </a>
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #FAF6F0; border-top: 1px solid #E2D4C7; padding: 20px 30px; text-align: center;">
              <p style="margin: 0 0 6px 0; font-size: 11px; font-weight: bold; color: #2B1713; letter-spacing: 1px; text-transform: uppercase;">
                APSARAH LUXURY WEAR
              </p>
              <p style="margin: 0; font-size: 10px; color: #8c7a75;">
                For any queries, contact us at <a href="mailto:contact@apsarah.in" style="color: #8F1020; text-decoration: underline;">contact@apsarah.in</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `
}

/**
 * 2. Generates Admin New Order Notification HTML Email
 */
export function renderAdminOrderAlertEmailHtml(data: AdminOrderAlertEmailProps): string {
  const itemsText = data.items
    .map((i) => `• ${i.title} (${i.size ? `Size: ${i.size}, ` : ''}Qty: ${i.quantity}) - ₹${i.line_total}`)
    .join('<br>')

  return `
<!DOCTYPE html>
<html>
<body style="font-family: sans-serif; background-color: #f8f9fa; padding: 20px;">
  <div style="max-width: 550px; margin: 0 auto; background: #ffffff; padding: 24px; border-radius: 12px; border: 1px solid #e9ecef;">
    <h2 style="color: #8F1020; margin-top: 0;">🚨 New Order Received!</h2>
    <p style="font-size: 16px; font-weight: bold; margin-bottom: 15px;">Order #${data.orderNumber}</p>
    
    <table width="100%" style="font-size: 13px; margin-bottom: 20px; border-collapse: collapse;">
      <tr><td style="padding: 6px 0; color: #6c757d;">Customer:</td><td style="font-weight: bold;">${data.customerName}</td></tr>
      <tr><td style="padding: 6px 0; color: #6c757d;">Email:</td><td>${data.customerEmail}</td></tr>
      <tr><td style="padding: 6px 0; color: #6c757d;">Phone:</td><td>${data.customerPhone}</td></tr>
      <tr><td style="padding: 6px 0; color: #6c757d;">City:</td><td>${data.shippingCity}</td></tr>
      <tr><td style="padding: 6px 0; color: #6c757d;">Payment Mode:</td><td style="font-weight: bold; color: #8F1020;">${data.paymentMethod.toUpperCase()}</td></tr>
      <tr><td style="padding: 6px 0; color: #6c757d;">Total Amount:</td><td style="font-size: 16px; font-weight: bold; color: #16a34a;">₹${data.total.toLocaleString()}</td></tr>
    </table>

    <div style="background: #FAF6F0; padding: 14px; border-radius: 8px; border: 1px solid #E2D4C7; font-size: 13px; line-height: 1.6;">
      <strong>Ordered Items:</strong><br>
      ${itemsText}
    </div>

    <div style="margin-top: 24px; text-align: center;">
      <a href="https://apsarah.in/admin/orders" style="display: inline-block; background: #2B1713; color: #ffffff; text-decoration: none; padding: 10px 20px; border-radius: 8px; font-size: 12px; font-weight: bold;">Open Admin Dashboard &rarr;</a>
    </div>
  </div>
</body>
</html>
  `
}

/**
 * 3. Generates Customer Order Shipped HTML Email
 */
export function renderOrderShippedEmailHtml(data: OrderShippedEmailProps): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><title>Your Order Has Shipped - ${data.orderNumber}</title></head>
<body style="margin: 0; padding: 0; background-color: #FAF6F0; font-family: sans-serif;">
  <table border="0" cellpadding="0" cellspacing="0" width="100%" style="padding: 30px 10px;">
    <tr>
      <td align="center">
        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background-color: #ffffff; border-radius: 20px; border: 1px solid #E2D4C7; overflow: hidden;">
          <tr>
            <td align="center" style="background-color: #8F1020; padding: 28px 20px; border-bottom: 3px solid #efbd3b;">
              <h1 style="margin: 0; color: #ffffff; font-family: Georgia, serif; font-size: 24px; font-weight: bold; letter-spacing: 2px;">APSARAH</h1>
            </td>
          </tr>
          <tr>
            <td style="padding: 32px 28px; color: #2B1713;">
              <h2 style="margin: 0 0 12px 0; font-family: Georgia, serif; color: #8F1020; font-size: 20px;">Your Order is On Its Way! 🚚✨</h2>
              <p style="margin: 0 0 20px 0; font-size: 14px; line-height: 1.6; color: #4a3e3b;">
                Namaste <strong>${data.customerName}</strong>, great news! Your order <strong>#${data.orderNumber}</strong> has been carefully packed and dispatched.
              </p>

              <div style="background-color: #FAF6F0; border-radius: 12px; border: 1px solid #E2D4C7; padding: 18px; margin-bottom: 24px;">
                <p style="margin: 0 0 6px 0; font-size: 12px; font-weight: bold; color: #8F1020; uppercase">Shipment Tracking Info</p>
                <p style="margin: 0 0 4px 0; font-size: 13px; color: #2B1713;"><strong>Courier Partner:</strong> ${data.carrier}</p>
                <p style="margin: 0 0 12px 0; font-size: 13px; color: #2B1713;"><strong>AWB / Tracking No:</strong> ${data.trackingNumber}</p>
                ${
                  data.trackingUrl
                    ? `<a href="${data.trackingUrl}" target="_blank" style="display: inline-block; background-color: #8F1020; color: #ffffff; font-size: 12px; font-weight: bold; text-decoration: none; padding: 10px 20px; border-radius: 8px;">Track Package Live &rarr;</a>`
                    : ''
                }
              </div>

              <p style="margin: 0; font-size: 12px; color: #8c7a75;">
                Shipping to: ${data.shippingAddress.addressLine1}, ${data.shippingAddress.city} - ${data.shippingAddress.pincode}
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `
}

export interface OrderPackedEmailProps {
  orderNumber: string
  customerName: string
  note?: string
}

/**
 * 4. Generates Customer Order Packed & Processing HTML Email
 */
export function renderOrderPackedEmailHtml(data: OrderPackedEmailProps): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><title>Order Status Update - ${data.orderNumber}</title></head>
<body style="margin: 0; padding: 0; background-color: #FAF6F0; font-family: sans-serif;">
  <table border="0" cellpadding="0" cellspacing="0" width="100%" style="padding: 30px 10px;">
    <tr>
      <td align="center">
        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background-color: #ffffff; border-radius: 20px; border: 1px solid #E2D4C7; overflow: hidden;">
          <tr>
            <td align="center" style="background-color: #8F1020; padding: 28px 20px; border-bottom: 3px solid #efbd3b;">
              <h1 style="margin: 0; color: #ffffff; font-family: Georgia, serif; font-size: 24px; font-weight: bold; letter-spacing: 2px;">APSARAH</h1>
            </td>
          </tr>
          <tr>
            <td style="padding: 32px 28px; color: #2B1713;">
              <h2 style="margin: 0 0 12px 0; font-family: Georgia, serif; color: #8F1020; font-size: 20px;">Your Order is Packed & Prepared! 🎁✨</h2>
              <p style="margin: 0 0 20px 0; font-size: 14px; line-height: 1.6; color: #4a3e3b;">
                Namaste <strong>${data.customerName}</strong>, your order <strong>#${data.orderNumber}</strong> has been quality checked and carefully packed in our signature royal packaging.
              </p>

              <div style="background-color: #FAF6F0; border-radius: 12px; border: 1px solid #E2D4C7; padding: 18px; margin-bottom: 24px;">
                <p style="margin: 0 0 4px 0; font-size: 13px; color: #2B1713;"><strong>Current Status:</strong> Packed & Ready for Logistics Handover</p>
                ${data.note ? `<p style="margin: 6px 0 0 0; font-size: 12px; color: #6b5c58;">Note: ${data.note}</p>` : ''}
              </div>

              <div style="text-align: center; margin-top: 24px;">
                <a href="https://apsarah.in/account/orders" target="_blank" style="display: inline-block; background-color: #8F1020; color: #ffffff; font-size: 12px; font-weight: bold; text-decoration: none; padding: 12px 28px; border-radius: 10px;">
                  View Live Order Status &rarr;
                </a>
              </div>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `
}

export interface OrderDeliveredEmailProps {
  orderNumber: string
  customerName: string
  note?: string
}

/**
 * 5. Generates Customer Order Delivered HTML Email
 */
export function renderOrderDeliveredEmailHtml(data: OrderDeliveredEmailProps): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><title>Order Delivered - ${data.orderNumber}</title></head>
<body style="margin: 0; padding: 0; background-color: #FAF6F0; font-family: sans-serif;">
  <table border="0" cellpadding="0" cellspacing="0" width="100%" style="padding: 30px 10px;">
    <tr>
      <td align="center">
        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background-color: #ffffff; border-radius: 20px; border: 1px solid #E2D4C7; overflow: hidden;">
          <tr>
            <td align="center" style="background-color: #8F1020; padding: 28px 20px; border-bottom: 3px solid #efbd3b;">
              <h1 style="margin: 0; color: #ffffff; font-family: Georgia, serif; font-size: 24px; font-weight: bold; letter-spacing: 2px;">APSARAH</h1>
            </td>
          </tr>
          <tr>
            <td style="padding: 32px 28px; color: #2B1713;">
              <h2 style="margin: 0 0 12px 0; font-family: Georgia, serif; color: #8F1020; font-size: 20px;">Your Order Has Been Delivered! 🎉✨</h2>
              <p style="margin: 0 0 20px 0; font-size: 14px; line-height: 1.6; color: #4a3e3b;">
                Namaste <strong>${data.customerName}</strong>, your order <strong>#${data.orderNumber}</strong> has been successfully delivered! We hope you adore your handcrafted Apsarah attire.
              </p>

              <div style="background-color: #FAF6F0; border-radius: 12px; border: 1px solid #E2D4C7; padding: 18px; margin-bottom: 24px;">
                <p style="margin: 0 0 4px 0; font-size: 13px; color: #2B1713;"><strong>Status:</strong> Delivered & Completed</p>
                ${data.note ? `<p style="margin: 6px 0 0 0; font-size: 12px; color: #6b5c58;">Note: ${data.note}</p>` : ''}
              </div>

              <div style="text-align: center; margin-top: 24px;">
                <a href="https://apsarah.in/account/orders" target="_blank" style="display: inline-block; background-color: #8F1020; color: #ffffff; font-size: 12px; font-weight: bold; text-decoration: none; padding: 12px 28px; border-radius: 10px;">
                  View Order Summary & Receipt &rarr;
                </a>
              </div>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `
}
