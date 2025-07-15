'use client';

import ClientForm from '@/components/forms/ClientForm';

export default function NewClientPage() {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Add New Client</h1>
      </div>
      
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <ClientForm />
        </div>
      </div>
    </div>
  );
}
