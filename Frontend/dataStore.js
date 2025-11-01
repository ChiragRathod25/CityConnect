import axios from "axios";
const sampleBusinesses = [
  // ===========================
  // CATEGORY: RESTAURANT
  // ===========================
  {
    businessName: "Spice Garden",
    businessType: "product",
    businessCategory: "restaurant",
    businessDescription:
      "Authentic Indian dining experience offering traditional curries, tandoori dishes, and regional specialties.",
    establishedYear: "2012",
    numberOfEmployees: "25",
    annualRevenue: "1.2M USD",
    logo: "https://example.com/logos/spicegarden.png",
    images: [
      "https://example.com/images/spicegarden-1.jpg",
      "https://example.com/images/spicegarden-2.jpg",
    ],
    phone: "+1 415 234 5678",
    email: "info@spicegarden.com",
    website: "https://spicegarden.com",
    socialMedia: {
      facebook: "https://facebook.com/spicegarden",
      twitter: "",
      instagram: "https://instagram.com/spicegardenrestaurant",
      linkedin: "",
      youtube: "",
    },
    location: {
      lat: 37.7749,
      lng: -122.4194,
      address: "221 Curry St, San Francisco, CA",
      street: "221 Curry St",
      city: "San Francisco",
      state: "California",
      postalCode: "94103",
      country: "USA",
    },
    businessHours: [
      { dayOfWeek: "Monday", openTime: "10:00 AM", closeTime: "10:00 PM", isClosed: false },
      { dayOfWeek: "Tuesday", openTime: "10:00 AM", closeTime: "10:00 PM", isClosed: false },
      { dayOfWeek: "Wednesday", openTime: "10:00 AM", closeTime: "10:00 PM", isClosed: false },
      { dayOfWeek: "Thursday", openTime: "10:00 AM", closeTime: "10:00 PM", isClosed: false },
      { dayOfWeek: "Friday", openTime: "10:00 AM", closeTime: "11:00 PM", isClosed: false },
      { dayOfWeek: "Saturday", openTime: "11:00 AM", closeTime: "11:00 PM", isClosed: false },
      { dayOfWeek: "Sunday", openTime: "11:00 AM", closeTime: "9:00 PM", isClosed: false },
    ],
    acceptTerms: true,
  },
  {
    businessName: "Bella Italia",
    businessType: "product",
    businessCategory: "restaurant",
    businessDescription:
      "Italian restaurant serving handmade pasta, wood-fired pizzas, and fine wines in a cozy setting.",
    establishedYear: "2016",
    numberOfEmployees: "18",
    annualRevenue: "850K USD",
    logo: "https://example.com/logos/bellaitalia.png",
    images: ["https://example.com/images/bellaitalia.jpg"],
    phone: "+1 213 555 9988",
    email: "hello@bellaitalia.com",
    website: "https://bellaitalia.com",
    socialMedia: {
      facebook: "https://facebook.com/bellaitalia",
      twitter: "",
      instagram: "https://instagram.com/bellaitalia_sf",
      linkedin: "",
      youtube: "",
    },
    location: {
      lat: 34.0522,
      lng: -118.2437,
      address: "89 Roma Ave, Los Angeles, CA",
      street: "89 Roma Ave",
      city: "Los Angeles",
      state: "California",
      postalCode: "90013",
      country: "USA",
    },
    businessHours: [
      { dayOfWeek: "Monday", openTime: "12:00 PM", closeTime: "10:00 PM", isClosed: false },
      { dayOfWeek: "Tuesday", openTime: "12:00 PM", closeTime: "10:00 PM", isClosed: false },
      { dayOfWeek: "Wednesday", openTime: "12:00 PM", closeTime: "10:00 PM", isClosed: false },
      { dayOfWeek: "Thursday", openTime: "12:00 PM", closeTime: "10:00 PM", isClosed: false },
      { dayOfWeek: "Friday", openTime: "12:00 PM", closeTime: "11:00 PM", isClosed: false },
      { dayOfWeek: "Saturday", openTime: "1:00 PM", closeTime: "11:00 PM", isClosed: false },
      { dayOfWeek: "Sunday", openTime: "1:00 PM", closeTime: "9:00 PM", isClosed: false },
    ],
    acceptTerms: true,
  },
  {
    businessName: "Sushi Zen",
    businessType: "product",
    businessCategory: "restaurant",
    businessDescription:
      "Modern Japanese restaurant specializing in sushi, sashimi, and omakase experiences.",
    establishedYear: "2019",
    numberOfEmployees: "22",
    annualRevenue: "950K USD",
    logo: "https://example.com/logos/sushizen.png",
    images: ["https://example.com/images/sushizen.jpg"],
    phone: "+1 646 789 4321",
    email: "reservations@sushizen.com",
    website: "https://sushizen.com",
    socialMedia: {
      facebook: "",
      twitter: "",
      instagram: "https://instagram.com/sushizen",
      linkedin: "",
      youtube: "",
    },
    location: {
      lat: 40.7128,
      lng: -74.006,
      address: "12 Cherry Blossom St, New York, NY",
      street: "12 Cherry Blossom St",
      city: "New York",
      state: "New York",
      postalCode: "10013",
      country: "USA",
    },
    businessHours: [
      { dayOfWeek: "Monday", openTime: "11:30 AM", closeTime: "10:00 PM", isClosed: false },
      { dayOfWeek: "Tuesday", openTime: "11:30 AM", closeTime: "10:00 PM", isClosed: false },
      { dayOfWeek: "Wednesday", openTime: "11:30 AM", closeTime: "10:00 PM", isClosed: false },
      { dayOfWeek: "Thursday", openTime: "11:30 AM", closeTime: "10:00 PM", isClosed: false },
      { dayOfWeek: "Friday", openTime: "11:30 AM", closeTime: "11:00 PM", isClosed: false },
      { dayOfWeek: "Saturday", openTime: "12:00 PM", closeTime: "11:00 PM", isClosed: false },
      { dayOfWeek: "Sunday", openTime: "12:00 PM", closeTime: "9:00 PM", isClosed: false },
    ],
    acceptTerms: true,
  },

  // ===========================
  // CATEGORY: CAFE
  // ===========================
  {
    businessName: "Bean & Bloom",
    businessType: "product",
    businessCategory: "cafe",
    businessDescription:
      "A cozy café offering artisanal coffee, handcrafted pastries, and a peaceful work-friendly atmosphere.",
    establishedYear: "2015",
    numberOfEmployees: "10",
    annualRevenue: "450K USD",
    logo: "https://example.com/logos/beanbloom.png",
    images: ["https://example.com/images/beanbloom.jpg"],
    phone: "+1 510 123 4567",
    email: "contact@beanbloom.com",
    website: "https://beanbloom.com",
    socialMedia: {
      facebook: "https://facebook.com/beanandbloom",
      twitter: "",
      instagram: "https://instagram.com/beanandbloom",
      linkedin: "",
      youtube: "",
    },
    location: {
      lat: 37.8715,
      lng: -122.273,
      address: "88 College Ave, Berkeley, CA",
      street: "88 College Ave",
      city: "Berkeley",
      state: "California",
      postalCode: "94704",
      country: "USA",
    },
    businessHours: [
      { dayOfWeek: "Monday", openTime: "8:00 AM", closeTime: "6:00 PM", isClosed: false },
      { dayOfWeek: "Tuesday", openTime: "8:00 AM", closeTime: "6:00 PM", isClosed: false },
      { dayOfWeek: "Wednesday", openTime: "8:00 AM", closeTime: "6:00 PM", isClosed: false },
      { dayOfWeek: "Thursday", openTime: "8:00 AM", closeTime: "6:00 PM", isClosed: false },
      { dayOfWeek: "Friday", openTime: "8:00 AM", closeTime: "8:00 PM", isClosed: false },
      { dayOfWeek: "Saturday", openTime: "9:00 AM", closeTime: "8:00 PM", isClosed: false },
      { dayOfWeek: "Sunday", openTime: "9:00 AM", closeTime: "5:00 PM", isClosed: false },
    ],
    acceptTerms: true,
  },

  // ✅ (DATASET CONTINUES FOR: gym, salon, transport, education, medical, shopping, entertainment, services, other)
  // ===========================
// CATEGORY: GYM
// ===========================
{
  businessName: "Iron Core Fitness",
  businessType: "service",
  businessCategory: "gym",
  businessDescription:
    "Modern fitness center offering strength training, personal coaching, and nutrition guidance for all levels.",
  establishedYear: "2017",
  numberOfEmployees: "15",
  annualRevenue: "750K USD",
  logo: "https://example.com/logos/ironcore.png",
  images: ["https://example.com/images/ironcore-1.jpg", "https://example.com/images/ironcore-2.jpg"],
  phone: "+1 312 555 9911",
  email: "contact@ironcorefit.com",
  website: "https://ironcorefit.com",
  socialMedia: {
    facebook: "https://facebook.com/ironcorefitness",
    twitter: "",
    instagram: "https://instagram.com/ironcorefit",
    linkedin: "",
    youtube: "https://youtube.com/@ironcorefitness",
  },
  location: {
    lat: 41.8781,
    lng: -87.6298,
    address: "300 Main Ave, Chicago, IL",
    street: "300 Main Ave",
    city: "Chicago",
    state: "Illinois",
    postalCode: "60601",
    country: "USA",
  },
  businessHours: [
    { dayOfWeek: "Monday", openTime: "6:00 AM", closeTime: "10:00 PM", isClosed: false },
    { dayOfWeek: "Tuesday", openTime: "6:00 AM", closeTime: "10:00 PM", isClosed: false },
    { dayOfWeek: "Wednesday", openTime: "6:00 AM", closeTime: "10:00 PM", isClosed: false },
    { dayOfWeek: "Thursday", openTime: "6:00 AM", closeTime: "10:00 PM", isClosed: false },
    { dayOfWeek: "Friday", openTime: "6:00 AM", closeTime: "9:00 PM", isClosed: false },
    { dayOfWeek: "Saturday", openTime: "8:00 AM", closeTime: "6:00 PM", isClosed: false },
    { dayOfWeek: "Sunday", openTime: "8:00 AM", closeTime: "4:00 PM", isClosed: false },
  ],
  acceptTerms: true,
},
{
  businessName: "Pulse Arena",
  businessType: "service",
  businessCategory: "gym",
  businessDescription:
    "High-energy fitness hub offering group workouts, HIIT training, and spinning classes.",
  establishedYear: "2020",
  numberOfEmployees: "10",
  annualRevenue: "520K USD",
  logo: "https://example.com/logos/pulsearena.png",
  images: ["https://example.com/images/pulsearena.jpg"],
  phone: "+1 213 333 4433",
  email: "info@pulsearena.com",
  website: "https://pulsearena.com",
  socialMedia: {
    facebook: "",
    twitter: "",
    instagram: "https://instagram.com/pulsearena",
    linkedin: "",
    youtube: "",
  },
  location: {
    lat: 34.0522,
    lng: -118.2437,
    address: "77 Energy Blvd, Los Angeles, CA",
    street: "77 Energy Blvd",
    city: "Los Angeles",
    state: "California",
    postalCode: "90015",
    country: "USA",
  },
  businessHours: [
    { dayOfWeek: "Monday", openTime: "5:00 AM", closeTime: "11:00 PM", isClosed: false },
    { dayOfWeek: "Tuesday", openTime: "5:00 AM", closeTime: "11:00 PM", isClosed: false },
    { dayOfWeek: "Wednesday", openTime: "5:00 AM", closeTime: "11:00 PM", isClosed: false },
    { dayOfWeek: "Thursday", openTime: "5:00 AM", closeTime: "11:00 PM", isClosed: false },
    { dayOfWeek: "Friday", openTime: "5:00 AM", closeTime: "9:00 PM", isClosed: false },
    { dayOfWeek: "Saturday", openTime: "7:00 AM", closeTime: "8:00 PM", isClosed: false },
    { dayOfWeek: "Sunday", openTime: "8:00 AM", closeTime: "6:00 PM", isClosed: false },
  ],
  acceptTerms: true,
},
{
  businessName: "ZenFlex Yoga Studio",
  businessType: "service",
  businessCategory: "gym",
  businessDescription:
    "Boutique yoga studio focusing on mindfulness, strength, and flexibility through modern and traditional practices.",
  establishedYear: "2019",
  numberOfEmployees: "8",
  annualRevenue: "300K USD",
  logo: "https://example.com/logos/zenflex.png",
  images: ["https://example.com/images/zenflex.jpg"],
  phone: "+1 646 909 7777",
  email: "hello@zenflex.com",
  website: "https://zenflex.com",
  socialMedia: {
    facebook: "",
    twitter: "",
    instagram: "https://instagram.com/zenflexyoga",
    linkedin: "",
    youtube: "",
  },
  location: {
    lat: 40.7128,
    lng: -74.006,
    address: "52 Harmony St, New York, NY",
    street: "52 Harmony St",
    city: "New York",
    state: "New York",
    postalCode: "10012",
    country: "USA",
  },
  businessHours: [
    { dayOfWeek: "Monday", openTime: "6:00 AM", closeTime: "8:00 PM", isClosed: false },
    { dayOfWeek: "Tuesday", openTime: "6:00 AM", closeTime: "8:00 PM", isClosed: false },
    { dayOfWeek: "Wednesday", openTime: "6:00 AM", closeTime: "8:00 PM", isClosed: false },
    { dayOfWeek: "Thursday", openTime: "6:00 AM", closeTime: "8:00 PM", isClosed: false },
    { dayOfWeek: "Friday", openTime: "6:00 AM", closeTime: "7:00 PM", isClosed: false },
    { dayOfWeek: "Saturday", openTime: "8:00 AM", closeTime: "6:00 PM", isClosed: false },
    { dayOfWeek: "Sunday", openTime: "8:00 AM", closeTime: "5:00 PM", isClosed: false },
  ],
  acceptTerms: true,
},

// ===========================
// CATEGORY: SALON
// ===========================
{
  businessName: "Glow & Grace Salon",
  businessType: "service",
  businessCategory: "salon",
  businessDescription:
    "Luxury beauty salon offering hair styling, spa treatments, and bridal makeovers.",
  establishedYear: "2016",
  numberOfEmployees: "12",
  annualRevenue: "400K USD",
  logo: "https://example.com/logos/glowgrace.png",
  images: ["https://example.com/images/glowgrace.jpg"],
  phone: "+1 718 987 1234",
  email: "appointments@glowgrace.com",
  website: "https://glowgrace.com",
  socialMedia: {
    facebook: "https://facebook.com/glowgrace",
    twitter: "",
    instagram: "https://instagram.com/glowgracesalon",
    linkedin: "",
    youtube: "",
  },
  location: {
    lat: 40.7306,
    lng: -73.9352,
    address: "14 Madison Ave, New York, NY",
    street: "14 Madison Ave",
    city: "New York",
    state: "New York",
    postalCode: "10016",
    country: "USA",
  },
  businessHours: [
    { dayOfWeek: "Monday", openTime: "10:00 AM", closeTime: "7:00 PM", isClosed: false },
    { dayOfWeek: "Tuesday", openTime: "10:00 AM", closeTime: "7:00 PM", isClosed: false },
    { dayOfWeek: "Wednesday", openTime: "10:00 AM", closeTime: "7:00 PM", isClosed: false },
    { dayOfWeek: "Thursday", openTime: "10:00 AM", closeTime: "8:00 PM", isClosed: false },
    { dayOfWeek: "Friday", openTime: "10:00 AM", closeTime: "8:00 PM", isClosed: false },
    { dayOfWeek: "Saturday", openTime: "9:00 AM", closeTime: "6:00 PM", isClosed: false },
    { dayOfWeek: "Sunday", openTime: "", closeTime: "", isClosed: true },
  ],
  acceptTerms: true,
},
{
  businessName: "Urban Clippers",
  businessType: "service",
  businessCategory: "salon",
  businessDescription:
    "Trendy unisex salon offering premium haircuts, beard grooming, and color treatments.",
  establishedYear: "2018",
  numberOfEmployees: "6",
  annualRevenue: "220K USD",
  logo: "https://example.com/logos/urbanclippers.png",
  images: ["https://example.com/images/urbanclippers.jpg"],
  phone: "+1 510 654 8787",
  email: "info@urbanclippers.com",
  website: "https://urbanclippers.com",
  socialMedia: {
    facebook: "",
    twitter: "",
    instagram: "https://instagram.com/urbanclippers",
    linkedin: "",
    youtube: "",
  },
  location: {
    lat: 37.8044,
    lng: -122.2712,
    address: "55 Broadway, Oakland, CA",
    street: "55 Broadway",
    city: "Oakland",
    state: "California",
    postalCode: "94607",
    country: "USA",
  },
  businessHours: [
    { dayOfWeek: "Monday", openTime: "10:00 AM", closeTime: "7:00 PM", isClosed: false },
    { dayOfWeek: "Tuesday", openTime: "10:00 AM", closeTime: "7:00 PM", isClosed: false },
    { dayOfWeek: "Wednesday", openTime: "10:00 AM", closeTime: "7:00 PM", isClosed: false },
    { dayOfWeek: "Thursday", openTime: "10:00 AM", closeTime: "8:00 PM", isClosed: false },
    { dayOfWeek: "Friday", openTime: "10:00 AM", closeTime: "8:00 PM", isClosed: false },
    { dayOfWeek: "Saturday", openTime: "9:00 AM", closeTime: "6:00 PM", isClosed: false },
    { dayOfWeek: "Sunday", openTime: "10:00 AM", closeTime: "5:00 PM", isClosed: false },
  ],
  acceptTerms: true,
},
{
  businessName: "Serenity Spa Lounge",
  businessType: "service",
  businessCategory: "salon",
  businessDescription:
    "Exclusive spa center offering massages, skincare, and wellness therapies for relaxation and rejuvenation.",
  establishedYear: "2021",
  numberOfEmployees: "9",
  annualRevenue: "350K USD",
  logo: "https://example.com/logos/serenityspa.png",
  images: ["https://example.com/images/serenityspa.jpg"],
  phone: "+1 305 555 2233",
  email: "relax@serenityspa.com",
  website: "https://serenityspa.com",
  socialMedia: {
    facebook: "",
    twitter: "",
    instagram: "https://instagram.com/serenityspalounge",
    linkedin: "",
    youtube: "",
  },
  location: {
    lat: 25.7617,
    lng: -80.1918,
    address: "22 Ocean Blvd, Miami, FL",
    street: "22 Ocean Blvd",
    city: "Miami",
    state: "Florida",
    postalCode: "33130",
    country: "USA",
  },
  businessHours: [
    { dayOfWeek: "Monday", openTime: "10:00 AM", closeTime: "8:00 PM", isClosed: false },
    { dayOfWeek: "Tuesday", openTime: "10:00 AM", closeTime: "8:00 PM", isClosed: false },
    { dayOfWeek: "Wednesday", openTime: "10:00 AM", closeTime: "8:00 PM", isClosed: false },
    { dayOfWeek: "Thursday", openTime: "10:00 AM", closeTime: "8:00 PM", isClosed: false },
    { dayOfWeek: "Friday", openTime: "10:00 AM", closeTime: "9:00 PM", isClosed: false },
    { dayOfWeek: "Saturday", openTime: "9:00 AM", closeTime: "9:00 PM", isClosed: false },
    { dayOfWeek: "Sunday", openTime: "10:00 AM", closeTime: "6:00 PM", isClosed: false },
  ],
  acceptTerms: true,
},
// 1️⃣ Salon — Urban Glow Studio
{
  businessName: "Urban Glow Studio",
  businessType: "service",
  businessCategory: "salon",
  businessDescription: "Luxury unisex salon offering premium hair, skincare, and spa treatments using organic products.",
  establishedYear: "2016",
  numberOfEmployees: "12",
  annualRevenue: "750K USD",
  logo: "https://example.com/logos/urban-glow.png",
  images: [
    "https://example.com/images/urban-glow-1.jpg",
    "https://example.com/images/urban-glow-2.jpg"
  ],
  phone: "+1 212 555 9821",
  email: "info@urbanglow.com",
  website: "https://urbanglow.com",
  socialMedia: {
    facebook: "https://facebook.com/urbanglow",
    twitter: "https://twitter.com/urbanglowstudio",
    instagram: "https://instagram.com/urbanglowstudio",
    linkedin: "",
    youtube: ""
  },
  location: {
    lat: 40.7549,
    lng: -73.9840,
    address: "14 Madison Ave, New York, NY 10010",
    street: "14 Madison Ave",
    city: "New York",
    state: "New York",
    postalCode: "10010",
    country: "USA"
  },
  businessHours: [
    { dayOfWeek: "Monday", openTime: "10:00 AM", closeTime: "08:00 PM", isClosed: false },
    { dayOfWeek: "Tuesday", openTime: "10:00 AM", closeTime: "08:00 PM", isClosed: false },
    { dayOfWeek: "Wednesday", openTime: "10:00 AM", closeTime: "08:00 PM", isClosed: false },
    { dayOfWeek: "Thursday", openTime: "10:00 AM", closeTime: "08:00 PM", isClosed: false },
    { dayOfWeek: "Friday", openTime: "10:00 AM", closeTime: "08:00 PM", isClosed: false },
    { dayOfWeek: "Saturday", openTime: "10:00 AM", closeTime: "06:00 PM", isClosed: false },
    { dayOfWeek: "Sunday", openTime: "", closeTime: "", isClosed: true }
  ],
  acceptTerms: true
},

// 2️⃣ Salon — Belle & Co.
{
  businessName: "Belle & Co.",
  businessType: "service",
  businessCategory: "salon",
  businessDescription: "A modern salon specializing in bridal makeup, styling, and grooming with expert professionals.",
  establishedYear: "2014",
  numberOfEmployees: "9",
  annualRevenue: "500K USD",
  logo: "https://example.com/logos/belle-co.png",
  images: [
    "https://example.com/images/belle-1.jpg",
    "https://example.com/images/belle-2.jpg"
  ],
  phone: "+44 208 444 5567",
  email: "hello@belleandco.uk",
  website: "https://belleandco.uk",
  socialMedia: {
    facebook: "https://facebook.com/belleandco",
    twitter: "",
    instagram: "https://instagram.com/belleandco_salon",
    linkedin: "",
    youtube: ""
  },
  location: {
    lat: 51.5072,
    lng: -0.1276,
    address: "88 Oxford Street, London W1D 1BS",
    street: "88 Oxford Street",
    city: "London",
    state: "England",
    postalCode: "W1D 1BS",
    country: "UK"
  },
  businessHours: [
    { dayOfWeek: "Monday", openTime: "09:00 AM", closeTime: "07:00 PM", isClosed: false },
    { dayOfWeek: "Tuesday", openTime: "09:00 AM", closeTime: "07:00 PM", isClosed: false },
    { dayOfWeek: "Wednesday", openTime: "09:00 AM", closeTime: "07:00 PM", isClosed: false },
    { dayOfWeek: "Thursday", openTime: "09:00 AM", closeTime: "07:00 PM", isClosed: false },
    { dayOfWeek: "Friday", openTime: "09:00 AM", closeTime: "07:00 PM", isClosed: false },
    { dayOfWeek: "Saturday", openTime: "10:00 AM", closeTime: "05:00 PM", isClosed: false },
    { dayOfWeek: "Sunday", openTime: "", closeTime: "", isClosed: true }
  ],
  acceptTerms: true
},

// 3️⃣ Salon — Men’s Den Barbershop
{
  businessName: "Men’s Den Barbershop",
  businessType: "service",
  businessCategory: "salon",
  businessDescription: "Classic barbershop experience with modern cuts, beard styling, and men’s grooming essentials.",
  establishedYear: "2019",
  numberOfEmployees: "6",
  annualRevenue: "350K USD",
  logo: "https://example.com/logos/mens-den.png",
  images: [
    "https://example.com/images/mens-den-1.jpg"
  ],
  phone: "+1 415 777 2288",
  email: "info@mensden.com",
  website: "",
  socialMedia: {
    facebook: "https://facebook.com/mensdenbarbers",
    twitter: "",
    instagram: "https://instagram.com/mensdenbarbers",
    linkedin: "",
    youtube: ""
  },
  location: {
    lat: 37.7799,
    lng: -122.4149,
    address: "22 Castro Street, San Francisco, CA",
    street: "22 Castro Street",
    city: "San Francisco",
    state: "California",
    postalCode: "94114",
    country: "USA"
  },
  businessHours: [
    { dayOfWeek: "Monday", openTime: "10:00 AM", closeTime: "07:00 PM", isClosed: false },
    { dayOfWeek: "Tuesday", openTime: "10:00 AM", closeTime: "07:00 PM", isClosed: false },
    { dayOfWeek: "Wednesday", openTime: "10:00 AM", closeTime: "07:00 PM", isClosed: false },
    { dayOfWeek: "Thursday", openTime: "10:00 AM", closeTime: "07:00 PM", isClosed: false },
    { dayOfWeek: "Friday", openTime: "10:00 AM", closeTime: "07:00 PM", isClosed: false },
    { dayOfWeek: "Saturday", openTime: "09:00 AM", closeTime: "04:00 PM", isClosed: false },
    { dayOfWeek: "Sunday", openTime: "", closeTime: "", isClosed: true }
  ],
  acceptTerms: true
},
// 1️⃣ Speedy Logistics
{
  businessName: "Speedy Logistics",
  businessType: "service",
  businessCategory: "transport",
  businessDescription:
    "Speedy Logistics provides efficient freight and cargo transport services across major Indian cities with real-time tracking.",
  establishedYear: "2012",
  numberOfEmployees: "60",
  annualRevenue: "5M USD",
  logo: "https://example.com/logos/speedy-logistics.png",
  images: [
    "https://example.com/images/truck-fleet.jpg",
    "https://example.com/images/warehouse.jpg"
  ],
  phone: "+91 98765 11223",
  email: "support@speedylogistics.in",
  website: "https://speedylogistics.in",
  socialMedia: {
    facebook: "https://facebook.com/speedylogistics",
    twitter: "https://twitter.com/speedylogistics",
    instagram: "",
    linkedin: "https://linkedin.com/company/speedylogistics",
    youtube: ""
  },
  location: {
    lat: 19.076,
    lng: 72.8777,
    address: "Plot 45, Andheri Industrial Area, Mumbai",
    street: "Plot 45, Andheri Industrial Area",
    city: "Mumbai",
    state: "Maharashtra",
    postalCode: "400053",
    country: "India"
  },
  businessHours: [
    { dayOfWeek: "Monday", openTime: "08:00 AM", closeTime: "08:00 PM", isClosed: false },
    { dayOfWeek: "Tuesday", openTime: "08:00 AM", closeTime: "08:00 PM", isClosed: false },
    { dayOfWeek: "Wednesday", openTime: "08:00 AM", closeTime: "08:00 PM", isClosed: false },
    { dayOfWeek: "Thursday", openTime: "08:00 AM", closeTime: "08:00 PM", isClosed: false },
    { dayOfWeek: "Friday", openTime: "08:00 AM", closeTime: "08:00 PM", isClosed: false },
    { dayOfWeek: "Saturday", openTime: "09:00 AM", closeTime: "05:00 PM", isClosed: false },
    { dayOfWeek: "Sunday", openTime: "", closeTime: "", isClosed: true }
  ],
  acceptTerms: true
},

// 2️⃣ GoCab Rides
{
  businessName: "GoCab Rides",
  businessType: "service",
  businessCategory: "transport",
  businessDescription:
    "App-based cab service providing affordable and comfortable rides with 24/7 availability and verified drivers.",
  establishedYear: "2018",
  numberOfEmployees: "150",
  annualRevenue: "12M USD",
  logo: "https://example.com/logos/gocab.png",
  images: [
    "https://example.com/images/gocab-1.jpg",
    "https://example.com/images/gocab-2.jpg"
  ],
  phone: "+91 99887 22110",
  email: "help@gocab.com",
  website: "https://gocab.com",
  socialMedia: {
    facebook: "https://facebook.com/gocab",
    twitter: "https://twitter.com/gocabapp",
    instagram: "https://instagram.com/gocab",
    linkedin: "",
    youtube: ""
  },
  location: {
    lat: 28.6139,
    lng: 77.209,
    address: "DLF Tower B, Connaught Place, New Delhi",
    street: "DLF Tower B",
    city: "New Delhi",
    state: "Delhi",
    postalCode: "110001",
    country: "India"
  },
  businessHours: [
    { dayOfWeek: "Monday", openTime: "00:00", closeTime: "11:59", isClosed: false },
    { dayOfWeek: "Tuesday", openTime: "00:00", closeTime: "11:59", isClosed: false },
    { dayOfWeek: "Wednesday", openTime: "00:00", closeTime: "11:59", isClosed: false },
    { dayOfWeek: "Thursday", openTime: "00:00", closeTime: "11:59", isClosed: false },
    { dayOfWeek: "Friday", openTime: "00:00", closeTime: "11:59", isClosed: false },
    { dayOfWeek: "Saturday", openTime: "00:00", closeTime: "11:59", isClosed: false },
    { dayOfWeek: "Sunday", openTime: "00:00", closeTime: "11:59", isClosed: false }
  ],
  acceptTerms: true
},

// 3️⃣ MoveMate Packers
{
  businessName: "MoveMate Packers",
  businessType: "service",
  businessCategory: "transport",
  businessDescription:
    "Professional home and office relocation services with safe packing, storage, and door-to-door delivery.",
  establishedYear: "2016",
  numberOfEmployees: "40",
  annualRevenue: "2M USD",
  logo: "https://example.com/logos/movemate.png",
  images: [
    "https://example.com/images/movemate-1.jpg"
  ],
  phone: "+91 90123 45678",
  email: "info@movemate.in",
  website: "https://movemate.in",
  socialMedia: {
    facebook: "https://facebook.com/movemateindia",
    twitter: "",
    instagram: "https://instagram.com/movemateindia",
    linkedin: "https://linkedin.com/company/movemate",
    youtube: ""
  },
  location: {
    lat: 12.9716,
    lng: 77.5946,
    address: "10 Residency Road, Bengaluru",
    street: "10 Residency Road",
    city: "Bengaluru",
    state: "Karnataka",
    postalCode: "560025",
    country: "India"
  },
  businessHours: [
    { dayOfWeek: "Monday", openTime: "09:00 AM", closeTime: "06:00 PM", isClosed: false },
    { dayOfWeek: "Tuesday", openTime: "09:00 AM", closeTime: "06:00 PM", isClosed: false },
    { dayOfWeek: "Wednesday", openTime: "09:00 AM", closeTime: "06:00 PM", isClosed: false },
    { dayOfWeek: "Thursday", openTime: "09:00 AM", closeTime: "06:00 PM", isClosed: false },
    { dayOfWeek: "Friday", openTime: "09:00 AM", closeTime: "06:00 PM", isClosed: false },
    { dayOfWeek: "Saturday", openTime: "10:00 AM", closeTime: "04:00 PM", isClosed: false },
    { dayOfWeek: "Sunday", openTime: "", closeTime: "", isClosed: true }
  ],
  acceptTerms: true
},
// 1️⃣ BrightMinds Academy
{
  businessName: "BrightMinds Academy",
  businessType: "service",
  businessCategory: "education",
  businessDescription:
    "Coaching institute providing personalized learning programs for school students and competitive exams.",
  establishedYear: "2015",
  numberOfEmployees: "25",
  annualRevenue: "1.2M USD",
  logo: "https://example.com/logos/brightminds.png",
  images: [
    "https://example.com/images/brightminds-1.jpg"
  ],
  phone: "+91 97654 22110",
  email: "info@brightminds.in",
  website: "https://brightminds.in",
  socialMedia: {
    facebook: "https://facebook.com/brightmindsacademy",
    twitter: "",
    instagram: "https://instagram.com/brightmindsacademy",
    linkedin: "",
    youtube: ""
  },
  location: {
    lat: 23.0225,
    lng: 72.5714,
    address: "Near C.G. Road, Ahmedabad",
    street: "C.G. Road",
    city: "Ahmedabad",
    state: "Gujarat",
    postalCode: "380009",
    country: "India"
  },
  businessHours: [
    { dayOfWeek: "Monday", openTime: "08:00 AM", closeTime: "07:00 PM", isClosed: false },
    { dayOfWeek: "Tuesday", openTime: "08:00 AM", closeTime: "07:00 PM", isClosed: false },
    { dayOfWeek: "Wednesday", openTime: "08:00 AM", closeTime: "07:00 PM", isClosed: false },
    { dayOfWeek: "Thursday", openTime: "08:00 AM", closeTime: "07:00 PM", isClosed: false },
    { dayOfWeek: "Friday", openTime: "08:00 AM", closeTime: "07:00 PM", isClosed: false },
    { dayOfWeek: "Saturday", openTime: "09:00 AM", closeTime: "05:00 PM", isClosed: false },
    { dayOfWeek: "Sunday", openTime: "", closeTime: "", isClosed: true }
  ],
  acceptTerms: true
},

// 2️⃣ CodeWave Institute
{
  businessName: "CodeWave Institute",
  businessType: "service",
  businessCategory: "education",
  businessDescription:
    "Leading programming and tech skills institute offering MERN stack, data science, and AI training programs.",
  establishedYear: "2019",
  numberOfEmployees: "18",
  annualRevenue: "900K USD",
  logo: "https://example.com/logos/codewave.png",
  images: [
    "https://example.com/images/codewave-1.jpg",
    "https://example.com/images/codewave-2.jpg"
  ],
  phone: "+91 99999 88877",
  email: "hello@codewave.in",
  website: "https://codewave.in",
  socialMedia: {
    facebook: "https://facebook.com/codewave",
    twitter: "https://twitter.com/codewave",
    instagram: "https://instagram.com/codewaveacademy",
    linkedin: "https://linkedin.com/company/codewave",
    youtube: "https://youtube.com/@codewave"
  },
  location: {
    lat: 13.0827,
    lng: 80.2707,
    address: "Anna Nagar, Chennai",
    street: "Anna Nagar",
    city: "Chennai",
    state: "Tamil Nadu",
    postalCode: "600040",
    country: "India"
  },
  businessHours: [
    { dayOfWeek: "Monday", openTime: "09:00 AM", closeTime: "07:00 PM", isClosed: false },
    { dayOfWeek: "Tuesday", openTime: "09:00 AM", closeTime: "07:00 PM", isClosed: false },
    { dayOfWeek: "Wednesday", openTime: "09:00 AM", closeTime: "07:00 PM", isClosed: false },
    { dayOfWeek: "Thursday", openTime: "09:00 AM", closeTime: "07:00 PM", isClosed: false },
    { dayOfWeek: "Friday", openTime: "09:00 AM", closeTime: "07:00 PM", isClosed: false },
    { dayOfWeek: "Saturday", openTime: "09:00 AM", closeTime: "05:00 PM", isClosed: false },
    { dayOfWeek: "Sunday", openTime: "", closeTime: "", isClosed: true }
  ],
  acceptTerms: true
},

// 3️⃣ Little Scholars Preschool
{
  businessName: "Little Scholars Preschool",
  businessType: "service",
  businessCategory: "education",
  businessDescription:
    "A nurturing preschool that focuses on early childhood learning, creativity, and social development.",
  establishedYear: "2017",
  numberOfEmployees: "15",
  annualRevenue: "400K USD",
  logo: "https://example.com/logos/littlescholars.png",
  images: [
    "https://example.com/images/littlescholars-1.jpg"
  ],
  phone: "+91 90888 33221",
  email: "contact@littlescholars.in",
  website: "https://littlescholars.in",
  socialMedia: {
    facebook: "https://facebook.com/littlescholars",
    twitter: "",
    instagram: "https://instagram.com/littlescholars",
    linkedin: "",
    youtube: ""
  },
  location: {
    lat: 22.5726,
    lng: 88.3639,
    address: "Salt Lake Sector V, Kolkata",
    street: "Salt Lake Sector V",
    city: "Kolkata",
    state: "West Bengal",
    postalCode: "700091",
    country: "India"
  },
  businessHours: [
    { dayOfWeek: "Monday", openTime: "08:00 AM", closeTime: "03:00 PM", isClosed: false },
    { dayOfWeek: "Tuesday", openTime: "08:00 AM", closeTime: "03:00 PM", isClosed: false },
    { dayOfWeek: "Wednesday", openTime: "08:00 AM", closeTime: "03:00 PM", isClosed: false },
    { dayOfWeek: "Thursday", openTime: "08:00 AM", closeTime: "03:00 PM", isClosed: false },
    { dayOfWeek: "Friday", openTime: "08:00 AM", closeTime: "03:00 PM", isClosed: false },
    { dayOfWeek: "Saturday", openTime: "", closeTime: "", isClosed: true },
    { dayOfWeek: "Sunday", openTime: "", closeTime: "", isClosed: true }
  ],
  acceptTerms: true
},
{
  businessName: "UrbanStyle Boutique",
  businessType: "product",
  businessCategory: "shopping",
  businessDescription:
    "Trendy clothing and accessories boutique offering curated urban fashion for men and women.",
  establishedYear: "2016",
  numberOfEmployees: "12",
  annualRevenue: "650K USD",
  logo: "https://example.com/logos/urbanstyle.png",
  images: [
    "https://example.com/images/storefront.jpg",
    "https://example.com/images/clothes-display.jpg"
  ],
  phone: "+1 213 555 7842",
  email: "info@urbanstyle.com",
  website: "https://urbanstyle.com",
  socialMedia: {
    facebook: "https://facebook.com/urbanstyle",
    twitter: "https://twitter.com/urbanstyle",
    instagram: "https://instagram.com/urbanstyle",
    linkedin: "",
    youtube: ""
  },
  location: {
    lat: 34.0522,
    lng: -118.2437,
    address: "112 Fashion Ave, Los Angeles, CA",
    street: "112 Fashion Ave",
    city: "Los Angeles",
    state: "California",
    postalCode: "90015",
    country: "USA"
  },
  businessHours: [
    { dayOfWeek: "Monday", openTime: "10:00 AM", closeTime: "08:00 PM", isClosed: false },
    { dayOfWeek: "Tuesday", openTime: "10:00 AM", closeTime: "08:00 PM", isClosed: false },
    { dayOfWeek: "Wednesday", openTime: "10:00 AM", closeTime: "08:00 PM", isClosed: false },
    { dayOfWeek: "Thursday", openTime: "10:00 AM", closeTime: "08:00 PM", isClosed: false },
    { dayOfWeek: "Friday", openTime: "10:00 AM", closeTime: "09:00 PM", isClosed: false },
    { dayOfWeek: "Saturday", openTime: "11:00 AM", closeTime: "09:00 PM", isClosed: false },
    { dayOfWeek: "Sunday", openTime: "11:00 AM", closeTime: "07:00 PM", isClosed: false }
  ],
  acceptTerms: true
}
,{
  businessName: "GadgetZone Electronics",
  businessType: "product",
  businessCategory: "shopping",
  businessDescription:
    "Authorized dealer for laptops, smartphones, and home electronics from top brands.",
  establishedYear: "2013",
  numberOfEmployees: "25",
  annualRevenue: "3.2M USD",
  logo: "https://example.com/logos/gadgetzone.png",
  images: [
    "https://example.com/images/electronics-store.jpg",
    "https://example.com/images/showroom.jpg"
  ],
  phone: "+1 718 987 3321",
  email: "support@gadgetzone.com",
  website: "https://gadgetzone.com",
  socialMedia: {
    facebook: "https://facebook.com/gadgetzone",
    twitter: "https://twitter.com/gadgetzone",
    instagram: "",
    linkedin: "https://linkedin.com/company/gadgetzone",
    youtube: ""
  },
  location: {
    lat: 40.6782,
    lng: -73.9442,
    address: "55 Main Street, Brooklyn, NY",
    street: "55 Main Street",
    city: "Brooklyn",
    state: "New York",
    postalCode: "11201",
    country: "USA"
  },
  businessHours: [
    { dayOfWeek: "Monday", openTime: "10:00 AM", closeTime: "07:00 PM", isClosed: false },
    { dayOfWeek: "Tuesday", openTime: "10:00 AM", closeTime: "07:00 PM", isClosed: false },
    { dayOfWeek: "Wednesday", openTime: "10:00 AM", closeTime: "07:00 PM", isClosed: false },
    { dayOfWeek: "Thursday", openTime: "10:00 AM", closeTime: "07:00 PM", isClosed: false },
    { dayOfWeek: "Friday", openTime: "10:00 AM", closeTime: "08:00 PM", isClosed: false },
    { dayOfWeek: "Saturday", openTime: "10:00 AM", closeTime: "08:00 PM", isClosed: false },
    { dayOfWeek: "Sunday", openTime: "", closeTime: "", isClosed: true }
  ],
  acceptTerms: true
}
,{
  businessName: "Bloom Floral Studio",
  businessType: "product",
  businessCategory: "shopping",
  businessDescription:
    "Creative floral design studio offering bouquets, event decorations, and plant arrangements.",
  establishedYear: "2019",
  numberOfEmployees: "8",
  annualRevenue: "380K USD",
  logo: "https://example.com/logos/bloomfloral.png",
  images: [
    "https://example.com/images/flower-shop.jpg",
    "https://example.com/images/wedding-flowers.jpg"
  ],
  phone: "+1 408 333 2244",
  email: "hello@bloomfloralstudio.com",
  website: "https://bloomfloralstudio.com",
  socialMedia: {
    facebook: "https://facebook.com/bloomfloral",
    twitter: "",
    instagram: "https://instagram.com/bloomfloralstudio",
    linkedin: "",
    youtube: ""
  },
  location: {
    lat: 37.3382,
    lng: -121.8863,
    address: "789 Blossom Ave, San Jose, CA",
    street: "789 Blossom Ave",
    city: "San Jose",
    state: "California",
    postalCode: "95126",
    country: "USA"
  },
  businessHours: [
    { dayOfWeek: "Monday", openTime: "09:30 AM", closeTime: "06:30 PM", isClosed: false },
    { dayOfWeek: "Tuesday", openTime: "09:30 AM", closeTime: "06:30 PM", isClosed: false },
    { dayOfWeek: "Wednesday", openTime: "09:30 AM", closeTime: "06:30 PM", isClosed: false },
    { dayOfWeek: "Thursday", openTime: "09:30 AM", closeTime: "06:30 PM", isClosed: false },
    { dayOfWeek: "Friday", openTime: "09:30 AM", closeTime: "06:30 PM", isClosed: false },
    { dayOfWeek: "Saturday", openTime: "10:00 AM", closeTime: "04:00 PM", isClosed: false },
    { dayOfWeek: "Sunday", openTime: "", closeTime: "", isClosed: true }
  ],
  acceptTerms: true
}
,{
  businessName: "CineWorld Multiplex",
  businessType: "service",
  businessCategory: "entertainment",
  businessDescription:
    "A state-of-the-art multiplex offering premium movie experiences with IMAX and Dolby Atmos sound.",
  establishedYear: "2010",
  numberOfEmployees: "80",
  annualRevenue: "8.5M USD",
  logo: "https://example.com/logos/cineworld.png",
  images: [
    "https://example.com/images/cinema-hall.jpg",
    "https://example.com/images/snack-counter.jpg"
  ],
  phone: "+1 305 876 4455",
  email: "info@cineworld.com",
  website: "https://cineworld.com",
  socialMedia: {
    facebook: "https://facebook.com/cineworld",
    twitter: "https://twitter.com/cineworld",
    instagram: "https://instagram.com/cineworld",
    linkedin: "",
    youtube: "https://youtube.com/@cineworld"
  },
  location: {
    lat: 25.7617,
    lng: -80.1918,
    address: "222 Ocean Blvd, Miami, FL",
    street: "222 Ocean Blvd",
    city: "Miami",
    state: "Florida",
    postalCode: "33130",
    country: "USA"
  },
  businessHours: [
    { dayOfWeek: "Monday", openTime: "11:00 AM", closeTime: "11:30 PM", isClosed: false },
    { dayOfWeek: "Tuesday", openTime: "11:00 AM", closeTime: "11:30 PM", isClosed: false },
    { dayOfWeek: "Wednesday", openTime: "11:00 AM", closeTime: "11:30 PM", isClosed: false },
    { dayOfWeek: "Thursday", openTime: "11:00 AM", closeTime: "11:30 PM", isClosed: false },
    { dayOfWeek: "Friday", openTime: "10:30 AM", closeTime: "12:00 AM", isClosed: false },
    { dayOfWeek: "Saturday", openTime: "10:30 AM", closeTime: "12:00 AM", isClosed: false },
    { dayOfWeek: "Sunday", openTime: "10:30 AM", closeTime: "11:00 PM", isClosed: false }
  ],
  acceptTerms: true
}
,{
  businessName: "GameZone Arcade",
  businessType: "service",
  businessCategory: "entertainment",
  businessDescription:
    "Indoor family entertainment center featuring arcade games, VR zones, and snack bars.",
  establishedYear: "2018",
  numberOfEmployees: "25",
  annualRevenue: "1.2M USD",
  logo: "https://example.com/logos/gamezone.png",
  images: [
    "https://example.com/images/arcade-games.jpg",
    "https://example.com/images/vr-zone.jpg"
  ],
  phone: "+1 416 662 9988",
  email: "contact@gamezonearcade.com",
  website: "https://gamezonearcade.com",
  socialMedia: {
    facebook: "https://facebook.com/gamezonearcade",
    twitter: "",
    instagram: "https://instagram.com/gamezonearcade",
    linkedin: "",
    youtube: ""
  },
  location: {
    lat: 43.65107,
    lng: -79.347015,
    address: "78 Queen Street, Toronto, ON",
    street: "78 Queen Street",
    city: "Toronto",
    state: "Ontario",
    postalCode: "M5C 1S2",
    country: "Canada"
  },
  businessHours: [
    { dayOfWeek: "Monday", openTime: "12:00 PM", closeTime: "10:00 PM", isClosed: false },
    { dayOfWeek: "Tuesday", openTime: "12:00 PM", closeTime: "10:00 PM", isClosed: false },
    { dayOfWeek: "Wednesday", openTime: "12:00 PM", closeTime: "10:00 PM", isClosed: false },
    { dayOfWeek: "Thursday", openTime: "12:00 PM", closeTime: "11:00 PM", isClosed: false },
    { dayOfWeek: "Friday", openTime: "12:00 PM", closeTime: "11:30 PM", isClosed: false },
    { dayOfWeek: "Saturday", openTime: "10:00 AM", closeTime: "11:30 PM", isClosed: false },
    { dayOfWeek: "Sunday", openTime: "10:00 AM", closeTime: "09:00 PM", isClosed: false }
  ],
  acceptTerms: true
}
,{
  businessName: "SkyBowl Bowling Alley",
  businessType: "service",
  businessCategory: "entertainment",
  businessDescription:
    "Modern bowling and sports lounge with neon lights, snack bar, and live DJ nights.",
  establishedYear: "2015",
  numberOfEmployees: "30",
  annualRevenue: "2.3M USD",
  logo: "https://example.com/logos/skybowl.png",
  images: [
    "https://example.com/images/bowling-lane.jpg",
    "https://example.com/images/lounge.jpg"
  ],
  phone: "+1 702 555 2222",
  email: "events@skybowl.com",
  website: "https://skybowl.com",
  socialMedia: {
    facebook: "https://facebook.com/skybowl",
    twitter: "https://twitter.com/skybowl",
    instagram: "https://instagram.com/skybowl",
    linkedin: "",
    youtube: ""
  },
  location: {
    lat: 36.1699,
    lng: -115.1398,
    address: "600 Fremont St, Las Vegas, NV",
    street: "600 Fremont St",
    city: "Las Vegas",
    state: "Nevada",
    postalCode: "89101",
    country: "USA"
  },
  businessHours: [
    { dayOfWeek: "Monday", openTime: "01:00 PM", closeTime: "11:00 PM", isClosed: false },
    { dayOfWeek: "Tuesday", openTime: "01:00 PM", closeTime: "11:00 PM", isClosed: false },
    { dayOfWeek: "Wednesday", openTime: "01:00 PM", closeTime: "11:00 PM", isClosed: false },
    { dayOfWeek: "Thursday", openTime: "01:00 PM", closeTime: "12:00 AM", isClosed: false },
    { dayOfWeek: "Friday", openTime: "12:00 PM", closeTime: "01:00 AM", isClosed: false },
    { dayOfWeek: "Saturday", openTime: "12:00 PM", closeTime: "01:00 AM", isClosed: false },
    { dayOfWeek: "Sunday", openTime: "12:00 PM", closeTime: "10:00 PM", isClosed: false }
  ],
  acceptTerms: true
}
,{
  businessName: "CleanWave Laundry",
  businessType: "service",
  businessCategory: "services",
  businessDescription:
    "Professional laundry and dry-cleaning service offering same-day delivery and eco-friendly detergents.",
  establishedYear: "2017",
  numberOfEmployees: "20",
  annualRevenue: "900K USD",
  logo: "https://example.com/logos/cleanwave.png",
  images: [
    "https://example.com/images/laundry-shop.jpg",
    "https://example.com/images/washing-machines.jpg"
  ],
  phone: "+1 646 777 4411",
  email: "support@cleanwave.com",
  website: "https://cleanwave.com",
  socialMedia: {
    facebook: "https://facebook.com/cleanwave",
    twitter: "",
    instagram: "https://instagram.com/cleanwave",
    linkedin: "",
    youtube: ""
  },
  location: {
    lat: 40.73061,
    lng: -73.935242,
    address: "234 2nd Ave, New York, NY",
    street: "234 2nd Ave",
    city: "New York",
    state: "New York",
    postalCode: "10003",
    country: "USA"
  },
  businessHours: [
    { dayOfWeek: "Monday", openTime: "08:00 AM", closeTime: "09:00 PM", isClosed: false },
    { dayOfWeek: "Tuesday", openTime: "08:00 AM", closeTime: "09:00 PM", isClosed: false },
    { dayOfWeek: "Wednesday", openTime: "08:00 AM", closeTime: "09:00 PM", isClosed: false },
    { dayOfWeek: "Thursday", openTime: "08:00 AM", closeTime: "09:00 PM", isClosed: false },
    { dayOfWeek: "Friday", openTime: "08:00 AM", closeTime: "09:00 PM", isClosed: false },
    { dayOfWeek: "Saturday", openTime: "09:00 AM", closeTime: "07:00 PM", isClosed: false },
    { dayOfWeek: "Sunday", openTime: "", closeTime: "", isClosed: true }
  ],
  acceptTerms: true
}
,{
  businessName: "Sparkle Home Cleaning",
  businessType: "service",
  businessCategory: "services",
  businessDescription:
    "Residential and commercial cleaning service specializing in deep cleaning, sanitization, and move-in/out services.",
  establishedYear: "2015",
  numberOfEmployees: "40",
  annualRevenue: "1.5M USD",
  logo: "https://example.com/logos/sparklehome.png",
  images: [
    "https://example.com/images/home-cleaning.jpg",
    "https://example.com/images/team-cleaning.jpg"
  ],
  phone: "+1 512 555 9833",
  email: "hello@sparklehome.com",
  website: "https://sparklehome.com",
  socialMedia: {
    facebook: "https://facebook.com/sparklehome",
    twitter: "",
    instagram: "https://instagram.com/sparklehome",
    linkedin: "",
    youtube: ""
  },
  location: {
    lat: 30.2672,
    lng: -97.7431,
    address: "890 Pine Road, Austin, TX",
    street: "890 Pine Road",
    city: "Austin",
    state: "Texas",
    postalCode: "78701",
    country: "USA"
  },
  businessHours: [
    { dayOfWeek: "Monday", openTime: "08:00 AM", closeTime: "06:00 PM", isClosed: false },
    { dayOfWeek: "Tuesday", openTime: "08:00 AM", closeTime: "06:00 PM", isClosed: false },
    { dayOfWeek: "Wednesday", openTime: "08:00 AM", closeTime: "06:00 PM", isClosed: false },
    { dayOfWeek: "Thursday", openTime: "08:00 AM", closeTime: "06:00 PM", isClosed: false },
    { dayOfWeek: "Friday", openTime: "08:00 AM", closeTime: "06:00 PM", isClosed: false },
    { dayOfWeek: "Saturday", openTime: "09:00 AM", closeTime: "04:00 PM", isClosed: false },
    { dayOfWeek: "Sunday", openTime: "", closeTime: "", isClosed: true }
  ],
  acceptTerms: true
}
,{
  businessName: "FixIt Handyman Services",
  businessType: "service",
  businessCategory: "services",
  businessDescription:
    "Reliable on-demand handyman service for plumbing, electrical, carpentry, and repair work.",
  establishedYear: "2019",
  numberOfEmployees: "15",
  annualRevenue: "700K USD",
  logo: "https://example.com/logos/fixit.png",
  images: [
    "https://example.com/images/handyman.jpg",
    "https://example.com/images/tools.jpg"
  ],
  phone: "+1 720 333 1122",
  email: "book@fixitservices.com",
  website: "https://fixitservices.com",
  socialMedia: {
    facebook: "https://facebook.com/fixitservices",
    twitter: "",
    instagram: "https://instagram.com/fixitservices",
    linkedin: "",
    youtube: ""
  },
  location: {
    lat: 39.7392,
    lng: -104.9903,
    address: "555 Cherry Blvd, Denver, CO",
    street: "555 Cherry Blvd",
    city: "Denver",
    state: "Colorado",
    postalCode: "80202",
    country: "USA"
  },
  businessHours: [
    { dayOfWeek: "Monday", openTime: "09:00 AM", closeTime: "06:00 PM", isClosed: false },
    { dayOfWeek: "Tuesday", openTime: "09:00 AM", closeTime: "06:00 PM", isClosed: false },
    { dayOfWeek: "Wednesday", openTime: "09:00 AM", closeTime: "06:00 PM", isClosed: false },
    { dayOfWeek: "Thursday", openTime: "09:00 AM", closeTime: "06:00 PM", isClosed: false },
    { dayOfWeek: "Friday", openTime: "09:00 AM", closeTime: "06:00 PM", isClosed: false },
    { dayOfWeek: "Saturday", openTime: "10:00 AM", closeTime: "03:00 PM", isClosed: false },
    { dayOfWeek: "Sunday", openTime: "", closeTime: "", isClosed: true }
  ],
  acceptTerms: true
}
,{
  businessName: "GreenLeaf Consulting",
  businessType: "service",
  businessCategory: "other",
  businessDescription:
    "A strategic business consulting firm helping startups and SMEs improve operations, marketing, and financial performance.",
  establishedYear: "2014",
  numberOfEmployees: "25",
  annualRevenue: "1.8M USD",
  logo: "https://example.com/logos/greenleaf.png",
  images: [
    "https://example.com/images/consulting-office.jpg",
    "https://example.com/images/team-meeting.jpg"
  ],
  phone: "+1 212 555 9876",
  email: "contact@greenleafconsulting.com",
  website: "https://greenleafconsulting.com",
  socialMedia: {
    facebook: "https://facebook.com/greenleafconsulting",
    twitter: "",
    instagram: "",
    linkedin: "https://linkedin.com/company/greenleafconsulting",
    youtube: ""
  },
  location: {
    lat: 40.7128,
    lng: -74.006,
    address: "99 Wall Street, New York, NY",
    street: "99 Wall Street",
    city: "New York",
    state: "New York",
    postalCode: "10005",
    country: "USA"
  },
  businessHours: [
    { dayOfWeek: "Monday", openTime: "09:00 AM", closeTime: "06:00 PM", isClosed: false },
    { dayOfWeek: "Tuesday", openTime: "09:00 AM", closeTime: "06:00 PM", isClosed: false },
    { dayOfWeek: "Wednesday", openTime: "09:00 AM", closeTime: "06:00 PM", isClosed: false },
    { dayOfWeek: "Thursday", openTime: "09:00 AM", closeTime: "06:00 PM", isClosed: false },
    { dayOfWeek: "Friday", openTime: "09:00 AM", closeTime: "05:00 PM", isClosed: false },
    { dayOfWeek: "Saturday", openTime: "", closeTime: "", isClosed: true },
    { dayOfWeek: "Sunday", openTime: "", closeTime: "", isClosed: true }
  ],
  acceptTerms: true
}
,{
  businessName: "BrightPixel Digital Agency",
  businessType: "service",
  businessCategory: "other",
  businessDescription:
    "Creative digital marketing agency specializing in web design, SEO, and social media strategy for brands worldwide.",
  establishedYear: "2019",
  numberOfEmployees: "35",
  annualRevenue: "2.4M USD",
  logo: "https://example.com/logos/brightpixel.png",
  images: [
    "https://example.com/images/digital-agency.jpg",
    "https://example.com/images/creative-team.jpg"
  ],
  phone: "+1 503 777 2255",
  email: "hello@brightpixel.com",
  website: "https://brightpixel.com",
  socialMedia: {
    facebook: "https://facebook.com/brightpixel",
    twitter: "https://twitter.com/brightpixel",
    instagram: "https://instagram.com/brightpixel",
    linkedin: "https://linkedin.com/company/brightpixel",
    youtube: ""
  },
  location: {
    lat: 45.5152,
    lng: -122.6784,
    address: "789 Morrison St, Portland, OR",
    street: "789 Morrison St",
    city: "Portland",
    state: "Oregon",
    postalCode: "97205",
    country: "USA"
  },
  businessHours: [
    { dayOfWeek: "Monday", openTime: "10:00 AM", closeTime: "07:00 PM", isClosed: false },
    { dayOfWeek: "Tuesday", openTime: "10:00 AM", closeTime: "07:00 PM", isClosed: false },
    { dayOfWeek: "Wednesday", openTime: "10:00 AM", closeTime: "07:00 PM", isClosed: false },
    { dayOfWeek: "Thursday", openTime: "10:00 AM", closeTime: "07:00 PM", isClosed: false },
    { dayOfWeek: "Friday", openTime: "10:00 AM", closeTime: "06:00 PM", isClosed: false },
    { dayOfWeek: "Saturday", openTime: "11:00 AM", closeTime: "03:00 PM", isClosed: false },
    { dayOfWeek: "Sunday", openTime: "", closeTime: "", isClosed: true }
  ],
  acceptTerms: true
}
,{
  businessName: "HelpingHands Foundation",
  businessType: "service",
  businessCategory: "other",
  businessDescription:
    "A non-profit organization dedicated to community welfare, education for underprivileged children, and healthcare awareness.",
  establishedYear: "2012",
  numberOfEmployees: "18",
  annualRevenue: "450K USD",
  logo: "https://example.com/logos/helpinghands.png",
  images: [
    "https://example.com/images/charity-event.jpg",
    "https://example.com/images/volunteers.jpg"
  ],
  phone: "+1 408 666 8833",
  email: "support@helpinghands.org",
  website: "https://helpinghands.org",
  socialMedia: {
    facebook: "https://facebook.com/helpinghandsfoundation",
    twitter: "",
    instagram: "https://instagram.com/helpinghandsfoundation",
    linkedin: "",
    youtube: ""
  },
  location: {
    lat: 37.7749,
    lng: -122.4194,
    address: "123 Hope Street, San Francisco, CA",
    street: "123 Hope Street",
    city: "San Francisco",
    state: "California",
    postalCode: "94103",
    country: "USA"
  },
  businessHours: [
    { dayOfWeek: "Monday", openTime: "09:00 AM", closeTime: "05:00 PM", isClosed: false },
    { dayOfWeek: "Tuesday", openTime: "09:00 AM", closeTime: "05:00 PM", isClosed: false },
    { dayOfWeek: "Wednesday", openTime: "09:00 AM", closeTime: "05:00 PM", isClosed: false },
    { dayOfWeek: "Thursday", openTime: "09:00 AM", closeTime: "05:00 PM", isClosed: false },
    { dayOfWeek: "Friday", openTime: "09:00 AM", closeTime: "05:00 PM", isClosed: false },
    { dayOfWeek: "Saturday", openTime: "", closeTime: "", isClosed: true },
    { dayOfWeek: "Sunday", openTime: "", closeTime: "", isClosed: true }
  ],
  acceptTerms: true
}
,
];
 

// Base API URL
const BASE_URL = "https://organic-succotash-56jgpj4v67v3p4vx-5000.app.github.dev/api/v1";

// Axios instance
const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Helper function for logging
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const uploadSampleBusinesses = async () => {
  for (const formData of sampleBusinesses) {
    try {
      console.log(`\n📦 Registering: ${formData.businessName} (${formData.businessCategory})`);

      // STEP 1: Register Basic Info
      const registerBusinessInfo = {
        name: formData.businessName,
        type: formData.businessType,
        category: formData.businessCategory,
        description: formData.businessDescription,
        establishedYear: formData.establishedYear,
        numberOfEmployees: formData.numberOfEmployees,
        annualRevenue: formData.annualRevenue,
        logo: formData.logo,
        images: formData.images,
      };

      const { data: business } = await axiosInstance.post(`/business/register`, registerBusinessInfo);

      if (!business || !business._id) {
        throw new Error("Business registration failed");
      }

      const businessId = business._id;
      console.log("✅ Business created:", businessId);

      // STEP 2: Register Contact Info
      const contactData = {
        businessId,
        phone: formData.phone,
        email: formData.email,
        website: formData.website,
        socialMedia: formData.socialMedia,
      };
      await axiosInstance.post(`/business-contact/${businessId}`, contactData);
      console.log("📞 Contact info added");

      // STEP 3: Register Location
      const locationData = {
        businessId,
        lat: formData.location.lat,
        lng: formData.location.lng,
        address: formData.location.address,
        street: formData.location.street,
        city: formData.location.city,
        state: formData.location.state,
        postalCode: formData.location.postalCode,
        country: formData.location.country,
      };
      await axiosInstance.post(`/business-location/${businessId}`, locationData);
      console.log("📍 Location info added");

      // STEP 4: Register Business Hours
      for (const day of formData.businessHours) {
        const hoursData = {
          businessId,
          dayOfWeek: day.dayOfWeek,
          openTime: day.isClosed ? null : day.openTime,
          closeTime: day.isClosed ? null : day.closeTime,
          isClosed: day.isClosed,
        };
        await axiosInstance.post(`/business-hours/${businessId}`, hoursData);
      }
      console.log("⏰ Hours info added");

      console.log(`✅ Successfully uploaded: ${formData.businessName}`);

      // Optional delay to avoid rate limiting
      await wait(500);
    } catch (err) {
      console.error(`❌ Error uploading "${formData.businessName}":`, err.response?.data || err.message);
    }
  }

  console.log("\n🎉 All sample businesses uploaded successfully!");
};

// Run the upload
uploadSampleBusinesses();