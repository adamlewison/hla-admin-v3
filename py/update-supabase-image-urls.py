#!/usr/bin/env python3
"""
Update image URLs in Supabase 'project_images' table.

This script updates the 'image_url' field in the 'project_images' table,
transforming paths from 'images/projects/[prj*]*.*' to 'prj*-*.*'.
"""

import os
import re
from supabase import create_client, Client
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

def get_supabase_client() -> Client:
    """Initialize and return a Supabase client."""
    supabase_url = os.getenv("NEXT_PUBLIC_SUPABASE_URL")
    supabase_key = os.getenv("NEXT_PUBLIC_SUPABASE_ANON_KEY")
    
    if not supabase_url or not supabase_key:
        raise ValueError("Missing required environment variables: NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY must be set")
    
    return create_client(supabase_url, supabase_key)

def transform_image_url(url: str) -> str:
    """
    Transform the image URL from 'images/projects/[prj*]*.*' to 'prj*-*.*'.
    
    Args:
        url (str): The original image URL
        
    Returns:
        str: The transformed URL or the original if no match found
    """
    # Match '/images/projects/[prj*]*.*' pattern (with leading slash)
    match = re.match(r'^/images/projects/\[prj(.*?)\](.*?\..+?)(\?.*)?$', url)
    if match:
        project_num = match.group(1)
        filename = match.group(2)
        query_params = match.group(3) or ''
        return f"prj{project_num}-{filename}{query_params}"
    return url

def update_project_images():
    """Update image URLs in the project_images table."""
    try:
        # Initialize Supabase client
        supabase = get_supabase_client()
        
        # Fetch all project images
        response = supabase.table('project_images').select('*').execute()
        
        if not response.data:
            print("No project images found in the database.")
            return
        
        updated_count = 0
        
        # Process each image
        for image in response.data:
            current_url = image.get('image_url')
            if not current_url:
                continue
                
            new_url = transform_image_url(current_url)
            
            # Only update if the URL was transformed
            if new_url != current_url:
                try:
                    # Update the record in the database
                    update_response = supabase.table('project_images')\
                        .update({'image_url': new_url})\
                        .eq('id', image['id'])\
                        .execute()
                    
                    if not update_response.error:
                        print(f"Updated: {current_url} -> {new_url}")
                        updated_count += 1
                    else:
                        print(f"Error updating ID {image['id']}: {update_response.error}")
                        
                except Exception as e:
                    print(f"Error updating ID {image['id']}: {str(e)}")
        
        print(f"\nUpdate complete. {updated_count} records were updated.")
        
    except Exception as e:
        print(f"An error occurred: {str(e)}")

if __name__ == "__main__":
    print("Starting image URL update process...")
    update_project_images()
    print("Process completed.")
