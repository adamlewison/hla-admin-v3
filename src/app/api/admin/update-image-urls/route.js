import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const supabase = await createClient();
    
    // First, fetch all project images
    const { data: images, error: fetchError } = await supabase
      .from('project_images')
      .select('id, image_url');
    
    if (fetchError) {
      console.error('Error fetching images:', fetchError);
      return NextResponse.json(
        { error: 'Failed to fetch images', details: fetchError.message },
        { status: 500 }
      );
    }

    let updatedCount = 0;
    const errors = [];

    // Process each image
    for (const image of images) {
      const currentUrl = image.image_url;
      if (!currentUrl) continue;

      // Transform the URL from '/images/projects/[prj*]*.*' to 'prj*-*.*'
      const match = currentUrl.match(/^\/images\/projects\/\[prj(.*?)\](.*?\..+?)(\?.*)?$/);
      if (!match) continue;

      const projectNum = match[1];
      const filename = match[2];
      const queryParams = match[3] || '';
      const newUrl = `prj${projectNum}-${filename}${queryParams}`;

      // Update the record
      const { error: updateError } = await supabase
        .from('project_images')
        .update({ image_url: newUrl })
        .eq('id', image.id);

      if (updateError) {
        console.error(`Error updating image ${image.id}:`, updateError);
        errors.push({
          id: image.id,
          error: updateError.message
        });
      } else {
        updatedCount++;
      }
    }

    return NextResponse.json({
      success: true,
      updatedCount,
      totalImages: images.length,
      errors: errors.length > 0 ? errors : undefined
    });

  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred', details: error.message },
      { status: 500 }
    );
  }
}
