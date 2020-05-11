import FakeAppointmentRepository from '@modules/appointments/repositories/fakes/FakeAppointmentRepository';
import CreateAppointmentService from '@modules/appointments/services/CreateAppointmentService';
import AppError from '@shared/errors/AppError';
import { uuid } from 'uuidv4';

let fakeAppointmentRepository: FakeAppointmentRepository;
let createAppointmentService: CreateAppointmentService;

describe('CreateAppointment', () => {
    beforeEach(() => {
        fakeAppointmentRepository = new FakeAppointmentRepository();
        createAppointmentService = new CreateAppointmentService(fakeAppointmentRepository);
    });

    it('should create a new appointment', async () => {
        const user_id = uuid();
        const provider_id = uuid();

        jest.spyOn(Date, 'now').mockImplementationOnce(() => {
            return new Date(2020, 4, 10, 12).getTime();
        });

        const appointment = await createAppointmentService.execute({
            date: new Date(2020, 4, 10, 13),
            user_id,
            provider_id,
        });

        expect(appointment).toHaveProperty('id');
        expect(appointment.provider_id).toBe(provider_id);
        expect(appointment.user_id).toBe(user_id);
    });

    it('should not create two appointments at the same time', async () => {
        const user_id = uuid();
        const provider_id = uuid();
        const conflictingDate = new Date(2200, 9, 9, 9);

        await createAppointmentService.execute({
            date: conflictingDate,
            user_id,
            provider_id,
        });

        await expect(
            createAppointmentService.execute({
                date: conflictingDate,
                user_id,
                provider_id,
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should not allow the user to schedule appointments in the past', async () => {
        const user_id = uuid();
        const provider_id = uuid();

        jest.spyOn(Date, 'now').mockImplementationOnce(() => {
            return new Date(2020, 4, 10, 12).getTime();
        });

        await expect(
            createAppointmentService.execute({
                date: new Date(2020, 4, 10, 11),
                user_id,
                provider_id,
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should not allow the user to schedule appointments with himself', async () => {
        const same_id = uuid();

        jest.spyOn(Date, 'now').mockImplementationOnce(() => {
            return new Date(2020, 4, 10, 12).getTime();
        });

        await expect(
            createAppointmentService.execute({
                date: new Date(2020, 4, 10, 13),
                user_id: same_id,
                provider_id: same_id,
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should only allow the user to schedule appointments from 8am and 5pm', async () => {
        const user_id = uuid();
        const provider_id = uuid();

        jest.spyOn(Date, 'now').mockImplementationOnce(() => {
            return new Date(2020, 4, 10, 12).getTime();
        });

        await expect(
            createAppointmentService.execute({
                date: new Date(2020, 4, 10, 18),
                user_id,
                provider_id,
            }),
        ).rejects.toBeInstanceOf(AppError);

        await expect(
            createAppointmentService.execute({
                date: new Date(2020, 4, 11, 7),
                user_id,
                provider_id,
            }),
        ).rejects.toBeInstanceOf(AppError);
    });
});
