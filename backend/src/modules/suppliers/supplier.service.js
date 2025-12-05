const prisma = require('../../config/prisma');

const createSupplier = (data) => prisma.supplier.create({ data });

const getSupplierById = (id) =>
    prisma.supplier.findUnique({
        where: { id: parseInt(id) },
        include: { drugs: true },
    });

const updateSupplier = (id, data) =>
    prisma.supplier.update({
        where: { id: parseInt(id) },
        data,
    });

const deleteSupplier = (id) =>
    prisma.supplier.delete({
        where: { id: parseInt(id) },
    });

const listSuppliers = async ({ filter = {}, skip = 0, limit = 10, sort = 'createdAt' }) => {
    const orderBy = { [sort]: 'desc' };

    // Convert Mongoose-style regex filter to Prisma contains if needed
    const where = {};
    if (filter.name) where.name = { contains: filter.name }; // SQLite/Postgres usage
    if (filter.email) where.email = { contains: filter.email };

    const [suppliers, total] = await Promise.all([
        prisma.supplier.findMany({
            where,
            skip,
            take: limit,
            orderBy,
            include: {
                _count: {
                    select: { drugs: true },
                },
            },
        }),
        prisma.supplier.count({ where }),
    ]);

    return { suppliers, total };
};

module.exports = {
    createSupplier,
    getSupplierById,
    updateSupplier,
    deleteSupplier,
    listSuppliers,
};
