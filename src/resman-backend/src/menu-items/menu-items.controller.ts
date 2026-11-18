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
import { extname } from 'path';

import { MenuItemsService } from './menu-items.service';

import { CreateMenuItemDto } from './dto/create-menu-item.dto';
import { UpdateMenuItemDto } from './dto/update-menu-item.dto';
import { QueryMenuItemDto } from './dto/query-menu-item.dto';

import { ParseBigIntPipe } from '../common/pipes/parse-bigint.pipe';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { Permissions } from '../auth/decorators/permissions.decorator';

@Controller('menu-items')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class MenuItemsController {
  constructor(private readonly service: MenuItemsService) {}

  // CREATE
  @Post()
  @Permissions('menu.item.create')
  create(@Body() dto: CreateMenuItemDto) {
    return this.service.create(dto);
  }

  // LIST
  @Get()
  @Permissions('menu.item.read')
  findAll(@Query() query: QueryMenuItemDto) {
    return this.service.findAll(query);
  }

  // DETAIL
  @Get(':id')
  @Permissions('menu.item.read')
  findOne(@Param('id', ParseBigIntPipe) id: bigint) {
    return this.service.findOne(id);
  }

  // UPDATE
  @Patch(':id')
  @Permissions('menu.item.update')
  update(
    @Param('id', ParseBigIntPipe) id: bigint,
    @Body() dto: UpdateMenuItemDto,
  ) {
    return this.service.update(id, dto);
  }

  // DELETE
  @Delete(':id')
  @Permissions('menu.item.delete')
  remove(@Param('id', ParseBigIntPipe) id: bigint) {
    return this.service.remove(id);
  }

  // CHANGE STATUS
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

  // UPLOAD IMAGE
  @Post(':id/image')
  @Permissions('menu.item.update')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads/menu-items',
        filename: (_req, file, callback) => {
          const uniqueName =
            `${Date.now()}-${Math.round(Math.random() * 1e9)}` +
            extname(file.originalname).toLowerCase();

          callback(null, uniqueName);
        },
      }),

      limits: {
        fileSize: 5 * 1024 * 1024,
      },

      fileFilter: (_req, file, callback) => {
        if (!file.mimetype.match(/^image\/(jpeg|png|webp)$/)) {
          return callback(
            new BadRequestException(
              'Only JPG, PNG and WEBP images are allowed',
            ),
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

    return this.service.updateImage(id, imageUrl);
  }

  // DELETE IMAGE
  @Delete(':id/image')
  @Permissions('menu.item.update')
  deleteImage(@Param('id', ParseBigIntPipe) id: bigint) {
    return this.service.deleteImage(id);
  }
}
