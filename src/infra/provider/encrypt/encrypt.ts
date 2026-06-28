import crypto from "crypto";

interface EncryptData {
    id:string
}

export function generateApiToken(req: EncryptData): string {
    const key = Buffer.from(
      process.env.SECRET_API_TOKEN_KEY!,
      "hex"
    );

    const iv = crypto.randomBytes(16);

    const cipher = crypto.createCipheriv(
      "aes-256-cbc",
      key,
      iv
    );

    const encrypted =
      cipher.update(req.id, "utf8", "hex") +
      cipher.final("hex");

    return `${iv.toString("hex")}:${encrypted}`;
  }