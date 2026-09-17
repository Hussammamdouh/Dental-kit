import React from 'react';
import AdminLayout from '../../components/layout/AdminLayout';

const TestPage = () => {
  return (
    <AdminLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold">Test Page</h1>
        <p>If you can see this, routing is working.</p>
      </div>
    </AdminLayout>
  );
};

export default TestPage;
