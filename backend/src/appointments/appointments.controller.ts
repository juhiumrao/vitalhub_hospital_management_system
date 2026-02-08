import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('appointments')
@UseGuards(AuthGuard('jwt'))
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) { }

  @Post()
  create(@Body() createAppointmentDto: CreateAppointmentDto, @Request() req) {
    return this.appointmentsService.create(createAppointmentDto, req.user.userId);
  }

  @Get()
  findAll(@Request() req) {
    return this.appointmentsService.findAll(req.user.userId, req.user.role);
  }

  @Patch(':id/status')
  updateStatus(@Param('id') id: string, @Body() body: { status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' }) {
    return this.appointmentsService.updateStatus(id, body.status);
  }

  @Patch(':id/consult')
  completeConsultation(@Param('id') id: string, @Body() body: { diagnosis: string; medicines: any }) {
    return this.appointmentsService.completeConsultation(id, { ...body, status: 'COMPLETED' });
  }
}
