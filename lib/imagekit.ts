import ImageKit from "imagekit";
import { MAX_PROOF_BYTES, PROOF_MIME_TYPES } from "./constants";

function getImageKit() {
  const publicKey = process.env.IMAGEKIT_PUBLIC_KEY;
  const privateKey = process.env.IMAGEKIT_PRIVATE_KEY;
  const urlEndpoint = process.env.IMAGEKIT_URL_ENDPOINT;

  if (!publicKey || !privateKey || !urlEndpoint) {
    throw new Error(
      "ImageKit is not configured. Add IMAGEKIT_PUBLIC_KEY, IMAGEKIT_PRIVATE_KEY, and IMAGEKIT_URL_ENDPOINT."
    );
  }

  return new ImageKit({ publicKey, privateKey, urlEndpoint });
}

export async function uploadProofImage(file: File) {
  if (file.size > MAX_PROOF_BYTES) {
    throw new Error("Proof image must be 8 MB or smaller.");
  }

  if (!PROOF_MIME_TYPES.includes(file.type as (typeof PROOF_MIME_TYPES)[number])) {
    throw new Error("Proof must be a JPG, PNG, WEBP, or GIF image.");
  }

  const imagekit = getImageKit();
  const buffer = Buffer.from(await file.arrayBuffer());
  const safeName = file.name.replace(/[^\w.\-]+/g, "_");

  const result = await imagekit.upload({
    file: buffer,
    fileName: `${Date.now()}-${safeName}`,
    folder: "/arrvak/proofs",
    useUniqueFileName: true,
  });

  return {
    url: result.url,
    fileId: result.fileId,
  };
}
