const determineStatus = ({ quantity, expiryDate }) => {
  const now = new Date();
  if (expiryDate && new Date(expiryDate) < now) {
    return 'expired';
  }
  if (quantity <= 0) {
    return 'out-of-stock';
  }
  if (quantity <= 10) {
    return 'low-stock';
  }
  return 'in-stock';
};

module.exports = { determineStatus };


