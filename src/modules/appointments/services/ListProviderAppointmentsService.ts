import 'reflect-metadata';
import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';
import { inject, injectable } from 'tsyringe';
import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment';

interface IRequest {
    provider_id: string;
    day: number;
    month: number;
    year: number;
}

@injectable()
class ListProviderAppointmentsService {
    constructor(
        @inject('AppointmentsRepository')
        private appointmentsRepository: IAppointmentsRepository,
    ) {}

    public async execute({ provider_id, day, month, year }: IRequest): Promise<Appointment[]> {
        return this.appointmentsRepository.findByDay({
            day,
            month,
            year,
            provider_id,
        });
    }
}

export default ListProviderAppointmentsService;
