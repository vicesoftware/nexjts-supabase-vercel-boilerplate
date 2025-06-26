'use client';

import { useState } from 'react';
import { createBrowserClient } from '@/lib/database/client';
import { ActivityType, CreateActivityRequest } from '../types';

export function AddActivityForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<CreateActivityRequest>({
    type: 'user_action',
    title: '',
    description: '',
  });

  const activityTypeOptions: {
    value: ActivityType;
    label: string;
    example: string;
  }[] = [
    {
      value: 'user_action',
      label: 'User Action',
      example: 'Login, Profile Update, File Upload',
    },
    {
      value: 'system_event',
      label: 'System Event',
      example: 'Email Sent, Payment Processed, Backup',
    },
    {
      value: 'data_change',
      label: 'Data Change',
      example: 'Order Placed, Document Created, Settings',
    },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    setIsSubmitting(true);

    try {
      const supabase = createBrowserClient();
      const { error } = await supabase.from('activities').insert([
        {
          type: formData.type,
          title: formData.title.trim(),
          description: formData.description?.trim() || null,
          metadata: {},
        },
      ]);

      if (error) throw error;

      // Reset form on success
      setFormData({
        type: 'user_action',
        title: '',
        description: '',
      });
    } catch (error) {
      // In a real app, you'd show a toast/notification here
      // eslint-disable-next-line no-console
      console.error('Error creating activity:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getTypeIcon = (type: ActivityType) => {
    switch (type) {
      case 'user_action':
        return '👤';
      case 'system_event':
        return '⚙️';
      case 'data_change':
        return '📊';
      default:
        return '📝';
    }
  };

  return (
    <div className="border rounded-lg p-4 bg-white">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-lg">➕</span>
        <h3 className="text-lg font-semibold">Add New Activity</h3>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Activity Type */}
        <div>
          <label
            htmlFor="type"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Activity Type
          </label>
          <div className="grid grid-cols-1 gap-2">
            {activityTypeOptions.map(option => (
              <label
                key={option.value}
                className={`flex items-start gap-3 p-3 border rounded-lg cursor-pointer transition-all hover:bg-gray-50 ${
                  formData.type === option.value
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200'
                }`}
              >
                <input
                  type="radio"
                  name="type"
                  value={option.value}
                  checked={formData.type === option.value}
                  onChange={e =>
                    setFormData(prev => ({
                      ...prev,
                      type: e.target.value as ActivityType,
                    }))
                  }
                  className="mt-1"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span>{getTypeIcon(option.value)}</span>
                    <span className="font-medium text-sm">{option.label}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{option.example}</p>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Title */}
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Title *
          </label>
          <input
            type="text"
            id="title"
            value={formData.title}
            onChange={e =>
              setFormData(prev => ({ ...prev, title: e.target.value }))
            }
            placeholder="e.g., User Logged In, Document Created, Payment Processed"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            required
          />
        </div>

        {/* Description */}
        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Description
          </label>
          <textarea
            id="description"
            value={formData.description}
            onChange={e =>
              setFormData(prev => ({ ...prev, description: e.target.value }))
            }
            placeholder="Additional details about this activity..."
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm resize-none"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={!formData.title.trim() || isSubmitting}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
        >
          {isSubmitting ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Creating...
            </>
          ) : (
            <>
              <span>➕</span>
              Create Activity
            </>
          )}
        </button>
      </form>
    </div>
  );
}
