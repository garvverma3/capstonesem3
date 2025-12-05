const prisma = require('../../config/prisma');

const createOrder = async (data) => {
    return prisma.order.create({
        data,
        include: {
            user: { select: { id: true, name: true, email: true } },
            items: {
                include: {
                    drug: true
                }
            }
        }
    });
};

const findOrderById = async (id) => {
    return prisma.order.findUnique({
        where: { id: parseInt(id) },
        include: {
            user: { select: { id: true, name: true, email: true } },
            items: {
                include: {
                    drug: true
                }
            }
        }
    });
};

const listOrders = async (filters = {}, pagination = {}) => {
    const { status, userId } = filters;
    const { skip = 0, limit = 10 } = pagination;

    const where = {};
    if (status) where.status = status;
    if (userId) where.userId = parseInt(userId);

    const [orders, total] = await Promise.all([
        prisma.order.findMany({
            where,
            include: {
                user: { select: { id: true, name: true, email: true } },
                items: {
                    include: {
                        drug: true
                    }
                }
            },
            skip,
            take: limit,
            orderBy: { createdAt: 'desc' }
        }),
        prisma.order.count({ where })
    ]);

    return { orders, total };
};

const updateOrderStatus = async (id, status) => {
    return prisma.order.update({
        where: { id: parseInt(id) },
        data: { status },
        include: {
            user: { select: { id: true, name: true, email: true } },
            items: {
                include: {
                    drug: true
                }
            }
        }
    });
};

const deleteOrder = async (id) => {
    return prisma.order.delete({
        where: { id: parseInt(id) }
    });
};

module.exports = {
    createOrder,
    findOrderById,
    listOrders,
    updateOrderStatus,
    deleteOrder
};
