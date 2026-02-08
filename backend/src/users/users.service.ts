import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { User, Prisma } from '@prisma/client';

@Injectable()
export class UsersService {
    constructor(private prisma: PrismaService) { }

    async findOne(email: string): Promise<User | null> {
        return this.prisma.user.findUnique({
            where: { email },
            include: { doctorProfile: true, patientProfile: true }
        });
    }

    async findOneById(id: string): Promise<User | null> {
        return this.prisma.user.findUnique({
            where: { id: parseInt(id) },
            include: { doctorProfile: true, patientProfile: true }
        });
    }

    async create(data: Prisma.UserCreateInput): Promise<User> {
        return this.prisma.user.create({
            data,
        });
    }

    async findAll(role?: 'DOCTOR' | 'PATIENT' | 'ADMIN'): Promise<User[]> {
        if (role) {
            return this.prisma.user.findMany({
                where: { role: role as string },
                include: { doctorProfile: true, patientProfile: true }
            });
        }
        return this.prisma.user.findMany({
            include: { doctorProfile: true, patientProfile: true }
        });
    }

    async update(id: string, data: any): Promise<User> {
        const { name, email, doctorProfile, patientProfile } = data;

        // Update User basic info
        const user = await this.prisma.user.update({
            where: { id: parseInt(id) },
            data: { name, email },
            include: { doctorProfile: true, patientProfile: true } // Include to check existence
        });

        // Update Doctor Profile if exists
        if (user.role === 'DOCTOR' && doctorProfile) {
            await this.prisma.doctor.update({
                where: { userId: parseInt(id) },
                data: {
                    specialization: doctorProfile.specialization,
                    consultationFee: parseFloat(doctorProfile.consultationFee),
                    experience: parseInt(doctorProfile.experience)
                }
            });
        }

        // Update Patient Profile if exists
        if (user.role === 'PATIENT' && patientProfile) {
            await this.prisma.patient.update({
                where: { userId: parseInt(id) },
                data: {
                    gender: patientProfile.gender,
                    bloodGroup: patientProfile.bloodGroup,
                    address: patientProfile.address
                }
            });
        }

        return this.findOneById(id) as Promise<User>;
    }
}
