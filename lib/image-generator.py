#!/usr/bin/env python3

import os
import sys
import json
import google.generativeai as genai
from PIL import Image
import requests
from io import BytesIO
import base64
import re

# Configure the Google Generative AI client
api_key = os.environ.get("GEMINI_API_KEY")
if not api_key:
    print("Error: GEMINI_API_KEY environment variable not set")
    sys.exit(1)

genai.configure(api_key=api_key)

def extract_image_url(text):
    """Extract image URL from model response text."""
    # Look for markdown image syntax
    pattern = r'!\[.*?\]\((.*?)\)'
    match = re.search(pattern, text)
    if match:
        return match.group(1)
    
    # Look for direct URLs
    url_pattern = r'https?://\S+\.(?:jpg|jpeg|png|gif|webp)'
    match = re.search(url_pattern, text)
    if match:
        return match.group(0)
    
    return None

def save_image_from_url(url, output_path):
    """Download and save image from URL."""
    try:
        response = requests.get(url, stream=True)
        response.raise_for_status()
        
        # Determine file extension
        content_type = response.headers.get('content-type', '')
        ext = content_type.split('/')[-1]
        if ext not in ['jpeg', 'jpg', 'png', 'gif', 'webp']:
            ext = 'png'  # Default
        
        final_path = f"{output_path}.{ext}"
        
        img = Image.open(BytesIO(response.content))
        img.save(final_path)
        print(f"Image saved to: {final_path}")
        return final_path
    except Exception as e:
        print(f"Error saving image: {e}")
        return None

def generate_image(prompt):
    """Generate an image using Gemini."""
    try:
        # Use Gemini 1.5 Pro for image generation
        model = genai.GenerativeModel('gemini-1.5-pro')
        
        # Generate image
        response = model.generate_content(
            f"""Create a high-quality image based on this description: {prompt}
            Please generate a detailed, professional-looking image that would be suitable for a portfolio or resume website.
            Respond with the image only, no text."""
        )
        
        # Extract image URL from response
        image_url = extract_image_url(response.text)
        
        if not image_url:
            print("No image URL found in the response.")
            return None
            
        return image_url
    except Exception as e:
        print(f"Error generating image: {e}")
        return None

def main():
    print("Enter image generation prompt:")
    prompt = input().strip()
    
    if not prompt:
        print("Error: Empty prompt")
        sys.exit(1)
    
    print(f"Generating image for: {prompt}")
    image_url = generate_image(prompt)
    
    if not image_url:
        print("Failed to generate image")
        sys.exit(1)
    
    print("Enter output filename (without extension):")
    output_path = input().strip()
    
    if not output_path:
        print("Error: Empty filename")
        sys.exit(1)
    
    final_path = save_image_from_url(image_url, output_path)
    
    if final_path:
        # Return file path to Node.js
        print(f"Image successfully generated and saved to: {final_path}")
        sys.exit(0)
    else:
        print("Failed to save image")
        sys.exit(1)

if __name__ == "__main__":
    main() 