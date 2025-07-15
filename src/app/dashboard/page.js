"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Building2,
  Folder,
  Tag,
  Users,
  FileText,
  Mail,
  BarChart2,
} from "lucide-react";
import { supabase } from "@/lib/supabase/client";

const StatCard = ({ title, value, icon: Icon, color = "blue", href }) => {
  const bgColors = {
    blue: "bg-blue-100 text-blue-600",
    green: "bg-green-100 text-green-600",
    purple: "bg-purple-100 text-purple-600",
    amber: "bg-amber-100 text-amber-600",
  };

  const content = (
    <div className="bg-white overflow-hidden shadow rounded-lg">
      <div className="p-5">
        <div className="flex items-center">
          <div className={`flex-shrink-0 rounded-md p-3 ${bgColors[color]}`}>
            <Icon className="h-6 w-6" />
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">
                {title}
              </dt>
              <dd className="flex items-baseline">
                <div className="text-2xl font-semibold text-gray-900">
                  {value}
                </div>
              </dd>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );

  return href ? (
    <Link href={href} className="block hover:opacity-90 transition-opacity">
      {content}
    </Link>
  ) : (
    content
  );
};

export default function DashboardPage() {
  const [stats, setStats] = useState({
    projects: 0,
    clients: 0,
    categories: 0,
    recentProjects: [],
    recentContacts: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);

        // Fetch counts
        const [
          { count: projectsCount },
          { count: clientsCount },
          { count: categoriesCount },
          { data: recentProjects },
          { data: recentContacts },
        ] = await Promise.all([
          supabase.from("projects").select("*", { count: "exact", head: true }),
          supabase.from("clients").select("*", { count: "exact", head: true }),
          supabase
            .from("project_categories")
            .select("*", { count: "exact", head: true }),
          supabase
            .from("projects")
            .select("id, title, created_at, status")
            .order("created_at", { ascending: false })
            .limit(5),
          supabase
            .from("contact_submissions")
            .select("id, name, email, created_at, status")
            .order("created_at", { ascending: false })
            .limit(5),
        ]);

        setStats({
          projects: projectsCount || 0,
          clients: clientsCount || 0,
          categories: categoriesCount || 0,
          recentProjects: recentProjects || [],
          recentContacts: recentContacts || [],
        });
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">
          Welcome back! Here's what's happening with your projects.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Projects"
          value={stats.projects}
          icon={Folder}
          color="blue"
          href="/dashboard/projects"
        />
        <StatCard
          title="Clients"
          value={stats.clients}
          icon={Users}
          color="green"
          href="/dashboard/clients"
        />
        <StatCard
          title="Categories"
          value={stats.categories}
          icon={Tag}
          color="purple"
          href="/dashboard/categories"
        />
        <StatCard
          title="New Messages"
          value={stats.recentContacts.length}
          icon={Mail}
          color="amber"
          href="/dashboard/messages"
        />
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        {/* Recent Projects */}
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
            <h3 className="text-lg font-medium leading-6 text-gray-900">
              Recent Projects
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Recently added or updated projects
            </p>
          </div>
          <div className="bg-white overflow-hidden">
            <ul className="divide-y divide-gray-200">
              {stats.recentProjects.length > 0 ? (
                stats.recentProjects.map((project) => (
                  <li key={project.id}>
                    <Link
                      href={`/dashboard/projects/${project.id}`}
                      className="block hover:bg-gray-50 px-4 py-4 sm:px-6"
                    >
                      <div className="flex items-center justify-between">
                        <div className="text-sm font-medium text-blue-600 truncate">
                          {project.title}
                        </div>
                        <div className="ml-2 flex-shrink-0 flex">
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              project.status === "completed"
                                ? "bg-green-100 text-green-800"
                                : project.status === "in_progress"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {project.status?.replace("_", " ")}
                          </span>
                        </div>
                      </div>
                      <div className="mt-2 flex justify-between">
                        <div className="sm:flex">
                          <p className="flex items-center text-sm text-gray-500">
                            <span>
                              Created on{" "}
                              {new Date(
                                project.created_at
                              ).toLocaleDateString()}
                            </span>
                          </p>
                        </div>
                      </div>
                    </Link>
                  </li>
                ))
              ) : (
                <li className="px-4 py-4 sm:px-6 text-center text-sm text-gray-500">
                  No projects found
                </li>
              )}
            </ul>
            <div className="bg-gray-50 px-4 py-4 sm:px-6 text-right">
              <Link
                href="/dashboard/projects"
                className="text-sm font-medium text-blue-600 hover:text-blue-500"
              >
                View all projects<span className="sr-only">, projects</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Recent Contact Messages */}
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
            <h3 className="text-lg font-medium leading-6 text-gray-900">
              Recent Messages
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Latest contact form submissions
            </p>
          </div>
          <div className="bg-white overflow-hidden">
            <ul className="divide-y divide-gray-200">
              {stats.recentContacts.length > 0 ? (
                stats.recentContacts.map((contact) => (
                  <li key={contact.id}>
                    <Link
                      href={`/dashboard/messages/${contact.id}`}
                      className="block hover:bg-gray-50 px-4 py-4 sm:px-6"
                    >
                      <div className="flex items-center justify-between">
                        <div className="text-sm font-medium text-gray-900 truncate">
                          {contact.name}
                        </div>
                        <div className="ml-2 flex-shrink-0 flex">
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              contact.status === "new"
                                ? "bg-blue-100 text-blue-800"
                                : contact.status === "contacted"
                                ? "bg-green-100 text-green-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {contact.status}
                          </span>
                        </div>
                      </div>
                      <div className="mt-2 flex justify-between">
                        <div className="sm:flex">
                          <p className="flex items-center text-sm text-gray-500">
                            {contact.email}
                          </p>
                        </div>
                        <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                          <span>
                            {new Date(contact.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </Link>
                  </li>
                ))
              ) : (
                <li className="px-4 py-4 sm:px-6 text-center text-sm text-gray-500">
                  No recent messages
                </li>
              )}
            </ul>
            <div className="bg-gray-50 px-4 py-4 sm:px-6 text-right">
              <Link
                href="/dashboard/messages"
                className="text-sm font-medium text-blue-600 hover:text-blue-500"
              >
                View all messages<span className="sr-only">, messages</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
