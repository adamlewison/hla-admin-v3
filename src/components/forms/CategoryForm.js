'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import { Button } from '../ui/button';

export default function CategoryForm({ category = null }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    icon_name: 'tag',
    color_hex: '#3b82f6',
    is_active: true,
    sort_order: 0,
  });

  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name || '',
        slug: category.slug || '',
        description: category.description || '',
        icon_name: category.icon_name || 'tag',
        color_hex: category.color_hex || '#3b82f6',
        is_active: category.is_active ?? true,
        sort_order: category.sort_order || 0,
      });
    }
  }, [category]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const generateSlug = (name) => {
    return name
      .toLowerCase()
      .replace(/[^\w\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/--+/g, '-') // Replace multiple hyphens with single hyphen
      .trim();
  };

  const handleNameChange = (e) => {
    const name = e.target.value;
    setFormData(prev => ({
      ...prev,
      name,
      slug: generateSlug(name)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (category) {
        // Update existing category
        const { error } = await supabase
          .from('project_categories')
          .update(formData)
          .eq('id', category.id);

        if (error) throw error;
      } else {
        // Create new category
        const { error } = await supabase
          .from('project_categories')
          .insert([formData]);

        if (error) throw error;
      }

      router.push('/dashboard/categories');
      router.refresh();
    } catch (error) {
      console.error('Error saving category:', error);
    } finally {
      setLoading(false);
    }
  };

  const colorOptions = [
    { name: 'Blue', value: '#3b82f6' },
    { name: 'Green', value: '#10b981' },
    { name: 'Red', value: '#ef4444' },
    { name: 'Yellow', value: '#f59e0b' },
    { name: 'Purple', value: '#8b5cf6' },
    { name: 'Pink', value: '#ec4899' },
    { name: 'Indigo', value: '#6366f1' },
    { name: 'Emerald', value: '#10b981' },
    { name: 'Rose', value: '#f43f5e' },
    { name: 'Amber', value: '#f59e0b' },
  ];

  const iconOptions = [
    'home', 'building', 'office-building', 'warehouse', 'hospital', 'school', 'store', 'bank',
    'factory', 'church', 'hotel', 'restaurant', 'storefront', 'shopping-cart', 'briefcase',
    'lightbulb', 'paint-bucket', 'tree', 'mountain', 'water', 'sun', 'moon', 'star', 'heart',
    'tag', 'bookmark', 'flag', 'award', 'trophy', 'gift', 'shopping-bag', 'shopping-basket',
    'shopping-bag', 'shopping-basket', 'shopping-cart', 'cart', 'basket', 'package', 'box',
    'cube', 'cubes', 'layers', 'grid', 'layout', 'columns', 'table', 'list', 'menu', 'more-horizontal',
    'more-vertical', 'plus', 'minus', 'x', 'check', 'alert-circle', 'alert-triangle', 'info', 'help-circle',
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
        <div className="md:grid md:grid-cols-3 md:gap-6">
          <div className="md:col-span-1">
            <h3 className="text-lg font-medium leading-6 text-gray-900">Category Information</h3>
            <p className="mt-1 text-sm text-gray-500">
              Basic information about the project category.
            </p>
          </div>
          <div className="mt-5 md:mt-0 md:col-span-2">
            <div className="grid grid-cols-6 gap-6">
              <div className="col-span-6 sm:col-span-4">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Category Name *
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  required
                  value={formData.name}
                  onChange={handleNameChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>

              <div className="col-span-6 sm:col-span-4">
                <label htmlFor="slug" className="block text-sm font-medium text-gray-700">
                  URL Slug *
                </label>
                <div className="mt-1 flex rounded-md shadow-sm">
                  <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                    /projects/category/
                  </span>
                  <input
                    type="text"
                    name="slug"
                    id="slug"
                    required
                    value={formData.slug}
                    onChange={handleChange}
                    className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
              </div>

              <div className="col-span-6">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <div className="mt-1">
                  <textarea
                    id="description"
                    name="description"
                    rows={3}
                    value={formData.description}
                    onChange={handleChange}
                    className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border border-gray-300 rounded-md"
                  />
                </div>
              </div>

              <div className="col-span-6 sm:col-span-3">
                <label htmlFor="icon_name" className="block text-sm font-medium text-gray-700">
                  Icon
                </label>
                <select
                  id="icon_name"
                  name="icon_name"
                  value={formData.icon_name}
                  onChange={handleChange}
                  className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                >
                  {iconOptions.map(icon => (
                    <option key={icon} value={icon}>
                      {icon.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                    </option>
                  ))}
                </select>
                <div className="mt-2 text-sm text-gray-500">
                  Preview: <span className="ml-2">
                    <i className={`fas fa-${formData.icon_name} text-${formData.color_hex.replace('#', '')}-500`}></i>
                  </span>
                </div>
              </div>

              <div className="col-span-6 sm:col-span-3">
                <label htmlFor="color_hex" className="block text-sm font-medium text-gray-700">
                  Color
                </label>
                <div className="mt-1 flex items-center">
                  <select
                    id="color_hex"
                    name="color_hex"
                    value={formData.color_hex}
                    onChange={handleChange}
                    className="block w-full py-2 pl-3 pr-10 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  >
                    {colorOptions.map(color => (
                      <option key={color.value} value={color.value}>
                        {color.name}
                      </option>
                    ))}
                  </select>
                  <div 
                    className="ml-3 w-8 h-8 rounded-full border border-gray-300"
                    style={{ backgroundColor: formData.color_hex }}
                  ></div>
                </div>
              </div>

              <div className="col-span-6 sm:col-span-3">
                <label htmlFor="sort_order" className="block text-sm font-medium text-gray-700">
                  Sort Order
                </label>
                <input
                  type="number"
                  name="sort_order"
                  id="sort_order"
                  min="0"
                  value={formData.sort_order}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Lower numbers appear first
                </p>
              </div>

              <div className="col-span-6">
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="is_active"
                      name="is_active"
                      type="checkbox"
                      checked={formData.is_active}
                      onChange={handleChange}
                      className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="is_active" className="font-medium text-gray-700">
                      Active
                    </label>
                    <p className="text-gray-500">
                      Inactive categories won't be shown in dropdowns or filters.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => router.push('/dashboard/categories')}
          className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 mr-3"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          {loading ? 'Saving...' : category ? 'Update Category' : 'Create Category'}
        </button>
      </div>
    </form>
  );
}
