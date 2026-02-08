import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AppointmentsService {
  constructor(private prisma: PrismaService) { }

  async create(createAppointmentDto: CreateAppointmentDto, userId: string) {
    const patient = await this.prisma.patient.findUnique({ where: { userId: parseInt(userId) } });
    if (!patient) {
      throw new Error('Patient profile not found. Please complete your profile.');
    }

    return this.prisma.appointment.create({
      data: {
        date: new Date(createAppointmentDto.date),
        symptoms: createAppointmentDto.symptoms || "General checkup",
        patientId: patient.id,
        doctorId: parseInt(createAppointmentDto.doctorId),
        status: 'PENDING',
      },
    });
  }

  async findAll(userId: string, role: string) {
    if (role === 'PATIENT') {
      const patient = await this.prisma.patient.findUnique({ where: { userId: parseInt(userId) } });
      if (!patient) return [];
      return this.prisma.appointment.findMany({
        where: { patientId: patient.id },
        include: { doctor: { include: { user: true } }, prescription: true }
      });
    } else if (role === 'DOCTOR') {
      const doctor = await this.prisma.doctor.findUnique({ where: { userId: parseInt(userId) } });
      if (!doctor) return [];
      return this.prisma.appointment.findMany({
        where: { doctorId: doctor.id },
        include: { patient: { include: { user: true } }, prescription: true }
      });
    } else {
      return this.prisma.appointment.findMany({
        include: { patient: { include: { user: true } }, doctor: { include: { user: true } } }
      });
    }
  }

  async updateStatus(id: string, status: 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED') {
    return this.prisma.appointment.update({
      where: { id: parseInt(id) },
      data: { status }
    });
  }

  async completeConsultation(id: string, data: { status: 'COMPLETED'; diagnosis: string; medicines: any }) {
    // 1. Update Appointment Status
    // 2. Create Prescription
    // 3. Create Bill (Mocked)

    const appointment = await this.prisma.appointment.update({
      where: { id: parseInt(id) },
      data: {
        status: 'COMPLETED',
        symptoms: data.diagnosis // Use symptoms field to store updated notes/diagnosis if needed, or keep original
      }
    });

    await this.prisma.prescription.create({
      data: {
        appointmentId: parseInt(id),
        medication: data.medicines,
        dosage: "As prescribed",
        instructions: data.diagnosis
      }
    });

    await this.prisma.billing.create({
      data: {
        appointmentId: parseInt(id),
        amount: 50.0, // Fixed Consultation Fee
        status: 'UNPAID'
      }
    });

    return appointment;
  }
}
