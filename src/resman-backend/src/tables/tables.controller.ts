import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Permissions } from '../auth/decorators/permissions.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { CreateTableDto } from './dto/create-table.dto';
import { OpenSessionDto } from './dto/open-session.dto';
import { UpdateTableDto } from './dto/update-table.dto';
import { TablesService } from './tables.service';

@Controller('tables')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class TablesController {
  constructor(private readonly tablesService: TablesService) {}

  @Get()
  @Permissions('tables:read')
  findAll() {
    return this.tablesService.findAll();
  }

  @Get(':tableId/sessions/current')
  @Permissions('tables:read')
  getCurrentSession(@Param('tableId', ParseIntPipe) tableId: number) {
    return this.tablesService.getCurrentSession(BigInt(tableId));
  }

  @Get(':id')
  @Permissions('tables:read')
  findById(@Param('id', ParseIntPipe) id: number) {
    return this.tablesService.findById(BigInt(id));
  }

  @Post()
  @Permissions('tables:manage')
  create(@Body() dto: CreateTableDto) {
    return this.tablesService.create(dto);
  }

  @Patch(':id')
  @Permissions('tables:manage')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateTableDto,
  ) {
    return this.tablesService.update(BigInt(id), dto);
  }

  @Delete(':id')
  @Permissions('tables:manage')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.tablesService.remove(BigInt(id));
  }

  @Post(':tableId/sessions')
  @Permissions('sessions:open')
  openSession(
    @Param('tableId', ParseIntPipe) tableId: number,
    @Body() dto: OpenSessionDto,
    @CurrentUser() user: { id: string },
  ) {
    return this.tablesService.openSession(
      BigInt(tableId),
      user.id,
      dto.note,
    );
  }
}
