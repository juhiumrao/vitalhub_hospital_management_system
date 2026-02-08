import { IsString, IsNotEmpty, IsDateString, IsOptional } from 'class-validator';

export class CreateAppointmentDto {
    @IsNotEmpty()
    @IsString()
    doctorId: string;

    @IsNotEmpty()
    @IsDateString()
    date: string;

    @IsOptional()
    @IsString()
    symptoms?: string;
}
