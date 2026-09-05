import fs from 'fs/promises';
import path from 'path';
import sharp from 'sharp';
import prisma from './prisma';

const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads');

export async function ensureUploadDir() {
  try {
    await fs.mkdir(UPLOAD_DIR, { recursive: true });
  } catch (err) {
    console.error('Failed to create upload dir:', err);
  }
}

export interface ProcessedMedia {
  filename: string;
  originalFilename: string;
  mimeType: string;
  fileSize: number;
  width: number | null;
  height: number | null;
  storagePath: string;
  publicUrl: string;
}

export async function processAndSaveImage(
  buffer: Buffer,
  originalFilename: string,
  category: string = 'general'
) {
  await ensureUploadDir();

  const timestamp = Date.now();
  const randomStr = Math.random().toString(36).substring(2, 8);
  const extMatch = originalFilename.match(/\.([a-zA-Z0-9]+)$/);
  const ext = extMatch ? extMatch[1].toLowerCase() : 'png';
  const cleanBase = originalFilename
    .replace(/\.[^/.]+$/, '')
    .replace(/[^a-zA-Z0-9_-]/g, '_')
    .substring(0, 30);

  // 1. Handle SVG directly (never convert vectors to raster WebP)
  if (ext === 'svg') {
    const filename = `${cleanBase}_${timestamp}_${randomStr}.svg`;
    const targetPath = path.join(UPLOAD_DIR, filename);
    await fs.writeFile(targetPath, buffer);
    const publicUrl = `/uploads/${filename}`;

    const asset = await prisma.mediaAsset.create({
      data: {
        filename,
        originalFilename,
        mimeType: 'image/svg+xml',
        fileSize: buffer.length,
        width: null,
        height: null,
        storagePath: targetPath,
        publicUrl,
        category,
        altText: cleanBase.replace(/_/g, ' '),
      },
    });
    return asset;
  }

  // 2. Handle ICO directly
  if (ext === 'ico') {
    const filename = `${cleanBase}_${timestamp}_${randomStr}.ico`;
    const targetPath = path.join(UPLOAD_DIR, filename);
    await fs.writeFile(targetPath, buffer);
    const publicUrl = `/uploads/${filename}`;

    const asset = await prisma.mediaAsset.create({
      data: {
        filename,
        originalFilename,
        mimeType: 'image/x-icon',
        fileSize: buffer.length,
        width: 32,
        height: 32,
        storagePath: targetPath,
        publicUrl,
        category,
        altText: cleanBase.replace(/_/g, ' '),
      },
    });
    return asset;
  }

  // 3. Raster images: Optimize to WebP with Sharp (with safe fallback)
  try {
    const sharpInstance = sharp(buffer);
    const metadata = await sharpInstance.metadata();

    // Resize if wider than 2560px for web optimization
    if (metadata.width && metadata.width > 2560) {
      sharpInstance.resize({ width: 2560, withoutEnlargement: true });
    }

    const optimizedBuffer = await sharpInstance
      .webp({ quality: 85, effort: 4 })
      .toBuffer();

    const filename = `${cleanBase}_${timestamp}_${randomStr}.webp`;
    const targetPath = path.join(UPLOAD_DIR, filename);
    await fs.writeFile(targetPath, optimizedBuffer);

    const finalMetadata = await sharp(optimizedBuffer).metadata();
    const publicUrl = `/uploads/${filename}`;

    const asset = await prisma.mediaAsset.create({
      data: {
        filename,
        originalFilename,
        mimeType: 'image/webp',
        fileSize: optimizedBuffer.length,
        width: finalMetadata.width || null,
        height: finalMetadata.height || null,
        storagePath: targetPath,
        publicUrl,
        category,
        altText: cleanBase.replace(/_/g, ' '),
      },
    });
    return asset;
  } catch (sharpError) {
    console.warn('Sharp optimization fallback triggered:', sharpError);
    // Safe fallback: Write original buffer to disk directly
    const filename = `${cleanBase}_${timestamp}_${randomStr}.${ext}`;
    const targetPath = path.join(UPLOAD_DIR, filename);
    await fs.writeFile(targetPath, buffer);
    const publicUrl = `/uploads/${filename}`;

    const mimeMap: Record<string, string> = {
      jpg: 'image/jpeg',
      jpeg: 'image/jpeg',
      png: 'image/png',
      webp: 'image/webp',
      gif: 'image/gif',
      avif: 'image/avif',
    };

    const asset = await prisma.mediaAsset.create({
      data: {
        filename,
        originalFilename,
        mimeType: mimeMap[ext] || 'image/jpeg',
        fileSize: buffer.length,
        width: null,
        height: null,
        storagePath: targetPath,
        publicUrl,
        category,
        altText: cleanBase.replace(/_/g, ' '),
      },
    });
    return asset;
  }
}

export async function safelyDeleteMediaAsset(id: string) {
  const asset = await prisma.mediaAsset.findUnique({
    where: { id },
    include: {
      servicesAsCover: true,
      portfolioAsCover: true,
      testimonialsAsPhoto: true,
      clientBrandsAsLogo: true,
    },
  });

  if (!asset) return null;

  // 1. Unlink any page section references
  await prisma.pageSection.updateMany({
    where: { mediaId: id },
    data: { mediaId: null },
  });

  // 2. Unlink global settings if used
  await prisma.siteSettings.updateMany({
    where: { logoMediaId: id },
    data: { logoMediaId: null },
  });
  await prisma.siteSettings.updateMany({
    where: { faviconMediaId: id },
    data: { faviconMediaId: null },
  });

  // 3. Delete file from disk if exists
  try {
    if (asset.storagePath) {
      await fs.unlink(asset.storagePath);
    }
  } catch (err) {
    console.warn(`File already deleted or missing on disk: ${asset.storagePath}`);
  }

  // 4. Delete the database record
  await prisma.mediaAsset.delete({
    where: { id },
  });

  return asset;
}
