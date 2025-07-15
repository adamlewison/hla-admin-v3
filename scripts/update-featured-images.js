#!/usr/bin/env node

const { createClient } = require("@supabase/supabase-js");
const path = require("path");
const dotenv = require("dotenv");

// Load environment variables from .env file
dotenv.config({ path: path.resolve(__dirname, "../.env.local") });

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Error: Missing required environment variables");
  console.error(
    "Please ensure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set in your .env file"
  );
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function updateFeaturedImages() {
  try {
    console.log("Fetching projects with featured images...");

    // Fetch all projects with featured_image_url
    const { data: projects, error } = await supabase
      .from("projects")
      .select("id, featured_image_url")
      .not("featured_image_url", "is", null);

    if (error) throw error;

    console.log(`Found ${projects.length} projects with featured images`);

    let updatedCount = 0;

    // Process each project
    for (const project of projects) {
      const oldUrl = project.featured_image_url;

      // Apply the transformation: /images/[prj*]*.* -> prj*-*.*
      const newUrl = oldUrl.replace(
        /\/images\/\[prj(.*?)\](.*?)\.(\w+)$/,
        "prj$1-$2.$3"
      );

      // Only update if the URL was actually changed
      if (newUrl !== oldUrl) {
        console.log(`Updating project ${project.id}:`);
        console.log(`  From: ${oldUrl}`);
        console.log(`  To:   ${newUrl}`);

        // Update the project with the new URL
        const { error: updateError } = await supabase
          .from("projects")
          .update({ featured_image_url: newUrl })
          .eq("id", project.id);

        if (updateError) {
          console.error(
            `Error updating project ${project.id}:`,
            updateError.message
          );
        } else {
          updatedCount++;
        }
      }
    }

    console.log(`\nUpdate complete!`);
    console.log(`- Total projects processed: ${projects.length}`);
    console.log(`- Projects updated: ${updatedCount}`);
  } catch (error) {
    console.error("Error updating featured images:", error.message);
    process.exit(1);
  }
}

// Run the update
updateFeaturedImages();
