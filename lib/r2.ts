import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { Upload } from "@aws-sdk/lib-storage";
import { createPresignedPost } from "@aws-sdk/s3-presigned-post";
import { env } from "@/env";

const accessKeyId = env.CLOUDFLARE_ACCESS_KEY_ID;
const secretAccessKey = env.CLOUDFLARE_SECRET_ACCESS_KEY;

if (!accessKeyId || !secretAccessKey) {
  throw new Error(
    "CLOUDFLARE_ACCESS_KEY and CLOUDFLARE_SECRET_KEY must be set"
  );
}

const s3Client = new S3Client({
  region: "auto",
  endpoint: `https://${env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
});

export async function getDownloadUrl(objectName: string) {
  return getSignedUrl(
    s3Client,
    new GetObjectCommand({
      Bucket: env.CLOUDFLARE_BUCKET_NAME,
      Key: objectName,
    }),
    { expiresIn: 3600 }
  );
}

export async function uploadFileToBucket(file: File, filename: string) {
  const Key = filename;
  const Bucket = env.CLOUDFLARE_BUCKET_NAME;

  let res;

  try {
    const parallelUploads = new Upload({
      client: s3Client,
      params: {
        Bucket,
        Key,
        Body: file.stream(),
        ACL: "public-read",
        ContentType: file.type,
      },
      queueSize: 4,
      leavePartsOnError: false,
    });

    res = await parallelUploads.done();
  } catch (e) {
    throw e;
  }

  return res;
}

export async function uploadImageFileAndReturnUrl(
  file: File,
  filename: string
) {
  const Key = filename;
  const Bucket = env.CLOUDFLARE_BUCKET_NAME;

  try {
    const parallelUploads = new Upload({
      client: s3Client,
      params: {
        Bucket,
        Key,
        Body: file.stream(),
        ACL: "public-read",
        ContentType: file.type,
      },
      queueSize: 4,
      leavePartsOnError: false,
    });

    await parallelUploads.done();

    // return `https://${env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com/${Bucket}/${Key}`;
    return `https://cdn.makeit.ai/${Key}`;
  } catch (e) {
    throw e;
  }
}

export async function getPresignedPostUrl(
  objectName: string,
  contentType: string
) {
  return await createPresignedPost(s3Client, {
    Bucket: env.CLOUDFLARE_BUCKET_NAME,
    Key: objectName,
    // Conditions: [
    //   ["content-length-range", 0, 1024 * 1024 * 2],
    //   ["starts-with", "$Content-Type", contentType],
    // ],
    Expires: 600, // 10 minutes
    // Fields: {
    //   // acl: "public-read",
    //   "Content-Type": contentType,
    // },
  });
}

export async function getFileUrl({ key }: { key: string }) {
  const url = await getSignedUrl(
    s3Client,
    new GetObjectCommand({
      Bucket: env.CLOUDFLARE_BUCKET_NAME,
      Key: key,
    }),
    { expiresIn: 3600 }
  );
  return url;
}
