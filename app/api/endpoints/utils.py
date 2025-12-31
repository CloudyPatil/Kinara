from fastapi import APIRouter, UploadFile, File, HTTPException
import cloudinary
import cloudinary.uploader
import shutil
import os

router = APIRouter()

# --- CLOUDINARY CONFIGURATION ---
# 1. Go to Cloudinary Dashboard
# 2. Copy/Paste your keys below
cloudinary.config( 
  cloud_name = "debyqsfnc", 
  api_key = "122451451313419", 
  api_secret = "8IWUrcWrYNkvL6waFfR7w0OsldI",
  secure = True
)

@router.post("/upload")
async def upload_image(file: UploadFile = File(...)):
    try:
        # Upload the file directly to Cloudinary
        # "folder" creates a neat folder in your Cloudinary account
        result = cloudinary.uploader.upload(file.file, folder="localstay_uploads")
        
        # Get the secure URL (https)
        url = result.get("secure_url")
        
        return {"url": url}
    except Exception as e:
        print(f"Cloudinary Error: {e}")
        raise HTTPException(status_code=500, detail="Image upload failed")