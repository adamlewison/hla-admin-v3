import DashboardLayout from "@/components/layout/DashboardLayout";

import { createClient } from "@/utils/supabase/server";

export const metadata = {
  title: "HLA Admin Dashboard",
  description: "Admin dashboard for HLA Architects",
};

export default async function DashboardRootLayout({ children }) {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    redirect("/login");
  }

  return <DashboardLayout>{children}</DashboardLayout>;
}
