import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UploadedFile,
  UseInterceptors,
  UseGuards,
  BadRequestException,
  ParseBoolPipe,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { extname } from 'node:path';

import { MenuItemsService } from './menu-items.service.js';
import { CreateMenuItemDto } from './dto/create-menu-item.dto.js';
import { UpdateMenuItemDto } from './dto/update-menu-item.dto.js';
import { QueryMenuItemDto } from './dto/query-menu-item.dto.js';
import { ParseBigIntPipe } from '../common/pipes/parse-bigint.pipe.js';
import { removeMenuImageFile } from '../common/utils/menu-image-storage.js';
import { CloudinaryService } from '../cloudinary/cloudinary.service.js';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { PermissionsGuard } from '../auth/guards/permissions.guard.js';
import { Permissions } from '../auth/decorators/permissions.decorator.js';

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES: Record<string, string> = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
};

@Controller('menu-items')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class MenuItemsController {
  constructor(
    private readonly service: MenuItemsService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  @Post()
  @Permissions('menu.item.create')
  create(@Body() dto: CreateMenuItemDto) {
    return this.service.create(dto);
  }

  @Get()
  @Permissions('menu.item.read')
  findAll(@Query() query: QueryMenuItemDto) {
    return this.service.findAll(query);
  }

  @Get(':id')
  @Permissions('menu.item.read')
  findOne(@Param('id', ParseBigIntPipe) id: bigint) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  @Permissions('menu.item.update')
  update(
    @Param('id', ParseBigIntPipe) id: bigint,
    @Body() dto: UpdateMenuItemDto,
  ) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @Permissions('menu.item.delete')
  async remove(@Param('id', ParseBigIntPipe) id: bigint) {
    const existingItem = await this.service.findOne(id);
    const result = await this.service.remove(id);

    if (existingItem.imagePublicId) {
      await this.cloudinaryService.deleteImage(existingItem.imagePublicId).catch((error) => {
        console.error('Cannot delete Cloudinary image after menu item removal:', error);
      });
    } else {
      await removeMenuImageFile(existingItem.imageUrl).catch((error) => {
        console.error('Cannot remove legacy local image:', error);
      });
    }

    return result;
  }

  @Patch(':id/status')
  @Permissions('menu.item.update')
  updateStatus(
    @Param('id', ParseBigIntPipe) id: bigint,
    @Body('isActive', ParseBoolPipe) isActive: boolean,
    @Body('availabilityStatus') availabilityStatus?: string,
    @Body('availabilityReason') availabilityReason?: string,
  ) {
    return this.service.updateStatus(
      id,
      isActive,
      availabilityStatus,
      availabilityReason,
    );
  }

  // The multipart field name is "file" and matches the Frontend FormData contract.
  @Post(':id/image')
  @Permissions('menu.item.update')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
      limits: { fileSize: MAX_IMAGE_SIZE, files: 1 },
      fileFilter: (_req, file, callback) => {
        const extension = extname(file.originalname).toLowerCase();
        const expectedMimeType = ALLOWED_IMAGE_TYPES[extension];

        if (!expectedMimeType || file.mimetype.toLowerCase() !== expectedMimeType) {
          return callback(
            new BadRequestException('Only JPG, JPEG, PNG and WEBP images are allowed'),
            false,
          );
        }

        callback(null, true);
      },
    }),
  )
  async uploadImage(
    @Param('id', ParseBigIntPipe) id: bigint,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('Image file is required');
    }

    // Confirm the menu item exists before creating a Cloudinary asset.
    const previousItem = await this.service.findOne(id);

    // Upload first, then persist both URL and public_id.
    const uploaded = await this.cloudinaryService.uploadImage(file.buffer);

    let updated: unknown;
    try {
      updated = await this.service.updateImage(
        id,
        uploaded.imageUrl,
        uploaded.imagePublicId,
      );
    } catch (error) {
      // Avoid orphaning the newly uploaded asset if PostgreSQL update fails.
      await this.cloudinaryService.deleteImage(uploaded.imagePublicId).catch((cleanupError) => {
        console.error('Cannot clean up newly uploaded Cloudinary image:', cleanupError);
      });
      throw error;
    }

    // Delete the previous asset only after the database points to the new image.
    if (previousItem.imagePublicId) {
      await this.cloudinaryService.deleteImage(previousItem.imagePublicId).catch((error) => {
        console.error('Cannot delete previous Cloudinary image:', error);
      });
    } else if (previousItem.imageUrl) {
      // Backward compatibility for images uploaded before Cloudinary migration.
      await removeMenuImageFile(previousItem.imageUrl).catch((error) => {
        console.error('Cannot remove previous local image:', error);
      });
    }

    return updated;
  }

  @Delete(':id/image')
  @Permissions('menu.item.update')
  async deleteImage(@Param('id', ParseBigIntPipe) id: bigint) {
    const previousItem = await this.service.findOne(id);
    const result = await this.service.deleteImage(id);

    if (previousItem.imagePublicId) {
      await this.cloudinaryService.deleteImage(previousItem.imagePublicId).catch((error) => {
        console.error('Cannot delete Cloudinary image:', error);
      });
    } else {
      await removeMenuImageFile(previousItem.imageUrl).catch((error) => {
        console.error('Cannot remove legacy local image:', error);
      });
    }

    return result;
  }
}
