import 'reflect-metadata';
import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';
import { getDate, getDaysInMonth } from 'date-fns';
import { inject, injectable } from 'tsyringe';

interface IRequest {
    provider_id: string;
    month: number;
    year: number;
}

type IResponse = Array<{
    day: number;
    available: boolean;
}>;

@injectable()
class ListProviderMonthAvailabilityService {
    constructor(
        @inject('AppointmentsRepository')
        private appointmentsRepository: IAppointmentsRepository,
    ) {}

    public async execute({ provider_id, month, year }: IRequest): Promise<IResponse> {
        const appointments = await this.appointmentsRepository.findByMonth({
            provider_id,
            month,
            year,
        });

        const numberOfDaysInTheMonth = getDaysInMonth(new Date(year, month - 1));

        const availability: IResponse = [];

        for (let day = 1; day <= numberOfDaysInTheMonth; day += 1) {
            const available =
                appointments.filter(appointment => getDate(appointment.date) === day).length < 10;

            availability.push({
                day,
                available,
            });
        }

        return availability;
    }
}

export default ListProviderMonthAvailabilityService;
