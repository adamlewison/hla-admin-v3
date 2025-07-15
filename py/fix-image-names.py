#!/usr/bin/env python3
"""
Fix image names in ~/Downloads/ files.

This script renames image files from the format '[prj*]*.*' to 'prj*-*.*'.
For example: '[prj1]095.jpg' becomes 'prj1-095.jpg'
"""

import os
import re
from pathlib import Path

def rename_images(directory=os.path.expanduser('~/Downloads/project_images')):
    """
    Rename image files in the specified directory from '[prj*]*.*' to 'prj*-*.*' format.
    
    Args:
        directory (str): Path to the directory containing the images (default: ~/Downloads)
    """
    # Change to the specified directory
    try:
        os.chdir(directory)
    except FileNotFoundError:
        print(f"Error: Directory not found: {directory}")
        return
    except PermissionError:
        print(f"Error: No permission to access directory: {directory}")
        return
    
    print(f"Looking for images in: {directory}")
    
    # Regular expression to match [prj*]*.* pattern
    pattern = re.compile(r'\[prj(.*?)\](.*?\..+)$')
    
    renamed_count = 0
    
    # Iterate through all files in the directory
    for filename in os.listdir('.'):
        # Skip directories
        if not os.path.isfile(filename):
            continue
            
        # Check if the filename matches our pattern
        match = pattern.match(filename)
        if match:
            # Extract the project number and the rest of the filename
            project_num = match.group(1)
            rest_of_name = match.group(2)
            
            # Create the new filename
            new_filename = f"prj{project_num}-{rest_of_name}"
            
            # Skip if the new filename already exists
            if os.path.exists(new_filename):
                print(f"Skipped: {filename} (target file {new_filename} already exists)")
                continue
                
            # Rename the file
            try:
                os.rename(filename, new_filename)
                print(f"Renamed: {filename} -> {new_filename}")
                renamed_count += 1
            except OSError as e:
                print(f"Error renaming {filename}: {e}")
    
    if renamed_count == 0:
        print("No matching files found.")
    else:
        print(f"\nSuccessfully renamed {renamed_count} files.")

if __name__ == "__main__":
    # You can specify a different directory by passing it as an argument:
    # rename_images("/path/to/your/directory")
    rename_images()
