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
import { diskStorage } from 'multer';
import { extname } from 'node:path';
import { randomUUID } from 'node:crypto';

import { MenuItemsService } from './menu-items.service.js';
import { CreateMenuItemDto } from './dto/create-menu-item.dto.js';
import { UpdateMenuItemDto } from './dto/update-menu-item.dto.js';
import { QueryMenuItemDto } from './dto/query-menu-item.dto.js';
import { ParseBigIntPipe } from '../common/pipes/parse-bigint.pipe.js';
import {
  ensureMenuItemsUploadDirectory,
  MENU_ITEMS_UPLOAD_DIRECTORY,
  removeMenuImageFile,
} from '../common/utils/menu-image-storage.js';

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
  constructor(private readonly service: MenuItemsService) {}

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
  remove(@Param('id', ParseBigIntPipe) id: bigint) {
    return this.service.remove(id);
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
      storage: diskStorage({
        destination: (_req, _file, callback) => {
          ensureMenuItemsUploadDirectory();
          callback(null, MENU_ITEMS_UPLOAD_DIRECTORY);
        },
        filename: (_req, file, callback) => {
          const extension = extname(file.originalname).toLowerCase();
          callback(null, `${randomUUID()}${extension}`);
        },
      }),
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

    const imageUrl = `/uploads/menu-items/${file.filename}`;

    try {
      const previousItem = await this.service.findOne(id);
      const updated = await this.service.updateImage(id, imageUrl);

      if (previousItem.imageUrl && previousItem.imageUrl !== imageUrl) {
        await removeMenuImageFile(previousItem.imageUrl).catch(() => undefined);
      }

      return updated;
    } catch (error) {
      await removeMenuImageFile(imageUrl).catch(() => undefined);
      throw error;
    }
  }

  @Delete(':id/image')
  @Permissions('menu.item.update')
  async deleteImage(@Param('id', ParseBigIntPipe) id: bigint) {
    const previousItem = await this.service.findOne(id);
    const result = await this.service.deleteImage(id);
    await removeMenuImageFile(previousItem.imageUrl);
    return result;
  }
}
