'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import ProjectForm from '@/components/forms/ProjectForm';
import { supabase } from '@/lib/supabase/client';

export default function EditProjectPage() {
  const router = useRouter();
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const { data, error } = await supabase
          .from('projects')
          .select('*')
          .eq('id', id)
          .single();

        if (error) throw error;
        
        setProject(data);
      } catch (error) {
        console.error('Error fetching project:', error);
        // Handle error (e.g., show error message or redirect)
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProject();
    }
  }, [id]);

  const handleSubmit = async (formData) => {
    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('projects')
        .update(formData)
        .eq('id', id);

      if (error) throw error;
      
      router.push('/dashboard/projects');
    } catch (error) {
      console.error('Error updating project:', error);
      // Handle error (e.g., show error message)
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900">Project not found</h3>
        <p className="mt-2 text-sm text-gray-500">The project you're looking for doesn't exist or has been deleted.</p>
        <div className="mt-6">
          <button
            onClick={() => router.push('/dashboard/projects')}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Back to Projects
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Edit Project</h1>
      </div>
      
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <ProjectForm 
            project={project} 
            onSubmit={handleSubmit} 
            isSubmitting={isSubmitting} 
          />
        </div>
      </div>
    </div>
  );
}
