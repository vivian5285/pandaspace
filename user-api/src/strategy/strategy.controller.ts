import { 
  Controller, 
  Get, 
  Post, 
  Put, 
  Param, 
  Body, 
  UseGuards, 
  Request 
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { StrategyService } from './strategy.service';
import { CreateStrategyDto, UpdateStrategyStatusDto } from './dto/strategy.dto';
import { StrategyStatus } from './schemas/strategy-record.schema';

@Controller('strategy')
@UseGuards(AuthGuard('jwt'))
export class StrategyController {
  constructor(private strategyService: StrategyService) {}

  @Get()
  async getAllStrategies(@Request() req) {
    return this.strategyService.getAllStrategies(req.user.userId);
  }

  @Get(':id')
  async getStrategy(@Request() req, @Param('id') id: string) {
    return this.strategyService.getStrategy(req.user.userId, id);
  }

  @Post()
  async createStrategy(
    @Request() req,
    @Body() createStrategyDto: CreateStrategyDto,
  ) {
    return this.strategyService.createStrategy(req.user.userId, createStrategyDto);
  }

  @Put(':id/enable')
  async enableStrategy(@Request() req, @Param('id') id: string) {
    return this.strategyService.updateStrategyStatus(
      req.user.userId,
      id,
      StrategyStatus.ENABLED,
    );
  }

  @Put(':id/disable')
  async disableStrategy(@Request() req, @Param('id') id: string) {
    return this.strategyService.updateStrategyStatus(
      req.user.userId,
      id,
      StrategyStatus.DISABLED,
    );
  }
} 