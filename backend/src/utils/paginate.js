const buildPagination = ({ page = 1, limit = 10 }) => {
  const parsedPage = Math.max(parseInt(page, 10) || 1, 1);
  const parsedLimit = Math.min(Math.max(parseInt(limit, 10) || 10, 1), 100);

  return {
    skip: (parsedPage - 1) * parsedLimit,
    limit: parsedLimit,
    page: parsedPage,
  };
};

module.exports = { buildPagination };


