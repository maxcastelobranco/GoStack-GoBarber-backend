import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment';
import ICreateAppointmentDTO from '@modules/appointments/dtos/ICreateAppointmentDTO';
import IFindByMonthDTO from '@modules/appointments/dtos/IFindByMonthDTO';
import IFindByDayDTO from '@modules/appointments/dtos/IFindByDayDTO';

export default interface IAppointmentsRepository {
    create(data: ICreateAppointmentDTO): Promise<Appointment>;
    findByDate(date: Date, provider_id: string): Promise<Appointment | undefined>;
    findByMonth(data: IFindByMonthDTO): Promise<Appointment[]>;
    findByDay(data: IFindByDayDTO): Promise<Appointment[]>;
}
