import { Module } from '@nestjs/common';

import { MenuCategoriesController } from './menu-categories.controller.js';
import { MenuCategoriesService } from './menu-categories.service.js';

@Module({
  controllers: [MenuCategoriesController],
  providers: [MenuCategoriesService],
  exports: [MenuCategoriesService],
})
export class MenuCategoriesModule {}
