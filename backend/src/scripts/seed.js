/* eslint-disable no-console */
const { connectDB } = require('../config/db');
const { config } = require('../config/env');
const { User } = require('../modules/users/user.model');
const { Supplier } = require('../modules/suppliers/supplier.model');
const { Drug } = require('../modules/drugs/drug.model');
const { Order } = require('../modules/orders/order.model');
const { hashPassword } = require('../modules/auth/auth.service');
const { ROLES } = require('../constants/roles');

const seed = async () => {
  try {
    await connectDB();
    console.log('🌱 Seeding database...');

    // Clear existing data
    await Promise.all([
      User.deleteMany({}),
      Supplier.deleteMany({}),
      Drug.deleteMany({}),
      Order.deleteMany({}),
    ]);

    console.log('✅ Cleared existing data');

    // Create users
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@pharmacy.com',
      password: await hashPassword('Admin@123'),
      role: ROLES.ADMIN,
      phone: '+1-555-0100',
    });

    const pharmacists = await User.insertMany([
      {
        name: 'Dr. Sarah Johnson',
        email: 'sarah@pharmacy.com',
        password: await hashPassword('Pharma@123'),
        role: ROLES.PHARMACIST,
        phone: '+1-555-0101',
      },
      {
        name: 'Dr. Michael Chen',
        email: 'michael@pharmacy.com',
        password: await hashPassword('Pharma@123'),
        role: ROLES.PHARMACIST,
        phone: '+1-555-0102',
      },
      {
        name: 'Dr. Emily Rodriguez',
        email: 'emily@pharmacy.com',
        password: await hashPassword('Pharma@123'),
        role: ROLES.PHARMACIST,
        phone: '+1-555-0103',
      },
    ]);

    console.log('✅ Created users');

    // Create suppliers
    const suppliers = await Supplier.insertMany([
      {
        name: 'John Smith',
        company: 'Health Supplies Ltd',
        contactEmail: 'contact@healthsupplies.com',
        contactPhone: '+1-555-1000',
        address: '123 Health St, Wellness City, CA 90210',
      },
      {
        name: 'Maria Garcia',
        company: 'PharmaSource Inc',
        contactEmail: 'sales@pharmasource.com',
        contactPhone: '+1-555-1001',
        address: '456 Care Ave, Medic Town, NY 10001',
      },
      {
        name: 'David Lee',
        company: 'MediCorp Pharmaceuticals',
        contactEmail: 'info@medicorp.com',
        contactPhone: '+1-555-1002',
        address: '789 Medical Blvd, Health District, TX 75001',
      },
      {
        name: 'Lisa Anderson',
        company: 'Global Pharma Solutions',
        contactEmail: 'contact@globalpharma.com',
        contactPhone: '+1-555-1003',
        address: '321 Wellness Way, Care City, FL 33101',
      },
      {
        name: 'Robert Taylor',
        company: 'Prime Medical Supplies',
        contactEmail: 'sales@primemedical.com',
        contactPhone: '+1-555-1004',
        address: '654 Pharmacy Lane, Treatment Town, IL 60601',
      },
    ]);

    console.log('✅ Created suppliers');

    // Helper function to calculate status based on quantity and expiry
    const getDrugStatus = (quantity, expiryDate) => {
      const now = new Date();
      const daysUntilExpiry = Math.floor((expiryDate - now) / (1000 * 60 * 60 * 24));
      
      if (daysUntilExpiry < 0) return 'expired';
      if (quantity === 0) return 'out-of-stock';
      if (quantity < 20) return 'low-stock';
      return 'in-stock';
    };

    // Create drugs with varied data
    const drugData = [
      // Antibiotics
      { name: 'Amoxicillin 500mg', category: 'Antibiotic', price: 12.50, quantity: 150, expiryDays: 365, supplier: 0, description: 'Broad-spectrum antibiotic for bacterial infections' },
      { name: 'Azithromycin 250mg', category: 'Antibiotic', price: 18.75, quantity: 85, expiryDays: 730, supplier: 1, description: 'Macrolide antibiotic for respiratory infections' },
      { name: 'Ciprofloxacin 500mg', category: 'Antibiotic', price: 15.00, quantity: 120, expiryDays: 450, supplier: 0, description: 'Fluoroquinolone antibiotic' },
      { name: 'Doxycycline 100mg', category: 'Antibiotic', price: 14.25, quantity: 95, expiryDays: 600, supplier: 2, description: 'Tetracycline antibiotic' },
      { name: 'Penicillin V 250mg', category: 'Antibiotic', price: 10.50, quantity: 200, expiryDays: 365, supplier: 1, description: 'Penicillin antibiotic' },
      
      // Pain Relief
      { name: 'Ibuprofen 400mg', category: 'Pain Relief', price: 8.00, quantity: 300, expiryDays: 730, supplier: 2, description: 'NSAID for pain and inflammation' },
      { name: 'Acetaminophen 500mg', category: 'Pain Relief', price: 6.50, quantity: 250, expiryDays: 730, supplier: 3, description: 'Pain reliever and fever reducer' },
      { name: 'Naproxen 500mg', category: 'Pain Relief', price: 9.75, quantity: 180, expiryDays: 600, supplier: 2, description: 'NSAID for chronic pain' },
      { name: 'Aspirin 325mg', category: 'Pain Relief', price: 5.25, quantity: 400, expiryDays: 730, supplier: 3, description: 'Pain reliever and blood thinner' },
      { name: 'Tramadol 50mg', category: 'Pain Relief', price: 22.00, quantity: 75, expiryDays: 365, supplier: 0, description: 'Opioid pain medication' },
      
      // Cardiovascular
      { name: 'Atorvastatin 20mg', category: 'Cardiovascular', price: 25.00, quantity: 140, expiryDays: 730, supplier: 1, description: 'Cholesterol-lowering medication' },
      { name: 'Lisinopril 10mg', category: 'Cardiovascular', price: 18.50, quantity: 160, expiryDays: 600, supplier: 1, description: 'ACE inhibitor for blood pressure' },
      { name: 'Metoprolol 50mg', category: 'Cardiovascular', price: 16.75, quantity: 130, expiryDays: 730, supplier: 2, description: 'Beta blocker for heart conditions' },
      { name: 'Amlodipine 5mg', category: 'Cardiovascular', price: 19.25, quantity: 110, expiryDays: 450, supplier: 1, description: 'Calcium channel blocker' },
      { name: 'Warfarin 5mg', category: 'Cardiovascular', price: 12.00, quantity: 90, expiryDays: 365, supplier: 0, description: 'Blood thinner anticoagulant' },
      
      // Diabetes
      { name: 'Metformin 500mg', category: 'Diabetes', price: 11.50, quantity: 200, expiryDays: 730, supplier: 3, description: 'Type 2 diabetes medication' },
      { name: 'Insulin Glargine', category: 'Diabetes', price: 85.00, quantity: 45, expiryDays: 180, supplier: 4, description: 'Long-acting insulin' },
      { name: 'Gliclazide 80mg', category: 'Diabetes', price: 14.00, quantity: 100, expiryDays: 600, supplier: 3, description: 'Sulfonylurea for diabetes' },
      { name: 'Sitagliptin 100mg', category: 'Diabetes', price: 32.50, quantity: 80, expiryDays: 730, supplier: 4, description: 'DPP-4 inhibitor' },
      
      // Respiratory
      { name: 'Albuterol Inhaler', category: 'Respiratory', price: 35.00, quantity: 60, expiryDays: 365, supplier: 4, description: 'Bronchodilator for asthma' },
      { name: 'Montelukast 10mg', category: 'Respiratory', price: 28.00, quantity: 95, expiryDays: 730, supplier: 3, description: 'Asthma and allergy medication' },
      { name: 'Prednisone 20mg', category: 'Respiratory', price: 13.75, quantity: 150, expiryDays: 600, supplier: 2, description: 'Corticosteroid for inflammation' },
      
      // Gastrointestinal
      { name: 'Omeprazole 20mg', category: 'Gastrointestinal', price: 16.00, quantity: 180, expiryDays: 730, supplier: 2, description: 'Proton pump inhibitor for acid reflux' },
      { name: 'Ranitidine 150mg', category: 'Gastrointestinal', price: 9.50, quantity: 120, expiryDays: 600, supplier: 3, description: 'H2 blocker for stomach acid' },
      { name: 'Loperamide 2mg', category: 'Gastrointestinal', price: 7.25, quantity: 200, expiryDays: 730, supplier: 3, description: 'Anti-diarrheal medication' },
      
      // Mental Health
      { name: 'Sertraline 50mg', category: 'Mental Health', price: 24.00, quantity: 110, expiryDays: 730, supplier: 1, description: 'SSRI antidepressant' },
      { name: 'Fluoxetine 20mg', category: 'Mental Health', price: 22.50, quantity: 100, expiryDays: 600, supplier: 1, description: 'SSRI antidepressant' },
      { name: 'Lorazepam 1mg', category: 'Mental Health', price: 18.00, quantity: 65, expiryDays: 365, supplier: 0, description: 'Benzodiazepine for anxiety' },
      
      // Low stock items
      { name: 'Morphine 10mg', category: 'Pain Relief', price: 45.00, quantity: 15, expiryDays: 200, supplier: 0, description: 'Strong opioid pain medication' },
      { name: 'Fentanyl Patch', category: 'Pain Relief', price: 120.00, quantity: 8, expiryDays: 150, supplier: 4, description: 'Transdermal opioid patch' },
      { name: 'Epinephrine Auto-Injector', category: 'Emergency', price: 95.00, quantity: 12, expiryDays: 300, supplier: 4, description: 'Emergency allergy treatment' },
      
      // Expired items (for testing)
      { name: 'Expired Drug A', category: 'Antibiotic', price: 10.00, quantity: 5, expiryDays: -30, supplier: 0, description: 'Expired medication for testing' },
      { name: 'Expired Drug B', category: 'Pain Relief', price: 8.00, quantity: 3, expiryDays: -60, supplier: 1, description: 'Expired medication for testing' },
    ];

    const drugs = await Drug.insertMany(
      drugData.map((drug) => {
        const expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + drug.expiryDays);
        return {
          name: drug.name,
          category: drug.category,
          price: drug.price,
          quantity: drug.quantity,
          expiryDate,
          supplier: suppliers[drug.supplier]._id,
          description: drug.description,
          status: getDrugStatus(drug.quantity, expiryDate),
        };
      })
    );

    console.log('✅ Created drugs');

    // Create orders with varied data
    const customerNames = [
      'John Doe', 'Jane Smith', 'Michael Johnson', 'Sarah Williams',
      'David Brown', 'Emily Davis', 'Robert Miller', 'Lisa Wilson',
      'James Moore', 'Patricia Taylor', 'William Anderson', 'Linda Thomas',
      'Richard Jackson', 'Barbara White', 'Joseph Harris', 'Susan Martin',
      'Thomas Thompson', 'Jessica Garcia', 'Charles Martinez', 'Karen Robinson',
    ];

    const orderStatuses = ['pending', 'fulfilled', 'cancelled'];
    const orders = [];

    // Create 50 orders
    for (let i = 0; i < 50; i++) {
      const randomDrug = drugs[Math.floor(Math.random() * drugs.length)];
      const randomPharmacist = pharmacists[Math.floor(Math.random() * pharmacists.length)];
      const randomCustomer = customerNames[Math.floor(Math.random() * customerNames.length)];
      const randomStatus = orderStatuses[Math.floor(Math.random() * orderStatuses.length)];
      const orderDate = new Date();
      orderDate.setDate(orderDate.getDate() - Math.floor(Math.random() * 30)); // Random date in last 30 days

      orders.push({
        drug: randomDrug._id,
        quantity: Math.floor(Math.random() * 10) + 1,
        customerName: randomCustomer,
        orderDate,
        pharmacist: randomPharmacist._id,
        status: randomStatus,
      });
    }

    await Order.insertMany(orders);

    console.log('✅ Created orders');

    console.log('\n📊 Seed Summary:');
    console.log(`   Users: ${await User.countDocuments()}`);
    console.log(`   Suppliers: ${await Supplier.countDocuments()}`);
    console.log(`   Drugs: ${await Drug.countDocuments()}`);
    console.log(`   Orders: ${await Order.countDocuments()}`);
    console.log('\n✨ Seed completed successfully!');
    console.log('\n🔑 Login Credentials:');
    console.log('   Admin: admin@pharmacy.com / Admin@123');
    console.log('   Pharmacist: sarah@pharmacy.com / Pharma@123');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed failed:', error);
    process.exit(1);
  }
};

seed();
