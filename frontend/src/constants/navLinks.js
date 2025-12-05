import { Home, Package, Users, ShoppingCart, Shield } from 'lucide-react';

export const navLinks = [
  { label: 'Overview', path: '/', icon: Home },
  { label: 'Inventory', path: '/inventory', icon: Package },
  { label: 'Suppliers', path: '/suppliers', icon: Users },
  { label: 'Orders', path: '/orders', icon: ShoppingCart },
  { label: 'Admin', path: '/admin', icon: Shield, roles: ['admin'] },
];


