"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { updateMaintenanceRecord } from '@/app/dashboard/maintenance/actions';
import Link from 'next/link';
import { MaintenanceRecord } from '@/types/maintenance';

interface Vehicle {
  id: number;
  make: string;
  model: string;
  year: number;
  license_plate: string;
}

interface EditMaintenanceFormProps {
  maintenanceRecord: MaintenanceRecord;
  vehicles: Vehicle[];
}

export default function EditMaintenanceForm({ maintenanceRecord, vehicles }: EditMaintenanceFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  
  // Form state
  const [formData, setFormData] = useState({
    id: maintenanceRecord.id,
    vehicle_id: maintenanceRecord.vehicle_id,
    service_type: maintenanceRecord.service_type || '',
    description: maintenanceRecord.description || '',
    date_performed: maintenanceRecord.date_performed ? new Date(maintenanceRecord.date_performed).toISOString().split('T')[0] : '',
    next_due_date: maintenanceRecord.next_due_date ? new Date(maintenanceRecord.next_due_date).toISOString().split('T')[0] : '',
    cost: maintenanceRecord.cost?.toString() || '0',
    status: maintenanceRecord.status || 'scheduled',
    service_provider: maintenanceRecord.service_provider || '',
    notes: maintenanceRecord.notes || ''
  });

  // Service type options
  const serviceTypes = [
    'Oil Change',
    'Tire Rotation',
    'Brake Service',
    'Air Filter Replacement',
    'Battery Replacement',
    'Transmission Service',
    'Coolant Flush',
    'Wheel Alignment',
    'Engine Tune-up',
    'Inspection',
    'Other'
  ];

  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormError(null);
    
    try {
      // Create a FormData object to send to the server action
      const formDataObj = new FormData();
      
      // Add all form fields to the FormData object
      Object.entries(formData).forEach(([key, value]) => {
        formDataObj.append(key, value?.toString() || '');
      });
      
      // Call the server action to update the maintenance record
      const result = await updateMaintenanceRecord(formDataObj);
      
      if (result.success) {
        // Redirect back to maintenance page
        router.push('/dashboard/maintenance');
        router.refresh();
      } else {
        setFormError(result.message || 'An error occurred while updating the maintenance record');
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setFormError('An unexpected error occurred. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {formError && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{formError}</p>
            </div>
          </div>
        </div>
      )}

      {/* Vehicle Selection */}
      <div>
        <label htmlFor="vehicle_id" className="block text-sm font-medium text-gray-700 mb-1">
          Vehicle <span className="text-red-500">*</span>
        </label>
        <select
          id="vehicle_id"
          name="vehicle_id"
          value={formData.vehicle_id}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black bg-white"
        >
          <option value="">Select a vehicle</option>
          {vehicles.map(vehicle => (
            <option key={vehicle.id} value={vehicle.id}>
              {vehicle.make} {vehicle.model} ({vehicle.license_plate})
            </option>
          ))}
        </select>
      </div>

      {/* Service Type */}
      <div>
        <label htmlFor="service_type" className="block text-sm font-medium text-gray-700 mb-1">
          Service Type <span className="text-red-500">*</span>
        </label>
        <select
          id="service_type"
          name="service_type"
          value={formData.service_type}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black bg-white"
        >
          <option value="">Select service type</option>
          {serviceTypes.map(type => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>

      {/* Description */}
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={3}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black bg-white"
          placeholder="Detailed description of the maintenance service"
        />
      </div>

      {/* Two-column layout for dates */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Date Performed */}
        <div>
          <label htmlFor="date_performed" className="block text-sm font-medium text-gray-700 mb-1">
            Date Performed
          </label>
          <input
            type="date"
            id="date_performed"
            name="date_performed"
            value={formData.date_performed}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black bg-white"
          />
          <p className="mt-1 text-xs text-gray-500">Leave blank if not yet performed</p>
        </div>

        {/* Next Due Date */}
        <div>
          <label htmlFor="next_due_date" className="block text-sm font-medium text-gray-700 mb-1">
            Next Due Date <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            id="next_due_date"
            name="next_due_date"
            value={formData.next_due_date}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black bg-white"
          />
        </div>
      </div>

      {/* Two-column layout for cost and status */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Cost */}
        <div>
          <label htmlFor="cost" className="block text-sm font-medium text-gray-700 mb-1">
            Cost ($)
          </label>
          <input
            type="number"
            id="cost"
            name="cost"
            value={formData.cost}
            onChange={handleChange}
            min="0"
            step="0.01"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black bg-white"
            placeholder="0.00"
          />
        </div>

        {/* Status */}
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
            Status <span className="text-red-500">*</span>
          </label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black bg-white"
          >
            <option value="scheduled">Scheduled</option>
            <option value="completed">Completed</option>
            <option value="overdue">Overdue</option>
          </select>
        </div>
      </div>

      {/* Service Provider */}
      <div>
        <label htmlFor="service_provider" className="block text-sm font-medium text-gray-700 mb-1">
          Service Provider
        </label>
        <input
          type="text"
          id="service_provider"
          name="service_provider"
          value={formData.service_provider}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black bg-white"
          placeholder="Mechanic or service center name"
        />
      </div>

      {/* Notes */}
      <div>
        <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
          Notes
        </label>
        <textarea
          id="notes"
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          rows={3}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black bg-white"
          placeholder="Additional notes or comments"
        />
      </div>

      {/* Form Actions */}
      <div className="flex justify-end space-x-3 pt-4">
        <Link
          href="/dashboard/maintenance"
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md shadow-sm hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
        >
          Cancel
        </Link>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 bg-blue-600 text-white rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-blue-300"
        >
          {isSubmitting ? 'Updating...' : 'Update Maintenance Record'}
        </button>
      </div>
    </form>
  );
}
