import { S3Client, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';

const s3Client = new S3Client({
  region: import.meta.env.VITE_AWS_REGION,
  credentials: {
    accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY_ID,
    secretAccessKey: import.meta.env.VITE_AWS_SECRET_ACCESS_KEY,
  },
});

const BUCKET = import.meta.env.VITE_S3_BUCKET;
const PUBLIC_URL = import.meta.env.VITE_S3_PUBLIC_URL;

/**
 * Uploads a file to S3 under the given key.
 * @param {File} file - The browser File object
 * @param {string} key - The S3 object key (e.g. "covers/uuid-filename.jpg")
 * @param {(pct: number) => void} [onProgress] - Optional progress callback (0-100)
 * @returns {Promise<string>} The public URL of the uploaded file
 */
export async function uploadToS3(file, key, onProgress) {
  const upload = new Upload({
    client: s3Client,
    params: {
      Bucket: BUCKET,
      Key: key,
      Body: file,
      ContentType: file.type,
    },
  });

  upload.on('httpUploadProgress', (progress) => {
    if (onProgress && progress.total) {
      onProgress(Math.round((progress.loaded / progress.total) * 100));
    }
  });

  await upload.done();
  return `${PUBLIC_URL}/${key}`;
}

/**
 * Deletes an object from S3 by key.
 * @param {string} key - The S3 object key to delete
 */
export async function deleteFromS3(key) {
  if (!key) return;
  await s3Client.send(new DeleteObjectCommand({ Bucket: BUCKET, Key: key }));
}

/**
 * Generates a unique S3 key for a file.
 * @param {string} folder - e.g. "covers", "thumbnails", "books", "attachments"
 * @param {string} filename - The original filename
 * @returns {string} e.g. "covers/a1b2c3d4-myfile.jpg"
 */
export function generateS3Key(folder, filename) {
  const ext = filename.split('.').pop().toLowerCase();
  const base = filename
    .replace(/\.[^/.]+$/, '')
    .replace(/[^a-z0-9]/gi, '-')
    .toLowerCase()
    .slice(0, 40);
  const uid = crypto.randomUUID().split('-')[0];
  return `${folder}/${uid}-${base}.${ext}`;
}
