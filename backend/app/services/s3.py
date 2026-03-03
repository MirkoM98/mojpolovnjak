import uuid
import os
from fastapi import UploadFile
from ..config import get_settings

settings = get_settings()


async def upload_image(file: UploadFile) -> str:
    ext = file.filename.split(".")[-1] if file.filename else "jpg"
    filename = f"{uuid.uuid4()}.{ext}"

    if settings.cloudinary_cloud_name:
        import cloudinary
        import cloudinary.uploader

        cloudinary.config(
            cloud_name=settings.cloudinary_cloud_name,
            api_key=settings.cloudinary_api_key,
            api_secret=settings.cloudinary_api_secret,
        )
        contents = await file.read()
        result = cloudinary.uploader.upload(
            contents,
            folder="mojpolovnjak",
            public_id=filename.rsplit(".", 1)[0],
            resource_type="image",
        )
        return result["secure_url"]

    if settings.aws_access_key_id and settings.aws_access_key_id != "your-aws-access-key":
        import boto3

        s3 = boto3.client(
            "s3",
            aws_access_key_id=settings.aws_access_key_id,
            aws_secret_access_key=settings.aws_secret_access_key,
            region_name=settings.aws_region,
        )
        key = f"cars/{filename}"
        s3.upload_fileobj(
            file.file,
            settings.aws_bucket_name,
            key,
            ExtraArgs={"ContentType": file.content_type or "image/jpeg"},
        )
        return f"https://{settings.aws_bucket_name}.s3.{settings.aws_region}.amazonaws.com/{key}"

    upload_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "uploads")
    os.makedirs(upload_dir, exist_ok=True)
    filepath = os.path.join(upload_dir, filename)
    contents = await file.read()
    with open(filepath, "wb") as f:
        f.write(contents)
    return f"/uploads/{filename}"
