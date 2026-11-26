import { v2 as cloudinary } from 'cloudinary';

let configured = false;

export function configureCloudinary() {
  if (configured) return;
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
  configured = true;
}

export async function uploadToCloudinary(
  filePath: string,
  options: {
    folder?: string;
    resourceType?: 'image' | 'raw' | 'auto';
    publicId?: string;
  } = {}
): Promise<{
  url: string;
  secure_url: string;
  publicId: string;
  public_id: string;
  bytes: number;
}> {
  configureCloudinary();
  const result = await cloudinary.uploader.upload(filePath, {
    folder: options.folder || 'portfolio',
    resource_type: options.resourceType || 'auto',
    public_id: options.publicId,
    overwrite: true,
  });
  return {
    url: result.secure_url,
    secure_url: result.secure_url,
    publicId: result.public_id,
    public_id: result.public_id,
    bytes: result.bytes,
  };
}

export async function deleteFromCloudinary(
  publicId: string,
  resourceType: 'image' | 'raw' = 'raw'
): Promise<void> {
  configureCloudinary();
  await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
}

export { cloudinary };
