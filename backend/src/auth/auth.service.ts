import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { LoginDto, RegisterDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
        private prisma: PrismaService,
    ) { }

    async validateUser(email: string, pass: string): Promise<any> {
        const user = await this.usersService.findOne(email);
        if (user && (await bcrypt.compare(pass, user.password))) {
            const { password, ...result } = user;
            return result;
        }
        return null;
    }

    async login(user: any) {
        const payload = { email: user.email, sub: user.id, role: user.role };
        return {
            access_token: this.jwtService.sign(payload),
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        };
    }

    async register(registerDto: RegisterDto) {
        const existingUser = await this.usersService.findOne(registerDto.email);
        if (existingUser) {
            throw new ConflictException('Email already in use');
        }

        const hashedPassword = await bcrypt.hash(registerDto.password, 10);
        const user = await this.usersService.create({
            ...registerDto, role: registerDto.role || "PATIENT",
            password: hashedPassword,
        });

        // Create profile
        if (registerDto.role === 'PATIENT') {
            const dateValues = new Date().toISOString();
            await this.prisma.patient.create({
                data: {
                    userId: user.id,
                    dob: dateValues,
                    address: "Not provided",
                    gender: 'Other',
                }
            });
        } else if (registerDto.role === 'DOCTOR') {
            await this.prisma.doctor.create({
                data: {
                    userId: user.id,
                    specialization: 'General',
                    experience: 0,
                    consultationFee: 50.0,
                }
            });
        }

        return this.login(user); // Auto login
    }
}
