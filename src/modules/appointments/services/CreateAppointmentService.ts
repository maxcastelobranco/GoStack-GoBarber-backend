import { getHours, isBefore, startOfHour } from 'date-fns';
import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment';
import AppError from '@shared/errors/AppError';
import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';
import { inject, injectable } from 'tsyringe';

interface IRequest {
    user_id: string;
    provider_id: string;
    date: Date;
}

@injectable()
class CreateAppointmentService {
    constructor(
        @inject('AppointmentsRepository')
        private appointmentsRepository: IAppointmentsRepository,
    ) {}

    public async execute({ user_id, provider_id, date }: IRequest): Promise<Appointment> {
        const appointmentDate = startOfHour(date);

        if (isBefore(appointmentDate, Date.now())) {
            throw new AppError('Time travel services are not a feature currently supported');
        }

        if (user_id === provider_id) {
            throw new AppError('It is not allowed that you schedule appointments with yourself');
        }

        if (getHours(appointmentDate) < 8 || getHours(appointmentDate) > 17) {
            throw new AppError('It is only possible to schedule appointments from 8am to 5pm');
        }

        const checkAppointmentInSameDate = await this.appointmentsRepository.findByDate(
            appointmentDate,
        );

        if (checkAppointmentInSameDate) {
            throw new AppError('This appointment is already booked');
        }

        return this.appointmentsRepository.create({
            user_id,
            provider_id,
            date: appointmentDate,
        });
    }
}

export default CreateAppointmentService;
