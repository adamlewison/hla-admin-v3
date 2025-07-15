"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, Image as ImageIcon, ArrowLeft } from "lucide-react";
//import { supabase } from "@/lib/supabase/client";
import { supabase } from "@/utils/supabase/client";
import { imageUrl } from "@/lib/utils";

export default function ProjectImagesPage() {
  const router = useRouter();
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState("");

  useEffect(() => {
    const fetchProjectAndImages = async () => {
      try {
        setLoading(true);

        // Fetch project details
        const { data: projectData, error: projectError } = await supabase
          .from("projects")
          .select("*")
          .eq("id", id)
          .single();

        if (projectError) throw projectError;

        // Fetch project images
        const { data: imagesData, error: imagesError } = await supabase
          .from("project_images")
          .select("*")
          .eq("project_id", id)
          .order("sort_order", { ascending: true });

        if (imagesError) throw imagesError;

        setProject(projectData);
        setImages(imagesData || []);
      } catch (error) {
        console.error("Error fetching data:", error);
        // Handle error (e.g., show error message or redirect)
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProjectAndImages();
    }
  }, [id]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!selectedFile) return;

    try {
      setUploading(true);

      // Upload file to Supabase Storage
      const fileExt = selectedFile.name.split(".").pop();
      const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("project-images")
        .upload(filePath, selectedFile);

      if (uploadError) throw uploadError;

      // Get public URL
      const {
        data: { publicUrl },
      } = supabase.storage.from("project-images").getPublicUrl(filePath);

      // Create image record in the database
      const { data: imageData, error: insertError } = await supabase
        .from("project_images")
        .insert([
          {
            project_id: id,
            //image_url: publicUrl,
            image_url: filePath,
            alt_text: selectedFile.name,
            sort_order: images.length,
            is_featured: images.length === 0, // First image is featured by default
          },
        ])
        .select();

      if (insertError) throw insertError;

      // Update local state
      setImages([...images, ...imageData]);
      setSelectedFile(null);
      setPreview("");
    } catch (error) {
      console.error("Error uploading image:", error);
      // Handle error (e.g., show error message)
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteImage = async (imageId) => {
    if (!window.confirm("Are you sure you want to delete this image?")) return;

    try {
      const { error } = await supabase
        .from("project_images")
        .delete()
        .eq("id", imageId);

      if (error) throw error;

      // Update local state
      setImages(images.filter((img) => img.id !== imageId));
    } catch (error) {
      console.error("Error deleting image:", error);
      // Handle error (e.g., show error message)
    }
  };

  const handleSetFeatured = async (imageId) => {
    try {
      // First, unset any currently featured image
      await supabase
        .from("project_images")
        .update({ is_featured: false })
        .eq("project_id", id);

      // Then set the selected image as featured
      const { error } = await supabase
        .from("project_images")
        .update({ is_featured: true })
        .eq("id", imageId);

      if (error) throw error;

      // Update local state
      setImages(
        images.map((img) => ({
          ...img,
          is_featured: img.id === imageId,
        }))
      );
    } catch (error) {
      console.error("Error setting featured image:", error);
      // Handle error (e.g., show error message)
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
        <p className="mt-2 text-sm text-gray-500">
          The project you're looking for doesn't exist or has been deleted.
        </p>
        <div className="mt-6">
          <button
            onClick={() => router.push("/dashboard/projects")}
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
        <div className="flex items-center">
          <button
            onClick={() => router.back()}
            className="mr-4 text-gray-500 hover:text-gray-700"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="text-2xl font-bold">{project.title} - Images</h1>
        </div>
      </div>

      {/* Upload Section */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Upload New Image
          </h3>

          <form onSubmit={handleUpload} className="space-y-4">
            <div className="flex items-center justify-center w-full">
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <ImageIcon className="w-8 h-8 mb-4 text-gray-500" />
                  <p className="mb-2 text-sm text-gray-500">
                    <span className="font-semibold">Click to upload</span> or
                    drag and drop
                  </p>
                  <p className="text-xs text-gray-500">
                    PNG, JPG, JPEG, WEBP (MAX. 10MB)
                  </p>
                </div>
                <input
                  id="dropzone-file"
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </label>
            </div>

            {preview && (
              <div className="mt-4">
                <p className="text-sm font-medium text-gray-700 mb-2">
                  Preview:
                </p>
                <div className="relative w-32 h-32 border border-gray-200 rounded-md overflow-hidden">
                  <img
                    src={preview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            )}

            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={!selectedFile || uploading}
                className="inline-flex items-center"
              >
                {uploading ? "Uploading..." : "Upload Image"}
              </Button>
            </div>
          </form>
        </div>
      </div>

      {/* Images Grid */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Project Images
          </h3>

          {images.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No images uploaded yet. Upload your first image above.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {images.map((image) => (
                <div key={image.id} className="relative group">
                  <div
                    className={`relative aspect-square overflow-hidden rounded-lg border-2 ${
                      image.is_featured
                        ? "border-blue-500"
                        : "border-transparent"
                    }`}
                  >
                    <img
                      src={imageUrl(image.image_url)}
                      alt={image.alt_text || "Project image"}
                      className="w-full h-full object-cover"
                    />

                    <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-2">
                      <button
                        onClick={() => handleSetFeatured(image.id)}
                        className={`p-2 rounded-full ${
                          image.is_featured
                            ? "bg-blue-500 text-white"
                            : "bg-white text-gray-700 hover:bg-gray-100"
                        }`}
                        title={
                          image.is_featured ? "Featured" : "Set as featured"
                        }
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>

                      <button
                        onClick={() => handleDeleteImage(image.id)}
                        className="p-2 rounded-full bg-white text-red-600 hover:bg-red-50"
                        title="Delete image"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </div>

                  {image.is_featured && (
                    <span className="absolute top-2 left-2 bg-blue-500 text-white text-xs px-2 py-1 rounded">
                      Featured
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
