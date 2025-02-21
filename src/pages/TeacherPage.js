import React from 'react';
import AvailabilityGrid from '../components/Availability';

export default function TeacherPage() {
    return (
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">My Studio</h1>
            <AvailabilityGrid />
      </div>
    );
  }