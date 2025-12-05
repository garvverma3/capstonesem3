const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Seeding database...');

    // Create admin user
    const adminPassword = await bcrypt.hash('admin123', 10);
    const admin = await prisma.user.upsert({
        where: { email: 'admin@pharmacy.com' },
        update: {},
        create: {
            email: 'admin@pharmacy.com',
            password: adminPassword,
            name: 'Admin User',
            role: 'admin',
            phone: '9876543210',
        },
    });
    console.log('✅ Created admin user:', admin.email);

    // Create pharmacist user
    const pharmacistPassword = await bcrypt.hash('pharmacist123', 10);
    const pharmacist = await prisma.user.upsert({
        where: { email: 'pharmacist@pharmacy.com' },
        update: {},
        create: {
            email: 'pharmacist@pharmacy.com',
            password: pharmacistPassword,
            name: 'John Pharmacist',
            role: 'pharmacist',
            phone: '9876543211',
        },
    });
    console.log('✅ Created pharmacist user:', pharmacist.email);

    // Create suppliers
    const supplier1 = await prisma.supplier.upsert({
        where: { email: 'contact@pharmaco.com' },
        update: {},
        create: {
            name: 'PharmaCo Inc',
            email: 'contact@pharmaco.com',
            phone: '1234567890',
            address: '123 Medical Plaza, New York, NY 10001',
        },
    });

    const supplier2 = await prisma.supplier.upsert({
        where: { email: 'info@medisupply.com' },
        update: {},
        create: {
            name: 'MediSupply Corp',
            email: 'info@medisupply.com',
            phone: '1234567891',
            address: '456 Health Street, Los Angeles, CA 90001',
        },
    });

    const supplier3 = await prisma.supplier.upsert({
        where: { email: 'sales@healthdist.com' },
        update: {},
        create: {
            name: 'HealthDist Ltd',
            email: 'sales@healthdist.com',
            phone: '1234567892',
            address: '789 Wellness Ave, Chicago, IL 60601',
        },
    });

    console.log('✅ Created 3 suppliers');

    // Create drugs
    const drugs = [
        {
            name: 'Aspirin 500mg',
            category: 'Pain Relief',
            quantity: 500,
            price: 9.99,
            supplierId: supplier1.id,
            expiryDate: new Date('2025-12-31'),
            status: 'in_stock',
        },
        {
            name: 'Ibuprofen 400mg',
            category: 'Pain Relief',
            quantity: 300,
            price: 12.99,
            supplierId: supplier1.id,
            expiryDate: new Date('2025-10-15'),
            status: 'in_stock',
        },
        {
            name: 'Amoxicillin 250mg',
            category: 'Antibiotic',
            quantity: 200,
            price: 24.99,
            supplierId: supplier2.id,
            expiryDate: new Date('2025-08-20'),
            status: 'in_stock',
        },
        {
            name: 'Lisinopril 10mg',
            category: 'Blood Pressure',
            quantity: 150,
            price: 18.99,
            supplierId: supplier2.id,
            expiryDate: new Date('2026-03-15'),
            status: 'in_stock',
        },
        {
            name: 'Metformin 500mg',
            category: 'Diabetes',
            quantity: 400,
            price: 15.99,
            supplierId: supplier3.id,
            expiryDate: new Date('2025-11-30'),
            status: 'in_stock',
        },
        {
            name: 'Omeprazole 20mg',
            category: 'Digestive',
            quantity: 25,
            price: 22.99,
            supplierId: supplier3.id,
            expiryDate: new Date('2025-09-10'),
            status: 'low_stock',
        },
        {
            name: 'Atorvastatin 20mg',
            category: 'Cholesterol',
            quantity: 180,
            price: 28.99,
            supplierId: supplier1.id,
            expiryDate: new Date('2026-01-25'),
            status: 'in_stock',
        },
        {
            name: 'Levothyroxine 50mcg',
            category: 'Thyroid',
            quantity: 8,
            price: 16.99,
            supplierId: supplier2.id,
            expiryDate: new Date('2025-07-05'),
            status: 'low_stock',
        },
    ];

    for (const drug of drugs) {
        await prisma.drug.create({ data: drug });
    }

    console.log('✅ Created 8 drugs');

    console.log('\n📊 Database seeded successfully!');
    console.log('\n🔐 Login credentials:');
    console.log('Admin: admin@pharmacy.com / admin123');
    console.log('Pharmacist: pharmacist@pharmacy.com / pharmacist123');
}

main()
    .catch((e) => {
        console.error('❌ Error seeding database:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
