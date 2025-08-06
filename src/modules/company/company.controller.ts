import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CompanyService } from './company.service';
import { GetCompanyArgs, GetCompanySortArgs } from './dto/company.args';
import { UserContext } from 'src/common/decorators/user-context.decorator';
import { UserPayload } from 'src/interfaces/user-context';
import { Role } from 'src/interfaces/enums/role';
import {
  CompanyCreateInput,
  CompanyUpdateInput,
  CompanyUpdateStatusInput,
} from './dto/company.input';
import { AdminOrSuperAdmin } from 'src/common/decorators/role.decorator';

@Controller('company')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @Post('/')
  createCompany(
    @Body() input: CompanyCreateInput,
    @UserContext() context: UserPayload,
  ) {
    //upload logo,
    //update ownerId
    const logo = '';

    return this.companyService.create(input, logo, context);
  }

  @Get('/')
  getAllCompany(
    @Query() query: GetCompanyArgs,
    @Query() sort: GetCompanySortArgs,
    @UserContext() context: UserPayload,
  ) {
    //* If role is User then it will fetch only it's own company  *//
    if (context.role === Role.USER) {
      query.ownerId = context.id;
    }
    return this.companyService.findAll(query, sort);
  }

  @Get('/')
  getCompanyById(
    @Param('id') companyId: string,
    @UserContext() context: UserPayload,
  ) {
    return this.companyService.findOneById(companyId, context);
  }

  @Patch('/')
  updateCompanyById(
    @Body() input: CompanyUpdateInput,
    @UserContext() context: UserPayload,
  ) {
    return this.companyService.updateOneById(input, context);
  }

  @Delete()
  deleteCompanyById(
    @Param('id') companyId: string,
    @UserContext() context: UserPayload,
  ) {
    return this.companyService.deleteOneById(companyId, context);
  }

  @AdminOrSuperAdmin()
  @Post('/activation')
  updateCompanyActivationStatus(
    @Body() input: CompanyUpdateStatusInput,
    @UserContext() context: UserPayload,
  ) {
    return this.companyService.updateStatus(input, context);
  }
}
