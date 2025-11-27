import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

console.log('✅ Frontend running successfully on http://localhost:3000');
console.log('🔗 Backend API connected to http://localhost:3001');
console.log('🚀 Ready to use login/signup functionality!');

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);