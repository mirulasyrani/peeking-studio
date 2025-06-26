// src/components/BackToDashboard.tsx
import React from 'react';
import { Link } from 'react-router-dom';

export default function BackToDashboard() {
  return (
    <div className="max-w-3xl mx-auto mb-6 px-6">
      <Link
        to="/admin"
        className="inline-block bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded"
      >
        &larr; Back to Dashboard
      </Link>
    </div>
  );
}
