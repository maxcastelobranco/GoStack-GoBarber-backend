import 'reflect-metadata';
import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';
import { getDate, getDaysInMonth, getHours, getMonth, getYear, isAfter, isEqual } from 'date-fns';
import { inject, injectable } from 'tsyringe';

interface IRequest {
    provider_id: string;
    month: number;
    year: number;
}

type IResponse = Array<{
    day: number;
    available: boolean;
    isFull: boolean;
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
            const today = new Date(getYear(Date.now()), getMonth(Date.now()), getDate(Date.now()));

            let available =
                appointments.filter(appointment => getDate(appointment.date) === day).length < 10;

            const isFull = !available;

            if (isAfter(today, new Date(year, month - 1, day))) {
                available = false;
            }

            if (isEqual(today, new Date(year, month - 1, day)) && getHours(Date.now()) >= 17) {
                available = false;
            }

            availability.push({
                day,
                available,
                isFull,
            });
        }

        return availability;
    }
}

export default ListProviderMonthAvailabilityService;
