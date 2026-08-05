import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://lgknzhwurdogezbvyjst.supabase.co'
const SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxna256aHd1cmRvZ2V6YnZ5anN0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NTE3NTE4NiwiZXhwIjoyMTAwNzUxMTg2fQ.z4swKbRzhiNy2a8nh72QZDMJqQxFioRFPf8gz-ZYRCo'

const supabase = createClient(SUPABASE_URL, SERVICE_KEY)

const realProducts = [
  {
    id: 'prod-bl054942',
    name: 'Royal Navy Zari Embroidered Lehenga Set',
    slug: 'royal-navy-zari-embroidered-lehenga-set',
    category: 'Lehengas',
    sub_category: 'Festive Crop Top Lehengas',
    price: 7499, old_price: 14999, discount_percent: 50,
    rating: 4.9, review_count: 84,
    images: [
      '/assets/navy-blue-embroidered-zari-lehenga-set-2.webp',
      '/assets/navy-blue-embroidered-zari-lehenga-set-1.webp',
      '/assets/navy-blue-embroidered-zari-lehenga-set-3.webp',
      '/assets/navy-blue-embroidered-zari-lehenga-set-4.webp'
    ],
    sizes: [{"size":"S","stock":6},{"size":"M","stock":10},{"size":"L","stock":4},{"size":"XL","stock":3},{"size":"XXL","stock":2}],
    colors: [{"name":"Navy Blue","hex":"#1C2833","images":['/assets/navy-blue-embroidered-zari-lehenga-set-2.webp','/assets/navy-blue-embroidered-zari-lehenga-set-1.webp','/assets/navy-blue-embroidered-zari-lehenga-set-3.webp','/assets/navy-blue-embroidered-zari-lehenga-set-4.webp']}],
    fabric: 'Pure Chanderi Silk & Georgette', fit: 'Voluminous Flared Fit', pattern: 'Intricate Zari & Sequin Embroidery',
    neckline: 'Sweetheart V-Neck', sleeves: 'Sleeveless', occasion: 'Sangeet, Wedding & Festive Reception', wash_care: 'Dry Clean Only',
    description: 'Command regal elegance with this breathtaking Navy Blue embroidered lehenga set, adorned with glittering zari motifs and detailed artisan lacework.',
    highlights: ['Pure Silk & lightweight Georgette blend', 'Heavy handcrafted zari and sequin blouse', 'Includes voluminous skirt, tailored blouse & embroidered sheer dupatta'],
    is_bestseller: true, is_new_arrival: true
  },
  {
    id: 'prod-bl773615',
    name: 'Sindoor Red Embroidered Silk Kurta Set',
    slug: 'sindoor-red-embroidered-silk-kurta-set',
    category: 'Kurta Sets',
    sub_category: 'Straight Suit Sets',
    price: 3599, old_price: 5999, discount_percent: 40,
    rating: 4.8, review_count: 62,
    images: [
      '/assets/red-embroidered-silk-kurta-set-2.webp',
      '/assets/red-embroidered-silk-kurta-set-3.webp',
      '/assets/red-embroidered-silk-kurta-set-1.webp',
      '/assets/red-embroidered-silk-kurta-set-4.webp'
    ],
    sizes: [{"size":"S","stock":8},{"size":"M","stock":12},{"size":"L","stock":6},{"size":"XL","stock":5}],
    colors: [{"name":"Sindoor Red","hex":"#A93226","images":['/assets/red-embroidered-silk-kurta-set-2.webp','/assets/red-embroidered-silk-kurta-set-3.webp','/assets/red-embroidered-silk-kurta-set-1.webp','/assets/red-embroidered-silk-kurta-set-4.webp']}],
    fabric: 'Chanderi Silk & Cotton Mulmul', fit: 'Straight Tailored Fit', pattern: 'Hand-Embroidered Zari Floral Yoke',
    neckline: 'Round Neck with Keyhole Details', sleeves: 'Three-Quarter Sleeves', occasion: 'Puja, Festivals & Family Gatherings', wash_care: 'Dry Clean Recommended',
    description: 'Radiate timeless festive grandeur in this Sindoor Red Chanderi silk kurta set, featuring intricate resham and gold embroidery on the neckline.',
    highlights: ['Rich texture Chanderi silk with breathable lining', 'Intricate floral resham and sequin yoke work', 'Paired with matching solid trousers and gold-bordered silk dupatta'],
    is_bestseller: true, is_new_arrival: false
  },
  {
    id: 'prod-bl248546',
    name: 'Imperial Wine Silk Kurta & Zari Dupatta Set',
    slug: 'imperial-wine-silk-kurta-zari-dupatta-set',
    category: 'Kurta Sets',
    sub_category: 'Silk Kurta Sets',
    price: 3899, old_price: 6499, discount_percent: 40,
    rating: 4.9, review_count: 96,
    images: [
      '/assets/wine-purple-silk-kurta-set-pink-dupatta-2.webp',
      '/assets/wine-purple-silk-kurta-set-pink-dupatta-1.webp',
      '/assets/wine-purple-silk-kurta-set-pink-dupatta-3.webp'
    ],
    sizes: [{"size":"S","stock":10},{"size":"M","stock":14},{"size":"L","stock":8},{"size":"XL","stock":4},{"size":"XXL","stock":2}],
    colors: [{"name":"Imperial Wine","hex":"#5B2C6F","images":['/assets/wine-purple-silk-kurta-set-pink-dupatta-2.webp','/assets/wine-purple-silk-kurta-set-pink-dupatta-1.webp','/assets/wine-purple-silk-kurta-set-pink-dupatta-3.webp']}],
    fabric: 'Raw Silk with Banarasi Zari Dupatta', fit: 'Relaxed Straight Fit', pattern: 'Gotta Patti & Mirror Embroidery',
    neckline: 'Sweetheart Notch Neck', sleeves: 'Three-Quarter Sleeves', occasion: 'Evening Soirees & Festive Celebrations', wash_care: 'Dry Clean Only',
    description: 'A match made in heaven—deep imperial wine raw silk paired with a stunning pastel pink handloom zari woven dupatta.',
    highlights: ['Premium luminous silk body with handcrafted mirror yoke', 'Contrasting pastel blush pink Banarasi dupatta', 'Matching wine pants with comfortable elasticity'],
    is_bestseller: true, is_new_arrival: true
  },
  {
    id: 'prod-bl550109',
    name: 'Gul-e-Plum Floral Printed Pashmina Set',
    slug: 'gul-e-plum-floral-printed-pashmina-set',
    category: 'Kurta Sets',
    sub_category: 'Straight Suit Sets',
    price: 2899, old_price: 4832, discount_percent: 40,
    rating: 4.7, review_count: 45,
    images: [
      '/assets/plum-wine-floral-printed-kurta-set-2.webp',
      '/assets/plum-wine-floral-printed-kurta-set-1.webp',
      '/assets/plum-wine-floral-printed-kurta-set-3.webp',
      '/assets/plum-wine-floral-printed-kurta-set-4.webp'
    ],
    sizes: [{"size":"S","stock":5},{"size":"M","stock":9},{"size":"L","stock":6},{"size":"XL","stock":2}],
    colors: [{"name":"Plum Wine","hex":"#4A235A","images":['/assets/plum-wine-floral-printed-kurta-set-2.webp','/assets/plum-wine-floral-printed-kurta-set-1.webp','/assets/plum-wine-floral-printed-kurta-set-3.webp','/assets/plum-wine-floral-printed-kurta-set-4.webp']}],
    fabric: 'Premium Pashmina Silk Blend', fit: 'Straight Fit with Tapered Trousers', pattern: 'Royal Persian Floral Screen Print',
    neckline: 'Round Neck', sleeves: 'Full Length Sleeves', occasion: 'Casual Luxury & Day Gatherings', wash_care: 'Hand Wash separately in Cold Water',
    description: 'Featuring sophisticated Persian garden florals printed over super-soft silk fabric, offering everyday opulence with matched trousers.',
    highlights: ['Ultra-soft Pashmina feel fabric', 'Digitally printed heritage Persian florals', 'Comes with complimentary matching soft dupatta & trousers'],
    is_bestseller: false, is_new_arrival: false
  },
  {
    id: 'prod-bl528117',
    name: 'Rosé Blush Embroidered Silk Suit Set',
    slug: 'rose-blush-embroidered-silk-suit-set',
    category: 'Kurta Sets',
    sub_category: 'Silk Kurta Sets',
    price: 3999, old_price: 6665, discount_percent: 40,
    rating: 4.9, review_count: 118,
    images: [
      '/assets/pastel-pink-silk-kurta-set-zari-dupatta-2.webp',
      '/assets/pastel-pink-silk-kurta-set-zari-dupatta-1.webp',
      '/assets/pastel-pink-silk-kurta-set-zari-dupatta-3.webp'
    ],
    sizes: [{"size":"S","stock":7},{"size":"M","stock":15},{"size":"L","stock":10},{"size":"XL","stock":6}],
    colors: [{"name":"Rose Pink","hex":"#D98880","images":['/assets/pastel-pink-silk-kurta-set-zari-dupatta-2.webp','/assets/pastel-pink-silk-kurta-set-zari-dupatta-1.webp','/assets/pastel-pink-silk-kurta-set-zari-dupatta-3.webp']}],
    fabric: 'Tussar Silk Blend & Brocade Dupatta', fit: 'A-Line Relaxed Fit', pattern: 'Intricate Pearl & Zari Yoke Work',
    neckline: 'Sweetheart Neck', sleeves: 'Three-Quarter Sleeves', occasion: 'Engagement & Day Weddings', wash_care: 'Dry Clean Only',
    description: 'Immaculately crafted in rosé blush Tussar silk with opulent handcrafted pearl and zari beadings along the neckline.',
    highlights: ['Real pearl beadings and French knot floral embroidery', 'Accompanied by contrasting wine trousers for striking aesthetic', 'Sheer silk brocade border dupatta'],
    is_bestseller: true, is_new_arrival: true
  },
  {
    id: 'prod-bl779021',
    name: 'Midnight Noir Floral Embroidered Kurta Set',
    slug: 'midnight-noir-floral-embroidered-kurta-set',
    category: 'Kurta Sets',
    sub_category: 'Straight Suit Sets',
    price: 2699, old_price: 4498, discount_percent: 40,
    rating: 4.8, review_count: 73,
    images: [
      '/assets/black-floral-embroidered-kurta-set-2.webp',
      '/assets/black-floral-embroidered-kurta-set-1.webp',
      '/assets/black-floral-embroidered-kurta-set-3.webp',
      '/assets/black-floral-embroidered-kurta-set-4.webp'
    ],
    sizes: [{"size":"S","stock":12},{"size":"M","stock":18},{"size":"L","stock":10},{"size":"XL","stock":8}],
    colors: [{"name":"Midnight Black","hex":"#17202A","images":['/assets/black-floral-embroidered-kurta-set-2.webp','/assets/black-floral-embroidered-kurta-set-1.webp','/assets/black-floral-embroidered-kurta-set-3.webp','/assets/black-floral-embroidered-kurta-set-4.webp']}],
    fabric: '100% Premium Cotton Mulmul', fit: 'Straight Comfort Fit', pattern: 'Contrast Ivory Resham Floral Embroidery',
    neckline: 'V-Neck with Scalloped Flower Trim', sleeves: 'Three-Quarter Sleeves', occasion: 'Office Luxury & Casual Evenings', wash_care: 'Gentle Machine Wash in Cold Water',
    description: 'An evergreen statement piece in jet black premium cotton, highlighted with boldly stitched ivory resham roses and floral bootis.',
    highlights: ['100% Breathable cotton mulmul suitable for all-day comfort', 'Intricate contrast white rose machine embroidery', 'Complete set with tailored pants and soft mul dupatta'],
    is_bestseller: true, is_new_arrival: false
  },
  {
    id: 'prod-bl881874',
    name: 'Sifa Olive Green Pleated Anarkali Set',
    slug: 'sifa-olive-green-pleated-anarkali-set',
    category: 'Kurta Sets',
    sub_category: 'Anarkali Sets',
    price: 4299, old_price: 7165, discount_percent: 40,
    rating: 5.0, review_count: 142,
    images: [
      '/assets/olive-green-pleated-anarkali-kurta-set-2.webp',
      '/assets/olive-green-pleated-anarkali-kurta-set-1.webp',
      '/assets/olive-green-pleated-anarkali-kurta-set-3.webp',
      '/assets/olive-green-pleated-anarkali-kurta-set-4.webp'
    ],
    sizes: [{"size":"S","stock":9},{"size":"M","stock":14},{"size":"L","stock":8},{"size":"XL","stock":5},{"size":"XXL","stock":3}],
    colors: [{"name":"Olive Green","hex":"#556B2F","images":['/assets/olive-green-pleated-anarkali-kurta-set-2.webp','/assets/olive-green-pleated-anarkali-kurta-set-1.webp','/assets/olive-green-pleated-anarkali-kurta-set-3.webp','/assets/olive-green-pleated-anarkali-kurta-set-4.webp']}],
    fabric: 'Chanderi Cotton with Organza Dupatta', fit: 'Flared Pleated Anarkali Fit', pattern: 'Delicate Resham Pink Blossom Embroidery',
    neckline: 'Mandarin Collar with Notch', sleeves: 'Three-Quarter Sleeves', occasion: 'Festive Celebrations & Mehndi Ceremonies', wash_care: 'Dry Clean Recommended',
    description: 'Step out in poetic grace with this luscious olive green pleated Anarkali, accentuated with soft pink lotus resham embroidery along the flair and dupatta.',
    highlights: ['Finely structured pleats for flattering twirling silhouettes', 'Delicate pastel pink bloom motifs embroidered along skirt', 'Includes matching green pants and lightweight floral dupatta'],
    is_bestseller: true, is_new_arrival: true
  },
  {
    id: 'prod-bl214784',
    name: 'Saffron Sunset Embroidered Anarkali Dress Set',
    slug: 'saffron-sunset-embroidered-anarkali-dress-set',
    category: 'Dresses',
    sub_category: 'Anarkali Dresses',
    price: 3799, old_price: 6332, discount_percent: 40,
    rating: 4.7, review_count: 51,
    images: [
      '/assets/rust-orange-floral-embroidered-anarkali-set-2.webp',
      '/assets/rust-orange-floral-embroidered-anarkali-set-1.webp',
      '/assets/rust-orange-floral-embroidered-anarkali-set-3.webp',
      '/assets/rust-orange-floral-embroidered-anarkali-set-4.webp'
    ],
    sizes: [{"size":"S","stock":4},{"size":"M","stock":8},{"size":"L","stock":5},{"size":"XL","stock":2}],
    colors: [{"name":"Rust Orange","hex":"#D35400","images":['/assets/rust-orange-floral-embroidered-anarkali-set-2.webp','/assets/rust-orange-floral-embroidered-anarkali-set-1.webp','/assets/rust-orange-floral-embroidered-anarkali-set-3.webp','/assets/rust-orange-floral-embroidered-anarkali-set-4.webp']}],
    fabric: 'Handloom Cotton Silk', fit: 'Voluminous Gathered Anarkali Dress', pattern: 'Multi-Color Resham & Sequin Floral Embroidery',
    neckline: 'Keyhole V-Neck', sleeves: 'Three-Quarter Sleeves', occasion: 'Haldi Ceremonies, Day Festivals & Brunches', wash_care: 'Dry Clean Only',
    description: 'Capturing the golden warmth of sunset, this voluminous rust orange Anarkali fusion dress features rich botanical resham bouquets.',
    highlights: ['Can be styled as a solo statement maxi dress or traditional suit', 'Artisanal pink and brown botanical floral embroidery on chest and hem', 'Includes matching trousers and cotton silk drape'],
    is_bestseller: false, is_new_arrival: true
  },
  {
    id: 'prod-bl771470',
    name: 'Firoza Sea Green Floral Zari Lehenga Set',
    slug: 'firoza-sea-green-floral-zari-lehenga-set',
    category: 'Lehengas',
    sub_category: 'Festive Crop Top Lehengas',
    price: 8999, old_price: 17999, discount_percent: 50,
    rating: 4.9, review_count: 105,
    images: [
      '/assets/pastel-sea-green-embroidered-lehenga-set-2.webp',
      '/assets/pastel-sea-green-embroidered-lehenga-set-1.webp',
      '/assets/pastel-sea-green-embroidered-lehenga-set-3.webp',
      '/assets/pastel-sea-green-embroidered-lehenga-set-4.webp'
    ],
    sizes: [{"size":"S","stock":5},{"size":"M","stock":10},{"size":"L","stock":6},{"size":"XL","stock":3}],
    colors: [{"name":"Sea Green","hex":"#76D7C4","images":['/assets/pastel-sea-green-embroidered-lehenga-set-2.webp','/assets/pastel-sea-green-embroidered-lehenga-set-1.webp','/assets/pastel-sea-green-embroidered-lehenga-set-3.webp','/assets/pastel-sea-green-embroidered-lehenga-set-4.webp']}],
    fabric: 'Georgette & Chanderi Silk', fit: 'Full Flared Lehenga with Crop Top', pattern: 'Floral Pastel Embroidery with Pearl Fringe',
    neckline: 'V-Neck with Pearl Drops', sleeves: 'Sleeveless', occasion: 'Bridesmaid, Reception & Sangeet', wash_care: 'Dry Clean Only',
    description: 'Exude ethereal fairytale magic with this soothing sea green lehenga set, featuring pearl bead fringes and vibrant pastel garden embroidery.',
    highlights: ['Hand-stitched faux pearl droplet hem along crop top blouse', 'Multi-hued peach, pink and gold floral garden embroidered along skirt hem', 'Lightweight pleated texture for effortless dancing and movement'],
    is_bestseller: true, is_new_arrival: true
  },
  {
    id: 'prod-bl387204',
    name: 'Maharani Pink Embroidered Jacket & Lehenga Set',
    slug: 'maharani-pink-embroidered-jacket-lehenga-set',
    category: 'Lehengas',
    sub_category: 'Jacket Lehengas',
    price: 9599, old_price: 19198, discount_percent: 50,
    rating: 4.9, review_count: 88,
    images: [
      '/assets/rani-pink-embroidered-jacket-lehenga-set-2.webp',
      '/assets/rani-pink-embroidered-jacket-lehenga-set-1.webp',
      '/assets/rani-pink-embroidered-jacket-lehenga-set-3.webp',
      '/assets/rani-pink-embroidered-jacket-lehenga-set-4.webp'
    ],
    sizes: [{"size":"S","stock":4},{"size":"M","stock":7},{"size":"L","stock":4},{"size":"XL","stock":2}],
    colors: [{"name":"Rani Pink","hex":"#C2185B","images":['/assets/rani-pink-embroidered-jacket-lehenga-set-2.webp','/assets/rani-pink-embroidered-jacket-lehenga-set-1.webp','/assets/rani-pink-embroidered-jacket-lehenga-set-3.webp','/assets/rani-pink-embroidered-jacket-lehenga-set-4.webp']}],
    fabric: 'Pure Raw Silk & Pleated Georgette', fit: 'Structured Jacket over Flared Skirt', pattern: 'Heavy Silver Zari & Sequin Royal Armor Embroidery',
    neckline: 'V-Neck Jacket Front', sleeves: 'Three-Quarter Sleeves', occasion: 'Wedding Gala & Royal Receptions', wash_care: 'Dry Clean Only',
    description: 'A sovereign royal silhouette combining a heavily embellished silver zari jacket with a flowing pleated Rani Pink lehenga skirt.',
    highlights: ['Architectural Rajasthani jali and floral silver sequin embroidery on jacket', 'Versatile layering piece—jacket can be worn independently', 'Matching heavy embroidered hem skirt with matching dupatta'],
    is_bestseller: true, is_new_arrival: false
  },
  {
    id: 'prod-bl936281',
    name: 'Shaam-e-Oudh Black Silk Floral Kurta Set',
    slug: 'shaam-e-oudh-black-silk-floral-kurta-set',
    category: 'Kurta Sets',
    sub_category: 'Silk Kurta Sets',
    price: 3699, old_price: 6165, discount_percent: 40,
    rating: 4.8, review_count: 67,
    images: [
      '/assets/black-silk-floral-embroidered-kurta-set-2.webp',
      '/assets/black-silk-floral-embroidered-kurta-set-1.webp',
      '/assets/black-silk-floral-embroidered-kurta-set-3.webp',
      '/assets/black-silk-floral-embroidered-kurta-set-4.webp'
    ],
    sizes: [{"size":"S","stock":6},{"size":"M","stock":11},{"size":"L","stock":7},{"size":"XL","stock":5}],
    colors: [{"name":"Noir Black","hex":"#0E1111","images":['/assets/black-silk-floral-embroidered-kurta-set-2.webp','/assets/black-silk-floral-embroidered-kurta-set-1.webp','/assets/black-silk-floral-embroidered-kurta-set-3.webp','/assets/black-silk-floral-embroidered-kurta-set-4.webp']}],
    fabric: 'Raw Chanderi Silk Blend', fit: 'Straight Fit', pattern: 'Vibrant Pink & Lilac Resham Embroidery',
    neckline: 'V-Neck Notch', sleeves: 'Three-Quarter Sleeves', occasion: 'Evening Dinner & Cocktails', wash_care: 'Dry Clean Only',
    description: 'Like flowering nocturnal blossoms against a velvet night sky, this black silk suit shines with vibrant pink and lavender resham embroidery.',
    highlights: ['Lustrous black silk fabric with natural sheen', 'Multi-color resham thread floral climbing vines', 'Includes matching solid black silk trousers & embroidered chiffon dupatta'],
    is_bestseller: false, is_new_arrival: true
  },
  {
    id: 'prod-bl130854',
    name: 'Mayur Teal Zari Border Anarkali Set',
    slug: 'mayur-teal-zari-border-anarkali-set',
    category: 'Kurta Sets',
    sub_category: 'Anarkali Sets',
    price: 4199, old_price: 6998, discount_percent: 40,
    rating: 4.9, review_count: 132,
    images: [
      '/assets/teal-blue-zari-border-anarkali-kurta-set-2.webp',
      '/assets/teal-blue-zari-border-anarkali-kurta-set-1.webp',
      '/assets/teal-blue-zari-border-anarkali-kurta-set-3.webp',
      '/assets/teal-blue-zari-border-anarkali-kurta-set-4.webp'
    ],
    sizes: [{"size":"S","stock":8},{"size":"M","stock":14},{"size":"L","stock":9},{"size":"XL","stock":6}],
    colors: [{"name":"Teal Peacock","hex":"#008080","images":['/assets/teal-blue-zari-border-anarkali-kurta-set-2.webp','/assets/teal-blue-zari-border-anarkali-kurta-set-1.webp','/assets/teal-blue-zari-border-anarkali-kurta-set-3.webp','/assets/teal-blue-zari-border-anarkali-kurta-set-4.webp']}],
    fabric: 'Pure Cotton Silk Blend', fit: 'Flared Anarkali', pattern: 'Zari Patchwork & Mirror Embroidery',
    neckline: 'Round Neck with Patch Border', sleeves: 'Three-Quarter Sleeves', occasion: 'Festive Puja & Weddings', wash_care: 'Dry Clean Only',
    description: 'Inspired by the regal plumage of the royal peacock, this teal blue Anarkali features stunning red and gold zari traditional borders.',
    highlights: ['Rich teal peacock hue paired with bold maroon silk dupatta', 'Intricate zari and mirror patchwork along neckline and skirt hem', 'Includes matching teal trousers'],
    is_bestseller: true, is_new_arrival: false
  },
  {
    id: 'prod-bl942874',
    name: 'Patti Ivory & Copper Handpainted Co-ord Set',
    slug: 'patti-ivory-copper-handpainted-coord-set',
    category: 'Co-ord Sets',
    sub_category: 'Indo-Western Tunic Sets',
    price: 3299, old_price: 5498, discount_percent: 40,
    rating: 4.8, review_count: 79,
    images: [
      '/assets/off-white-copper-leaf-handpainted-coord-set-2.webp',
      '/assets/off-white-copper-leaf-handpainted-coord-set-1.webp',
      '/assets/off-white-copper-leaf-handpainted-coord-set-3.webp',
      '/assets/off-white-copper-leaf-handpainted-coord-set-4.webp'
    ],
    sizes: [{"size":"S","stock":10},{"size":"M","stock":15},{"size":"L","stock":8},{"size":"XL","stock":5}],
    colors: [{"name":"Ivory & Copper","hex":"#F8F9F9","images":['/assets/off-white-copper-leaf-handpainted-coord-set-2.webp','/assets/off-white-copper-leaf-handpainted-coord-set-1.webp','/assets/off-white-copper-leaf-handpainted-coord-set-3.webp','/assets/off-white-copper-leaf-handpainted-coord-set-4.webp']}],
    fabric: 'Pure Linen Silk Blend', fit: 'Modern Tailored Tunic & Pants', pattern: 'Artisanal Copper Brown & Green Botanical Leaf Print',
    neckline: 'Shirt Collar V-Neck', sleeves: 'Full Length Sleeves', occasion: 'Resort Wear, Art Galleries & High Tea', wash_care: 'Dry Clean / Gentle Hand Wash',
    description: 'Effortless luxury meets resort sophistication in this ivory linen co-ord set, featuring striking oversized copper-leaf painted motifs running down the tunic and trousers.',
    highlights: ['Modern high-fashion architectural leaf placement printing', 'Breathable natural linen-silk blend with structured finish', 'Includes collared tunic shirt and perfectly tailored matching motif trousers'],
    is_bestseller: false, is_new_arrival: true
  },
  {
    id: 'prod-bl810670',
    name: 'Kashmiri Beige & Navy Paisley Printed Suit',
    slug: 'kashmiri-beige-navy-paisley-printed-suit',
    category: 'Kurta Sets',
    sub_category: 'Straight Suit Sets',
    price: 2499, old_price: 4165, discount_percent: 40,
    rating: 4.6, review_count: 38,
    images: [
      '/assets/beige-navy-paisley-printed-suit-set-1.webp'
    ],
    sizes: [{"size":"S","stock":5},{"size":"M","stock":8},{"size":"L","stock":6},{"size":"XL","stock":3}],
    colors: [{"name":"Beige & Navy","hex":"#E5E7E9","images":['/assets/beige-navy-paisley-printed-suit-set-1.webp']}],
    fabric: 'Winter Pashmina Cotton', fit: 'Straight Relaxed Fit', pattern: 'Traditional Kashmiri Paisley Border Print',
    neckline: 'Round Neck', sleeves: 'Three-Quarter Sleeves', occasion: 'Daily Office & Casual Lunches', wash_care: 'Machine Washable in Gentle Cycle',
    description: 'Classic Kashmiri inspired paisley printed borders elevate this comfortable everyday beige and navy blue cotton suit set.',
    highlights: ['Soft skin-friendly daily wear cotton pashmina feel', 'Intricate navy blue paisley patterned border along hem and cuffs', 'Paired with dark solid navy blue trousers'],
    is_bestseller: false, is_new_arrival: false
  },
  {
    id: 'prod-bl507286',
    name: 'Pista Green Silk Mirror & Floral Kurta Set',
    slug: 'pista-green-silk-mirror-floral-kurta-set',
    category: 'Kurta Sets',
    sub_category: 'Silk Kurta Sets',
    price: 4499, old_price: 7498, discount_percent: 40,
    rating: 4.9, review_count: 91,
    images: [
      '/assets/pistachio-gold-silk-floral-embroidered-set-1.webp',
      '/assets/pistachio-gold-silk-floral-embroidered-set-2.webp',
      '/assets/pistachio-gold-silk-floral-embroidered-set-3.webp'
    ],
    sizes: [{"size":"S","stock":7},{"size":"M","stock":12},{"size":"L","stock":8},{"size":"XL","stock":4}],
    colors: [{"name":"Pistachio Gold","hex":"#A9DFBF","images":['/assets/pistachio-gold-silk-floral-embroidered-set-1.webp','/assets/pistachio-gold-silk-floral-embroidered-set-2.webp','/assets/pistachio-gold-silk-floral-embroidered-set-3.webp']}],
    fabric: 'Raw Tussar Silk with Tissue Dupatta', fit: 'Straight Fit', pattern: 'Geometric Mirror Chokor Yoke & Large Lotus Embroidery',
    neckline: 'Round Neck with Mirror Triangles', sleeves: 'Three-Quarter Sleeves', occasion: 'Festive Celebrations & Mehndi', wash_care: 'Dry Clean Only',
    description: 'A luminous pistachio gold silk suit featuring authentic geometrical triangular mirror-work along the neckline and oversized embroidered garden water lilies.',
    highlights: ['Authentic geometrical glass mirror embroidery around neck', 'Large romantic pastel lotus resham embroidery across skirt', 'Includes matching pista green silk trousers and sheer gossamer tissue dupatta'],
    is_bestseller: true, is_new_arrival: true
  },
  {
    id: 'prod-bl765571',
    name: 'Haldi Mustard Aztec Printed Kurta Set',
    slug: 'haldi-mustard-aztec-printed-kurta-set',
    category: 'Kurta Sets',
    sub_category: 'Straight Suit Sets',
    price: 2599, old_price: 4332, discount_percent: 40,
    rating: 4.8, review_count: 54,
    images: [
      '/assets/mustard-yellow-geometric-printed-kurta-set-2.webp',
      '/assets/mustard-yellow-geometric-printed-kurta-set-1.webp',
      '/assets/mustard-yellow-geometric-printed-kurta-set-4.webp',
      '/assets/mustard-yellow-geometric-printed-kurta-set-3.webp'
    ],
    sizes: [{"size":"S","stock":10},{"size":"M","stock":16},{"size":"L","stock":9},{"size":"XL","stock":5}],
    colors: [{"name":"Mustard Yellow","hex":"#D4AC0D","images":['/assets/mustard-yellow-geometric-printed-kurta-set-2.webp','/assets/mustard-yellow-geometric-printed-kurta-set-1.webp','/assets/mustard-yellow-geometric-printed-kurta-set-4.webp','/assets/mustard-yellow-geometric-printed-kurta-set-3.webp']}],
    fabric: '100% Pure Cambric Cotton', fit: 'Straight Tailored Fit', pattern: 'Aztec Chevron Print with Central Mirror Diamond',
    neckline: 'Round Neck with Mirror Motif', sleeves: 'Three-Quarter Sleeves', occasion: 'Haldi Function, Day Outings & Workwear', wash_care: 'Hand Wash separately in Cold Water',
    description: 'Bring bright sunshine vibes to your wardrobe with this mustard yellow cotton set, accented with geometric Aztec prints and a handcrafted central mirror diamond.',
    highlights: ['100% Pure breathable summer cotton', 'Hand-stitched central mirror and red bead medallion work', 'Includes matching mustard printed trousers and dupatta'],
    is_bestseller: false, is_new_arrival: false
  },
  {
    id: 'prod-bl325039',
    name: 'Panna Emerald Green Birdcage Embroidered Kurta',
    slug: 'panna-emerald-green-birdcage-embroidered-kurta',
    category: 'Kurtas & Tops',
    sub_category: 'Long Straight Kurtas',
    price: 2399, old_price: 3998, discount_percent: 40,
    rating: 4.7, review_count: 42,
    images: [
      '/assets/emerald-green-silk-birdcage-embroidered-set-1.webp',
      '/assets/emerald-green-silk-birdcage-embroidered-set-2.webp'
    ],
    sizes: [{"size":"S","stock":8},{"size":"M","stock":12},{"size":"L","stock":6},{"size":"XL","stock":4}],
    colors: [{"name":"Emerald Green","hex":"#117A65","images":['/assets/emerald-green-silk-birdcage-embroidered-set-1.webp','/assets/emerald-green-silk-birdcage-embroidered-set-2.webp']}],
    fabric: 'Chanderi Cotton Silk', fit: 'Straight Relaxed Fit', pattern: 'Unique Heritage Birdcage & Garden Motif Embroidery',
    neckline: 'V-Neck with Sequin Lace', sleeves: 'Three-Quarter Sleeves', occasion: 'Casual Chic & Festive Dinners', wash_care: 'Gentle Machine Wash',
    description: 'An exquisite jewel-toned emerald green kurta set highlighted with charming architectural birdcage and flower embroidery motifs.',
    highlights: ['Unique designer statement birdcage resham embroidery', 'Delicate sequin studded lace trim along neckline and placket', 'Comes paired with matching emerald green silk trousers'],
    is_bestseller: false, is_new_arrival: true
  },
  {
    id: 'prod-bl566787',
    name: 'Royal Wine Velvet Crop Top & Flared Palazzo Set',
    slug: 'royal-wine-velvet-crop-top-flared-palazzo-set',
    category: 'Co-ord Sets',
    sub_category: 'Velvet Co-ords',
    price: 4899, old_price: 8165, discount_percent: 40,
    rating: 4.9, review_count: 115,
    images: [
      '/assets/wine-purple-velvet-crop-top-palazzo-set-1.webp',
      '/assets/wine-purple-velvet-crop-top-palazzo-set-2.webp',
      '/assets/wine-purple-velvet-crop-top-palazzo-set-3.webp'
    ],
    sizes: [{"size":"S","stock":6},{"size":"M","stock":10},{"size":"L","stock":7},{"size":"XL","stock":3}],
    colors: [{"name":"Deep Wine","hex":"#4A235A","images":['/assets/wine-purple-velvet-crop-top-palazzo-set-1.webp','/assets/wine-purple-velvet-crop-top-palazzo-set-2.webp','/assets/wine-purple-velvet-crop-top-palazzo-set-3.webp']}],
    fabric: 'Micro-Velvet & Flared Georgette Chiffon', fit: 'Structured Jacket over Flared Palazzos', pattern: 'Heavy Gold Zari & Pearl Droplet Edge Work',
    neckline: 'Open Jacket over Bustier', sleeves: 'Sleeveless / Cape effect', occasion: 'Cocktail Parties, Sangeet & Reception', wash_care: 'Dry Clean Only',
    description: 'Ultra-luxurious evening ensemble featuring an intricately zari-embroidered velvet jacket crop top cascading over liquid-flow georgette palazzos.',
    highlights: ['Rich regal velvet jacket top with pearl droplet fringe along hem', 'Ultra-wide flared chiffon georgette palazzos with effortless drape', 'High-fashion modern fusion cut ideal for celebrations'],
    is_bestseller: true, is_new_arrival: true
  },
  {
    id: 'prod-bl257927',
    name: 'Gul-e-Peach Strappy Embroidered Sharara Set',
    slug: 'gul-e-peach-strappy-embroidered-sharara-set',
    category: 'Kurta Sets',
    sub_category: 'Sharara & Gharara Sets',
    price: 4599, old_price: 7665, discount_percent: 40,
    rating: 5.0, review_count: 168,
    images: [
      '/assets/peach-floral-embroidered-strappy-sharara-set-2.webp',
      '/assets/peach-floral-embroidered-strappy-sharara-set-1.webp',
      '/assets/peach-floral-embroidered-strappy-sharara-set-3.webp',
      '/assets/peach-floral-embroidered-strappy-sharara-set-4.webp'
    ],
    sizes: [{"size":"S","stock":10},{"size":"M","stock":16},{"size":"L","stock":9},{"size":"XL","stock":5}],
    colors: [{"name":"Pastel Peach","hex":"#F5B7B1","images":['/assets/peach-floral-embroidered-strappy-sharara-set-2.webp','/assets/peach-floral-embroidered-strappy-sharara-set-1.webp','/assets/peach-floral-embroidered-strappy-sharara-set-3.webp','/assets/peach-floral-embroidered-strappy-sharara-set-4.webp']}],
    fabric: 'Georgette Silk Blend with Satin Lining', fit: 'Fitted Strap Tunic with Flared Sharara Skirt', pattern: 'Heavy Multi-Color Botanical Flower & Sequin Embroidery',
    neckline: 'Square Strappy Neckline', sleeves: 'Sleeveless Strappy', occasion: 'Haldi, Mehndi, Poolside Weddings & Parties', wash_care: 'Dry Clean Recommended',
    description: 'The ultimate bridesmaid & celebration centerpiece! A breathtaking pastel peach strappy tunic drenched in multi-color flower field embroidery, paired with flowing sharara pants.',
    highlights: ['Youthful square neckline with gold sequin strap detailing', 'Vibrant botanical floral garden embroidery over whole tunic', 'Includes high-waisted flowing sharara bottoms and chiffon dupatta'],
    is_bestseller: true, is_new_arrival: true
  },
  {
    id: 'prod-bl38536',
    name: 'Chandan White & Pink Paisley Embroidered Kurta',
    slug: 'chandan-white-pink-paisley-embroidered-kurta',
    category: 'Kurtas & Tops',
    sub_category: 'Long Straight Kurtas',
    price: 2199, old_price: 3665, discount_percent: 40,
    rating: 4.8, review_count: 29,
    images: [
      '/assets/off-white-pink-paisley-embroidered-kurta-set-1.webp'
    ],
    sizes: [{"size":"S","stock":5},{"size":"M","stock":9},{"size":"L","stock":7},{"size":"XL","stock":3}],
    colors: [{"name":"Chandan Ivory","hex":"#FDFEFE","images":['/assets/off-white-pink-paisley-embroidered-kurta-set-1.webp']}],
    fabric: 'Pure Chanderi Cotton Silk', fit: 'Straight Comfort Fit', pattern: 'Oversized Pastel Pink Paisley Hem Embroidery',
    neckline: 'Round Neck with Embroidery', sleeves: 'Three-Quarter Sleeves', occasion: 'Day Outings & Temple Visits', wash_care: 'Hand Wash separately in Cold Water',
    description: 'Pristine sandalwood ivory cotton silk tunic showcasing majestic pastel pink hand-embroidered paisley motifs across the hemline.',
    highlights: ['Lustrous ivory cotton silk fabric with smooth drape', 'Statement artisanal oversized pink paisley embroidery along skirt hem', 'Includes comfortable matching white straight trousers'],
    is_bestseller: false, is_new_arrival: false
  },
  {
    id: 'prod-bl880816',
    name: 'Basanti Sunflower Printed Cotton Kurta Set',
    slug: 'basanti-sunflower-printed-cotton-kurta-set',
    category: 'Kurta Sets',
    sub_category: 'Straight Suit Sets',
    price: 2799, old_price: 4665, discount_percent: 40,
    rating: 4.9, review_count: 83,
    images: [
      '/assets/olive-green-sunflower-printed-kurta-set-2.webp',
      '/assets/olive-green-sunflower-printed-kurta-set-1.webp',
      '/assets/olive-green-sunflower-printed-kurta-set-3.webp'
    ],
    sizes: [{"size":"S","stock":8},{"size":"M","stock":14},{"size":"L","stock":10},{"size":"XL","stock":6}],
    colors: [{"name":"Olive & Sunflower","hex":"#7D6608","images":['/assets/olive-green-sunflower-printed-kurta-set-2.webp','/assets/olive-green-sunflower-printed-kurta-set-1.webp','/assets/olive-green-sunflower-printed-kurta-set-3.webp']}],
    fabric: '100% Pure Cotton', fit: 'Straight Relaxed Fit', pattern: 'Large Blooming Sunflower Print with Silver Zari Yoke',
    neckline: 'Round Neck with Zari Frame', sleeves: 'Three-Quarter Sleeves', occasion: 'Haldi, Summer Lunches & Casual Festive', wash_care: 'Gentle Machine Wash',
    description: 'Infuse boundless joy into your look with this vibrant olive green cotton suit, bursting with large sunflower watercolor blooms and a silver zari embroidered chest frame.',
    highlights: ['100% Ultra-soft summer cambric cotton', 'Silver zari and thread embroidered traditional framing around yoke', 'Paired with complimentary olive green trousers'],
    is_bestseller: true, is_new_arrival: false
  },
  // Adding an item specifically to guarantee rich coverage for Bottoms category
  {
    id: 'prod-bl942874-bottoms',
    name: 'Patti Copper-Leaf Architectural Palazzos & Trousers',
    slug: 'patti-copper-leaf-architectural-palazzos',
    category: 'Bottoms',
    sub_category: 'Pants & Trousers',
    price: 1499, old_price: 2499, discount_percent: 40,
    rating: 4.9, review_count: 34,
    images: [
      '/assets/off-white-copper-leaf-handpainted-coord-set-4.webp',
      '/assets/off-white-copper-leaf-handpainted-coord-set-2.webp'
    ],
    sizes: [{"size":"S","stock":12},{"size":"M","stock":15},{"size":"L","stock":10},{"size":"XL","stock":8}],
    colors: [{"name":"Ivory & Copper","hex":"#F8F9F9","images":['/assets/off-white-copper-leaf-handpainted-coord-set-4.webp','/assets/off-white-copper-leaf-handpainted-coord-set-2.webp']}],
    fabric: 'Pure Linen Silk Blend', fit: 'Tailored Straight Fit Trousers', pattern: 'Handpainted Copper Brown Leaf Side Seam Motif',
    neckline: 'High Waist Elasticated', sleeves: 'Ankle Length', occasion: 'Resort Wear & Fusion Styling', wash_care: 'Hand Wash separately in Cold Water',
    description: 'Elevate any solid tunic or short kurti with these designer architectural trousers, featuring artisanal oversized copper-leaf motifs along the outer legs.',
    highlights: ['Elasticated back waistband with clean flat-front tailoring', 'Hand-painted style copper and moss green climbing leaf motifs', 'Made from structured breathable linen silk blend'],
    is_bestseller: false, is_new_arrival: true
  }
]

async function seed() {
  console.log('🔄 Clearing old test placeholder products from Supabase...')
  await supabase.from('apsarah_products').delete().neq('id', 'placeholder-none')

  console.log(`📦 Inserting ${realProducts.length} verified fashion catalog products into Supabase...`)
  const { data, error } = await supabase
    .from('apsarah_products')
    .upsert(realProducts, { onConflict: 'id' })
    .select()

  if (error) {
    console.error('❌ Error inserting products:', error)
  } else {
    console.log(`✅ Successfully seeded ${data.length} luxury fashion products into Supabase!`)
  }
}

seed()
