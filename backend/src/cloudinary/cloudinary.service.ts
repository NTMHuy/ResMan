import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { randomUUID } from "node:crypto";

type CloudinaryUploadResponse = {
  secure_url: string;
  public_id: string;
  width: number;
  height: number;
  format: string;
  error?: {
    message?: string;
  };
};

type CloudinaryDeleteResponse = {
  result?: string;
  error?: {
    message?: string;
  };
};

@Injectable()
export class CloudinaryService {
  private readonly cloudName: string;
  private readonly apiKey: string;
  private readonly apiSecret: string;

  constructor(config: ConfigService) {
    this.cloudName = config.get<string>("CLOUDINARY_CLOUD_NAME")?.trim() ?? "";

    this.apiKey = config.get<string>("CLOUDINARY_API_KEY")?.trim() ?? "";

    this.apiSecret = config.get<string>("CLOUDINARY_API_SECRET")?.trim() ?? "";

    if (!this.cloudName || !this.apiKey || !this.apiSecret) {
      throw new Error("Missing Cloudinary configuration. Check backend/.env");
    }
  }

  /**
   * HTTP Basic Authentication:
   * Authorization: Basic base64(api_key:api_secret)
   */
  private getAuthHeader(): string {
    const credentials = Buffer.from(
      `${this.apiKey}:${this.apiSecret}`,
    ).toString("base64");

    return `Basic ${credentials}`;
  }

  /**
   * Upload image to Cloudinary.
   */
  async uploadImage(buffer: Buffer): Promise<{
    imageUrl: string;
    imagePublicId: string;
    width: number;
    height: number;
    format: string;
  }> {
    const publicId = randomUUID();
    const folder = "resman/menu-items";
    const transformation = "c_limit,w_1200,h_1200,q_auto,f_auto";

    const form = new FormData();

    form.append("file", new Blob([new Uint8Array(buffer)]));
    form.append("folder", folder);
    form.append("public_id", publicId);
    form.append("transformation", transformation);

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${encodeURIComponent(
          this.cloudName,
        )}/image/upload`,
        {
          method: "POST",
          headers: {
            Authorization: this.getAuthHeader(),
          },
          body: form,
        },
      );

      const payload = (await response.json()) as CloudinaryUploadResponse;

      if (!response.ok || !payload.secure_url || !payload.public_id) {
        throw new Error(
          payload.error?.message ??
            `Cloudinary upload failed: HTTP ${response.status}`,
        );
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

  /**
   * Delete image from Cloudinary.
   */
  async deleteImage(publicId: string): Promise<void> {
    if (!publicId) return;

    const form = new URLSearchParams({
      public_id: publicId,
    });

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${encodeURIComponent(
          this.cloudName,
        )}/image/destroy`,
        {
          method: "POST",
          headers: {
            Authorization: this.getAuthHeader(),
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: form,
        },
      );

      const payload = (await response.json()) as CloudinaryDeleteResponse;

      if (
        !response.ok ||
        (payload.result !== "ok" && payload.result !== "not found")
      ) {
        throw new Error(
          payload.error?.message ??
            `Cloudinary delete failed: HTTP ${response.status}`,
        );
      }
    } catch (error) {
      console.error("Cloudinary delete error:", error);

      throw new InternalServerErrorException(
        "Không thể xóa ảnh khỏi Cloudinary.",
      );
    }
  }
}
