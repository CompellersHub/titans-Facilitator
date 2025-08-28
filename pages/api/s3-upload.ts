import { NextApiRequest, NextApiResponse } from "next";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { S3_CONFIG } from "@/lib/s3-config";
import Busboy from "busboy";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const bb = Busboy({ headers: req.headers });
  let fileBuffer: Buffer | null = null;
  let fileName = "";
  let mimeType = "";

  bb.on("file", (_fieldname: string, file: NodeJS.ReadableStream, info: { filename: string; mimeType: string }) => {
    fileName = info.filename;
    mimeType = info.mimeType;
    const chunks: Buffer[] = [];
    file.on("data", (data: Buffer) => {
      chunks.push(data);
    });
    file.on("end", () => {
      fileBuffer = Buffer.concat(chunks);
    });
  });

  bb.on("finish", async () => {
    if (!fileBuffer) {
      return res.status(400).json({ success: false, error: "No file uploaded" });
    }
    const s3Client = new S3Client({
      region: S3_CONFIG.region,
      credentials: {
        accessKeyId: S3_CONFIG.accessKeyId,
        secretAccessKey: S3_CONFIG.secretAccessKey,
      },
    });
    const key = `library/${Date.now()}-${fileName.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
    try {
      await s3Client.send(
        new PutObjectCommand({
          Bucket: S3_CONFIG.bucket,
          Key: key,
          Body: fileBuffer,
          ContentType: mimeType,
        })
      );
      const url = `https://${S3_CONFIG.bucket}.s3.${S3_CONFIG.region}.amazonaws.com/${key}`;
      return res.status(200).json({ success: true, url });
    } catch (error) {
      console.error("S3 upload error:", error);
      return res.status(500).json({ success: false, error: "S3 upload failed" });
    }
  });

  req.pipe(bb);
}
