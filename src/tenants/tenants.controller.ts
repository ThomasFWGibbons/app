// FILE: src/tenants/tenants.controller.ts
import { Controller, Post, Body, Req, UseGuards } from '@nestjs/common';
import { TenantsService } from './tenants.service';
import { CreateTenantDto } from './dto/create-tenant.dto';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('tenants')
@ApiBearerAuth()
@Controller('tenants')
export class TenantsController {
  constructor(private readonly tenantsService: TenantsService) {}

  @Post()
  // @UseGuards(RolesGuard) - Add this back when roles are fully implemented
  // @Roles('owner') // Example: only owners can create tenants
  create(@Body() createTenantDto: CreateTenantDto, @Req() req) {
    const userId = req.user.userId;
    return this.tenantsService.create(createTenantDto, userId);
  }
}