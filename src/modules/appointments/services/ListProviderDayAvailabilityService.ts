import 'reflect-metadata';
import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';
import { getHours, getMonth, getYear, isAfter } from 'date-fns';
import { inject, injectable } from 'tsyringe';

interface IRequest {
    provider_id: string;
    month: number;
    year: number;
    day: number;
}

type IResponse = Array<{
    hour: number;
    available: boolean;
}>;

@injectable()
class ListProviderDayAvailabilityService {
    constructor(
        @inject('AppointmentsRepository')
        private appointmentsRepository: IAppointmentsRepository,
    ) {}

    public async execute({ provider_id, day, month, year }: IRequest): Promise<IResponse> {
        const appointments = await this.appointmentsRepository.findByDay({
            provider_id,
            day,
            month,
            year,
        });

        const today = new Date(Date.now());
        const availability: IResponse = [];

        for (let hour = 8; hour <= 17; hour += 1) {
            let available = !appointments.find(
                appointment =>
                    getYear(appointment.date) === year &&
                    getMonth(appointment.date) === month - 1 &&
                    getHours(appointment.date) === hour,
            );

            const appointmentDay = new Date(year, month - 1, day, hour);

            if (isAfter(today, appointmentDay)) {
                available = false;
            }

            availability.push({
                hour,
                available,
            });
        }

        return availability;
    }
}

export default ListProviderDayAvailabilityService;
