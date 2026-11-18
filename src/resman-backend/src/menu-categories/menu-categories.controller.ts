import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';

import { MenuCategoriesService } from './menu-categories.service';

import { CreateMenuCategoryDto } from './dto/create-menu-category.dto';
import { UpdateMenuCategoryDto } from './dto/update-menu-category.dto';
import { QueryMenuCategoryDto } from './dto/query-menu-category.dto';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { Permissions } from '../auth/decorators/permissions.decorator';

import { ParseBigIntPipe } from '../common/pipes/parse-bigint.pipe';

@Controller('menu-categories')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class MenuCategoriesController {
  constructor(private readonly service: MenuCategoriesService) {}

  @Post()
  @Permissions('menu.category.create')
  create(@Body() dto: CreateMenuCategoryDto) {
    return this.service.create(dto);
  }

  @Get()
  @Permissions('menu.category.read')
  findAll(@Query() query: QueryMenuCategoryDto) {
    return this.service.findAll(query);
  }

  @Get(':id')
  @Permissions('menu.category.read')
  findOne(@Param('id', ParseBigIntPipe) id: bigint) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  @Permissions('menu.category.update')
  update(
    @Param('id', ParseBigIntPipe) id: bigint,
    @Body() dto: UpdateMenuCategoryDto,
  ) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @Permissions('menu.category.delete')
  remove(@Param('id', ParseBigIntPipe) id: bigint) {
    return this.service.remove(id);
  }
}
