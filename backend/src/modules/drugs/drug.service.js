const prisma = require('../../config/prisma');

const createDrug = (data) => prisma.drug.create({ data });

const getDrugById = (id) =>
    prisma.drug.findUnique({
        where: { id: parseInt(id) },
        include: { supplier: true },
    });

const updateDrug = (id, data) =>
    prisma.drug.update({
        where: { id: parseInt(id) },
        data,
    });

const deleteDrug = (id) =>
    prisma.drug.delete({
        where: { id: parseInt(id) },
    });

const listDrugs = async ({ filter = {}, skip = 0, limit = 10, sort = 'createdAt' }) => {
    const orderBy = { [sort]: 'desc' };

    const where = {};
    if (filter.name) where.name = { contains: filter.name }; // SQLite/Postgres 'contains' is case-sensitive usually, might need mode: 'insensitive' for Postgres
    if (filter.category) where.category = filter.category;
    if (filter.status) where.status = filter.status;
    if (filter.supplierId) where.supplierId = parseInt(filter.supplierId);

    // Quantity Range
    if (filter.minQuantity !== undefined || filter.maxQuantity !== undefined) {
        where.quantity = {};
        if (filter.minQuantity !== undefined) where.quantity.gte = parseInt(filter.minQuantity);
        if (filter.maxQuantity !== undefined) where.quantity.lte = parseInt(filter.maxQuantity);
    }

    // Expiry Date
    if (filter.expiryBefore) {
        where.expiryDate = { lte: new Date(filter.expiryBefore) };
    }

    const [drugs, total] = await Promise.all([
        prisma.drug.findMany({
            where,
            skip,
            take: limit,
            orderBy,
            include: {
                supplier: {
                    select: { name: true, email: true }
                }
            },
        }),
        prisma.drug.count({ where }),
    ]);

    return { drugs, total };
};

module.exports = {
    createDrug,
    getDrugById,
    updateDrug,
    deleteDrug,
    listDrugs,
};
