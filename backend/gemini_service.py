import google.generativeai as genai
import pathlib
import textwrap
from PIL import Image
import os
from dotenv import load_dotenv

load_dotenv()

# Configure the Gemini API
genai.configure(api_key="AIzaSyA3TClaCMiBiZ2YtWX21c8-dVMZsQxeX-4")
model = genai.GenerativeModel('gemini-2.0-flash')

def extract_text_from_image(image_path):
    try:
        # Load and prepare the image
        img = Image.open(image_path)
        
        # Generate content from image
        response = model.generate_content(["Extract and return only the text content from this image.", img])
        print(response.text)
        # Return the extracted text
        return response.text
        
    except Exception as e:
        print(f"Error in Gemini service: {str(e)}")
        raise Exception("Failed to process image with Gemini")