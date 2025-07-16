"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Edit,
  Trash2,
  Image as ImageIcon,
  Calendar,
  MapPin,
  Building2,
  Layers,
  Ruler,
  Clock,
  DollarSign,
  Tag,
  User,
} from "lucide-react";
import { toast } from "sonner";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { imageUrl } from "@/lib/utils";

export default function ProjectOverview() {
  const { id } = useParams();
  const router = useRouter();
  const supabase = createClientComponentClient();
  const [project, setProject] = useState(null);
  const [images, setImages] = useState([]);
  const [features, setFeatures] = useState([]);
  const [category, setCategory] = useState(null);
  const [client, setClient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const fetchProjectData = async () => {
      try {
        setLoading(true);

        // Fetch project details
        const { data: projectData, error: projectError } = await supabase
          .from("projects")
          .select("*")
          .eq("id", id)
          .single();

        if (projectError) throw projectError;
        setProject(projectData);

        // Fetch related data if project exists
        if (projectData) {
          // Fetch images
          const { data: imagesData, error: imagesError } = await supabase
            .from("project_images")
            .select("*")
            .eq("project_id", id)
            .order("is_featured", { ascending: false });

          if (!imagesError)
            setImages(
              imagesData.map((image) => ({
                image_url: imageUrl(image.image_url),
                id: image.id,
              })) || []
            );

          // Fetch features
          const { data: featuresData, error: featuresError } = await supabase
            .from("project_features")
            .select("*")
            .eq("project_id", id)
            .order("sort_order", { ascending: true });

          if (!featuresError) setFeatures(featuresData || []);

          // Fetch category
          if (projectData.category_id) {
            const { data: categoryData, error: categoryError } = await supabase
              .from("project_categories")
              .select("*")
              .eq("id", projectData.category_id)
              .single();

            if (!categoryError) setCategory(categoryData);
          }

          // Fetch client
          if (projectData.client_id) {
            const { data: clientData, error: clientError } = await supabase
              .from("clients")
              .select("*")
              .eq("id", projectData.client_id)
              .single();

            if (!clientError) setClient(clientData);
          }
        }
      } catch (error) {
        console.error("Error fetching project data:", error);
        toast.error("Failed to load project data");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProjectData();
    }
  }, [id, supabase]);

  const handleDelete = async () => {
    if (
      !window.confirm(
        "Are you sure you want to delete this project? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      setDeleting(true);
      const { error } = await supabase.from("projects").delete().eq("id", id);

      if (error) throw error;

      toast.success("Project deleted successfully");
      router.push("/dashboard/projects");
    } catch (error) {
      console.error("Error deleting project:", error);
      toast.error("Failed to delete project");
    } finally {
      setDeleting(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "in_progress":
        return "bg-blue-100 text-blue-800";
      case "on_hold":
        return "bg-yellow-100 text-yellow-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2 space-y-6">
                <div className="h-64 bg-gray-200 rounded-lg"></div>
                <div className="space-y-4">
                  <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                  <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                </div>
              </div>
              <div className="space-y-6">
                <div className="h-48 bg-gray-200 rounded-lg"></div>
                <div className="h-48 bg-gray-200 rounded-lg"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-800">
            Project not found
          </h2>
          <p className="mt-2 text-gray-600">
            The requested project could not be found.
          </p>
          <Button
            onClick={() => router.push("/dashboard/projects")}
            className="mt-4"
            variant="outline"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Projects
          </Button>
        </div>
      </div>
    );
  }

  const featuredImage = images.find((img) => img.is_featured) || images[0];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => router.push("/dashboard/projects")}
                  className="mr-4"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Projects
                </Button>
                <h1 className="text-2xl font-bold text-gray-900">
                  {project.title}
                </h1>
              </div>
              <div className="mt-2 flex items-center space-x-4">
                {project.status && (
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClass(
                      project.status
                    )}`}
                  >
                    {project.status.replace("_", " ")}
                  </span>
                )}
                {category && (
                  <span className="inline-flex items-center text-sm text-gray-600">
                    <Tag className="h-4 w-4 mr-1" />
                    {category.name}
                  </span>
                )}
              </div>
            </div>
            <div className="mt-4 sm:mt-0 flex space-x-3">
              <Button
                variant="outline"
                onClick={() => router.push(`/dashboard/projects/${id}/images`)}
              >
                <ImageIcon className="h-4 w-4 mr-2" />
                Manage Images
              </Button>
              <Button
                variant="outline"
                onClick={() => router.push(`/dashboard/projects/${id}/edit`)}
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit Project
              </Button>
              <Button
                variant="destructive"
                onClick={handleDelete}
                disabled={deleting}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                {deleting ? "Deleting..." : "Delete"}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Gallery */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              {featuredImage ? (
                <div className="relative aspect-w-16 aspect-h-9">
                  <img
                    src={featuredImage.image_url}
                    alt={featuredImage.alt_text || project.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="aspect-w-16 aspect-h-9 bg-gray-100 flex items-center justify-center">
                  <ImageIcon className="h-12 w-12 text-gray-400" />
                </div>
              )}
              {images.length > 1 && (
                <div className="p-4 bg-gray-50 border-t">
                  <h3 className="text-sm font-medium text-gray-900 mb-3">
                    More Images
                  </h3>
                  <div className="grid grid-cols-4 gap-2">
                    {images.slice(0, 4).map((image) => (
                      <div
                        key={image.id}
                        className="aspect-square bg-gray-100 rounded overflow-hidden border-2 border-transparent hover:border-blue-500 transition-colors"
                      >
                        <img
                          src={image.thumbnail_url || image.image_url}
                          alt={image.alt_text || ""}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Project Description */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Project Description
              </h2>
              <div className="prose max-w-none text-gray-600">
                {project.detailed_description ||
                  project.description ||
                  "No description available."}
              </div>
            </div>

            {/* Features */}
            {features.length > 0 && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Features
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {features.map((feature) => (
                    <div key={feature.id} className="flex items-start">
                      <div className="flex-shrink-0 h-5 w-5 text-blue-500 mt-0.5">
                        <svg
                          className="h-5 w-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-gray-900">
                          {feature.feature_name}
                        </h3>
                        {feature.feature_description && (
                          <p className="mt-1 text-sm text-gray-500">
                            {feature.feature_description}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Project Details */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Project Details
              </h2>
              <div className="space-y-4">
                {client && (
                  <div className="flex items-start">
                    <div className="flex-shrink-0 h-5 w-5 text-gray-400">
                      <Building2 className="h-5 w-5" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-gray-500">Client</p>
                      <p className="text-sm font-medium text-gray-900">
                        {client.company_name || client.contact_person_name}
                      </p>
                    </div>
                  </div>
                )}

                {project.location && (
                  <div className="flex items-start">
                    <div className="flex-shrink-0 h-5 w-5 text-gray-400">
                      <MapPin className="h-5 w-5" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-gray-500">Location</p>
                      <p className="text-sm font-medium text-gray-900">
                        {project.location}
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex items-start">
                  <div className="flex-shrink-0 h-5 w-5 text-gray-400">
                    <Calendar className="h-5 w-5" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-gray-500">Timeline</p>
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-gray-900">
                        {formatDate(project.start_date) || "N/A"} -{" "}
                        {formatDate(project.planned_completion_date) || "N/A"}
                      </p>
                      {project.actual_completion_date && (
                        <p className="text-xs text-gray-500">
                          Completed:{" "}
                          {formatDate(project.actual_completion_date)}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {project.total_area_sqm && (
                  <div className="flex items-start">
                    <div className="flex-shrink-0 h-5 w-5 text-gray-400">
                      <Ruler className="h-5 w-5" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-gray-500">Area</p>
                      <p className="text-sm font-medium text-gray-900">
                        {project.total_area_sqm} m²
                        {project.built_area_sqm &&
                          ` (${project.built_area_sqm} m² built)`}
                      </p>
                    </div>
                  </div>
                )}

                {project.number_of_floors && (
                  <div className="flex items-start">
                    <div className="flex-shrink-0 h-5 w-5 text-gray-400">
                      <Layers className="h-5 w-5" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-gray-500">Floors</p>
                      <p className="text-sm font-medium text-gray-900">
                        {project.number_of_floors}{" "}
                        {project.number_of_floors === 1 ? "floor" : "floors"}
                      </p>
                    </div>
                  </div>
                )}

                {(project.estimated_budget || project.actual_cost) && (
                  <div className="flex items-start">
                    <div className="flex-shrink-0 h-5 w-5 text-gray-400">
                      <DollarSign className="h-5 w-5" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-gray-500">Budget</p>
                      {project.estimated_budget && (
                        <p className="text-sm font-medium text-gray-900">
                          {new Intl.NumberFormat("en-ZA", {
                            style: "currency",
                            currency: project.currency || "ZAR",
                          }).format(project.estimated_budget)}
                          {project.actual_cost ? " (estimated)" : ""}
                        </p>
                      )}
                      {project.actual_cost && (
                        <p className="text-sm font-medium text-gray-900 mt-1">
                          {new Intl.NumberFormat("en-ZA", {
                            style: "currency",
                            currency: project.currency || "ZAR",
                          }).format(project.actual_cost)}{" "}
                          <span className="text-xs text-gray-500">
                            (actual)
                          </span>
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Project Team */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Project Team
              </h2>
              <div className="space-y-4">
                {project.lead_architect_id ? (
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <User className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">
                        Lead Architect
                      </p>
                      <p className="text-sm text-gray-500">To be assigned</p>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">
                    No team members assigned yet.
                  </p>
                )}
              </div>
            </div>

            {/* Project Documents */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">
                  Documents
                </h2>
                <Button variant="ghost" size="sm">
                  Upload
                </Button>
              </div>
              <div className="mt-4">
                <p className="text-sm text-gray-500">
                  No documents uploaded yet.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
