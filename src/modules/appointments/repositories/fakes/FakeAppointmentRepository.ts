import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment';
import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';
import ICreateAppointmentDTO from '@modules/appointments/dtos/ICreateAppointmentDTO';
import { uuid } from 'uuidv4';
import { isEqual, getMonth, getYear, getDate } from 'date-fns';
import IFindByMonthDTO from '@modules/appointments/dtos/IFindByMonthDTO';
import IFindByDayDTO from '@modules/appointments/dtos/IFindByDayDTO';

class FakeAppointmentRepository implements IAppointmentsRepository {
    private appointments: Appointment[] = [];

    public async findByDate(date: Date, provider_id: string): Promise<Appointment | undefined> {
        return this.appointments.find(
            appointment =>
                isEqual(appointment.date, date) && provider_id === appointment.provider_id,
        );
    }

    public async create({
        user_id,
        provider_id,
        date,
    }: ICreateAppointmentDTO): Promise<Appointment> {
        const appointment = new Appointment();

        Object.assign(appointment, {
            id: uuid(),
            user_id,
            provider_id,
            date,
        });

        this.appointments.push(appointment);

        return appointment;
    }

    public async findByMonth({
        provider_id,
        month,
        year,
    }: IFindByMonthDTO): Promise<Appointment[]> {
        return this.appointments.filter(
            appointment =>
                appointment.provider_id === provider_id &&
                getMonth(appointment.date) + 1 === month &&
                getYear(appointment.date) === year,
        );
    }

    public async findByDay({
        provider_id,
        day,
        month,
        year,
    }: IFindByDayDTO): Promise<Appointment[]> {
        return this.appointments.filter(
            appointment =>
                appointment.provider_id === provider_id &&
                getDate(appointment.date) === day &&
                getMonth(appointment.date) + 1 === month &&
                getYear(appointment.date) === year,
        );
    }
}

export default FakeAppointmentRepository;
