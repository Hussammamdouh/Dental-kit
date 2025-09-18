const admin = require('firebase-admin');
const serviceAccount = require('../config/firebase');

// Initialize Firebase Admin
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

const db = admin.firestore();

// Sample products data
const sampleProducts = [
  {
    name: 'Premium Dental Implant System',
    description: 'High-quality titanium dental implant system for permanent tooth replacement',
    price: 299.99,
    originalPrice: 399.99,
    categoryId: 'dental-implants',
    categoryName: 'Dental Implants',
    brand: 'DentalTech Pro',
    vendorId: 'dentaltech-pro',
    vendorName: 'DentalTech Pro',
    stock: 50,
    sku: 'DI-001',
    images: [
      'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=500',
      'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=500'
    ],
    specifications: {
      material: 'Titanium',
      length: '10mm',
      diameter: '4.2mm',
      surface: 'Acid-etched'
    },
    features: [
      'High biocompatibility',
      'Excellent osseointegration',
      'Long-term stability',
      'FDA approved'
    ],
    isActive: true,
    isFeatured: true,
    rating: 4.8,
    reviewCount: 127,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: 'Orthodontic Braces Kit',
    description: 'Complete orthodontic braces kit for professional dental practice',
    price: 89.99,
    originalPrice: 119.99,
    categoryId: 'orthodontic-supplies',
    categoryName: 'Orthodontic Supplies',
    brand: 'Ortho Solutions',
    vendorId: 'ortho-solutions',
    vendorName: 'Ortho Solutions',
    stock: 100,
    sku: 'OB-002',
    images: [
      'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=500',
      'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=500'
    ],
    specifications: {
      material: 'Stainless Steel',
      size: 'Standard',
      type: 'Metal Braces'
    },
    features: [
      'Durable construction',
      'Easy to apply',
      'Comfortable for patients',
      'Professional grade'
    ],
    isActive: true,
    isFeatured: false,
    rating: 4.6,
    reviewCount: 89,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: 'Dental Handpiece Set',
    description: 'Professional dental handpiece set for various dental procedures',
    price: 199.99,
    originalPrice: 249.99,
    categoryId: 'dental-instruments',
    categoryName: 'Dental Instruments',
    brand: 'DentalTech Pro',
    vendorId: 'dentaltech-pro',
    vendorName: 'DentalTech Pro',
    stock: 25,
    sku: 'DH-003',
    images: [
      'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=500',
      'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=500'
    ],
    specifications: {
      type: 'High-speed handpiece',
      speed: '400,000 RPM',
      connection: '4-hole',
      material: 'Stainless Steel'
    },
    features: [
      'High-speed performance',
      'Ergonomic design',
      'Easy maintenance',
      'Long service life'
    ],
    isActive: true,
    isFeatured: true,
    rating: 4.9,
    reviewCount: 156,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: 'Composite Resin Kit',
    description: 'Professional composite resin kit for dental restorations',
    price: 79.99,
    originalPrice: 99.99,
    categoryId: 'dental-materials',
    categoryName: 'Dental Materials',
    brand: 'Dental Materials Plus',
    vendorId: 'dental-materials-plus',
    vendorName: 'Dental Materials Plus',
    stock: 75,
    sku: 'CR-004',
    images: [
      'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=500',
      'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=500'
    ],
    specifications: {
      type: 'Nanohybrid composite',
      shade: 'Universal',
      opacity: 'Dentin',
      filler: '78% by weight'
    },
    features: [
      'Excellent aesthetics',
      'High strength',
      'Easy handling',
      'Long-lasting results'
    ],
    isActive: true,
    isFeatured: false,
    rating: 4.7,
    reviewCount: 203,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: 'Dental Chair Unit',
    description: 'Advanced dental chair unit with integrated equipment',
    price: 2999.99,
    originalPrice: 3499.99,
    categoryId: 'dental-equipment',
    categoryName: 'Dental Equipment',
    brand: 'DentalTech Pro',
    vendorId: 'dentaltech-pro',
    vendorName: 'DentalTech Pro',
    stock: 10,
    sku: 'DC-005',
    images: [
      'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=500',
      'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=500'
    ],
    specifications: {
      type: 'Electric dental chair',
      weight: '150kg',
      dimensions: '1200x800x1800mm',
      power: '110-240V'
    },
    features: [
      'Electric operation',
      'Memory positions',
      'Integrated light',
      'Comfortable padding'
    ],
    isActive: true,
    isFeatured: true,
    rating: 4.8,
    reviewCount: 67,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: 'Professional Toothpaste',
    description: 'Professional-grade toothpaste for dental hygiene',
    price: 12.99,
    originalPrice: 15.99,
    categoryId: 'hygiene-products',
    categoryName: 'Hygiene Products',
    brand: 'Dental Materials Plus',
    vendorId: 'dental-materials-plus',
    vendorName: 'Dental Materials Plus',
    stock: 200,
    sku: 'TP-006',
    images: [
      'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=500',
      'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=500'
    ],
    specifications: {
      size: '100ml',
      flavor: 'Mint',
      fluoride: '1450ppm',
      type: 'Anti-cavity'
    },
    features: [
      'Fluoride protection',
      'Fresh breath',
      'Gentle on enamel',
      'Professional formula'
    ],
    isActive: true,
    isFeatured: false,
    rating: 4.5,
    reviewCount: 342,
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

// Sample categories
const sampleCategories = [
  {
    id: 'dental-implants',
    name: 'Dental Implants',
    description: 'High-quality dental implants for permanent tooth replacement solutions',
    image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=500',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'orthodontic-supplies',
    name: 'Orthodontic Supplies',
    description: 'Comprehensive range of orthodontic materials and appliances',
    image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=500',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'dental-instruments',
    name: 'Dental Instruments',
    description: 'Professional dental instruments for various procedures',
    image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=500',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'dental-materials',
    name: 'Dental Materials',
    description: 'Restorative and preventive dental materials',
    image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=500',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'dental-equipment',
    name: 'Dental Equipment',
    description: 'Advanced dental equipment and machinery',
    image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=500',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'hygiene-products',
    name: 'Hygiene Products',
    description: 'Dental hygiene and preventive care products',
    image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=500',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

// Sample vendors
const sampleVendors = [
  {
    id: 'dentaltech-pro',
    name: 'DentalTech Pro',
    email: 'contact@dentaltechpro.com',
    phone: '+1-555-0123',
    address: {
      street: '123 Dental Street',
      city: 'New York',
      state: 'NY',
      country: 'USA',
      zipCode: '10001'
    },
    description: 'Leading manufacturer of dental implants and surgical instruments',
    website: 'https://dentaltechpro.com',
    contactPerson: {
      name: 'Dr. Sarah Johnson',
      email: 'sarah@dentaltechpro.com',
      phone: '+1-555-0124'
    },
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'ortho-solutions',
    name: 'Ortho Solutions',
    email: 'info@orthosolutions.com',
    phone: '+1-555-0456',
    address: {
      street: '456 Ortho Avenue',
      city: 'Los Angeles',
      state: 'CA',
      country: 'USA',
      zipCode: '90210'
    },
    description: 'Specialized in orthodontic supplies and materials',
    website: 'https://orthosolutions.com',
    contactPerson: {
      name: 'Dr. Michael Chen',
      email: 'michael@orthosolutions.com',
      phone: '+1-555-0457'
    },
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'dental-materials-plus',
    name: 'Dental Materials Plus',
    email: 'sales@dentalmaterialsplus.com',
    phone: '+1-555-0789',
    address: {
      street: '789 Material Drive',
      city: 'Chicago',
      state: 'IL',
      country: 'USA',
      zipCode: '60601'
    },
    description: 'Comprehensive dental materials and hygiene products',
    website: 'https://dentalmaterialsplus.com',
    contactPerson: {
      name: 'Dr. Emily Rodriguez',
      email: 'emily@dentalmaterialsplus.com',
      phone: '+1-555-0790'
    },
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

async function seedFirestore() {
  try {
    console.log('🌱 Starting Firestore seeding...');

    // Seed categories
    console.log('📂 Seeding categories...');
    for (const category of sampleCategories) {
      await db.collection('categories').doc(category.id).set(category);
    }
    console.log(`✅ Added ${sampleCategories.length} categories`);

    // Seed vendors
    console.log('🏢 Seeding vendors...');
    for (const vendor of sampleVendors) {
      await db.collection('vendors').doc(vendor.id).set(vendor);
    }
    console.log(`✅ Added ${sampleVendors.length} vendors`);

    // Seed products
    console.log('🦷 Seeding products...');
    for (const product of sampleProducts) {
      await db.collection('products').add(product);
    }
    console.log(`✅ Added ${sampleProducts.length} products`);

    console.log('🎉 Firestore seeding completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`   - Categories: ${sampleCategories.length}`);
    console.log(`   - Vendors: ${sampleVendors.length}`);
    console.log(`   - Products: ${sampleProducts.length}`);

  } catch (error) {
    console.error('❌ Error seeding Firestore:', error);
    process.exit(1);
  }
}

// Run the seeding
if (require.main === module) {
  seedFirestore()
    .then(() => {
      console.log('✅ Seeding completed successfully!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Seeding failed:', error);
      process.exit(1);
    });
}

module.exports = { seedFirestore };






