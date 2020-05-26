import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment';
import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';
import { getRepository, Repository, Raw } from 'typeorm';
import ICreateAppointmentDTO from '@modules/appointments/dtos/ICreateAppointmentDTO';
import IFindByMonthDTO from '@modules/appointments/dtos/IFindByMonthDTO';
import IFindByDayDTO from '@modules/appointments/dtos/IFindByDayDTO';

class AppointmentsRepository implements IAppointmentsRepository {
    private ormRepository: Repository<Appointment>;

    constructor() {
        this.ormRepository = getRepository(Appointment);
    }

    public async create({
        user_id,
        provider_id,
        date,
    }: ICreateAppointmentDTO): Promise<Appointment> {
        const appointment = this.ormRepository.create({
            user_id,
            provider_id,
            date,
        });

        await this.ormRepository.save(appointment);

        return appointment;
    }

    public async findByDate(date: Date, provider_id: string): Promise<Appointment | undefined> {
        const findAppointment = await this.ormRepository.findOne({
            where: { date, provider_id },
        });

        return findAppointment || undefined;
    }

    public async findByMonth({
        provider_id,
        month,
        year,
    }: IFindByMonthDTO): Promise<Appointment[]> {
        const parsedMonth = String(month).padStart(2, '0');

        return this.ormRepository.find({
            where: {
                provider_id,
                date: Raw(
                    columnAlias => `to_char(${columnAlias}, 'MM-YYYY') = '${parsedMonth}-${year}'`,
                ),
            },
        });
    }

    public async findByDay({
        provider_id,
        day,
        month,
        year,
    }: IFindByDayDTO): Promise<Appointment[]> {
        const parsedDay = String(day).padStart(2, '0');
        const parsedMonth = String(month).padStart(2, '0');

        return this.ormRepository.find({
            where: {
                provider_id,
                date: Raw(
                    columnAlias =>
                        `to_char(${columnAlias}, 'DD-MM-YYYY') = '${parsedDay}-${parsedMonth}-${year}'`,
                ),
            },
            relations: ['user'],
        });
    }
}

export default AppointmentsRepository;
