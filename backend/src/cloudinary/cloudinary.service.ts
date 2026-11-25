import {
  Injectable,
  InternalServerErrorException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { createHash, randomUUID } from "node:crypto";

type CloudinaryUploadResponse = {
  secure_url: string;
  public_id: string;
  width: number;
  height: number;
  format: string;
};

@Injectable()
export class CloudinaryService {
  private readonly cloudName: string;
  private readonly apiKey: string;
  private readonly apiSecret: string;

  constructor(config: ConfigService) {
    this.cloudName = config.get<string>("CLOUDINARY_CLOUD_NAME") ?? "";
    this.apiKey = config.get<string>("CLOUDINARY_API_KEY") ?? "";
    this.apiSecret = config.get<string>("CLOUDINARY_API_SECRET") ?? "";

    if (!this.cloudName || !this.apiKey || !this.apiSecret) {
      throw new Error(
        "Missing Cloudinary configuration. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET in backend/.env",
      );
    }
  }

  private signature(params: Record<string, string | number>): string {
    const payload = Object.keys(params)
      .sort()
      .map((key) => `${key}=${params[key]}`)
      .join("&");

    // Cloudinary's API signature is SHA-1(params + api_secret).
    return createHash("sha1")
      .update(payload + this.apiSecret)
      .digest("hex");
  }

  async uploadImage(buffer: Buffer): Promise<{
    imageUrl: string;
    imagePublicId: string;
    width: number;
    height: number;
    format: string;
  }> {
    const timestamp = Math.floor(Date.now() / 1000);
    const publicId = randomUUID();
    const folder = "resman/menu-items";
    const params = { folder, public_id: publicId, timestamp };

    const form = new FormData();
    form.append("file", new Blob([new Uint8Array(buffer)]));
    form.append("api_key", this.apiKey);
    form.append("timestamp", String(timestamp));
    form.append("folder", folder);
    form.append("public_id", publicId);
    form.append("signature", this.signature(params));
    form.append("transformation", "c_limit,w_1200,h_1200,q_auto,f_auto");

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${encodeURIComponent(this.cloudName)}/image/upload`,
        { method: "POST", body: form },
      );

      const payload = await response.json() as CloudinaryUploadResponse & {
        error?: { message?: string };
      };

      if (!response.ok || !payload.secure_url || !payload.public_id) {
        throw new Error(payload.error?.message ?? `Cloudinary upload failed: HTTP ${response.status}`);
      }

      return {
        imageUrl: payload.secure_url,
        imagePublicId: payload.public_id,
        width: payload.width,
        height: payload.height,
        format: payload.format,
      };
    } catch (error) {
      console.error("Cloudinary upload error:", error);
      throw new InternalServerErrorException(
        "Không thể upload ảnh lên Cloudinary. Kiểm tra cấu hình và kết nối mạng.",
      );
    }
  }

  async deleteImage(publicId: string): Promise<void> {
    if (!publicId) return;

    const timestamp = Math.floor(Date.now() / 1000);
    const params = { public_id: publicId, timestamp };
    const form = new URLSearchParams({
      public_id: publicId,
      timestamp: String(timestamp),
      api_key: this.apiKey,
      signature: this.signature(params),
    });

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${encodeURIComponent(this.cloudName)}/image/destroy`,
        {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: form,
        },
      );

      const payload = await response.json() as { result?: string; error?: { message?: string } };
      if (!response.ok || (payload.result !== "ok" && payload.result !== "not found")) {
        throw new Error(payload.error?.message ?? `Cloudinary delete failed: HTTP ${response.status}`);
      }
    } catch (error) {
      console.error("Cloudinary delete error:", error);
      throw new InternalServerErrorException(
        "Không thể xóa ảnh khỏi Cloudinary.",
      );
    }
  }
}
