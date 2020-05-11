import ListProviderDayAvailabilityService from '@modules/appointments/services/ListProviderDayAvailabilityService';
import { uuid } from 'uuidv4';
import FakeAppointmentRepository from '@modules/appointments/repositories/fakes/FakeAppointmentRepository';

let fakeAppointmentRepository = new FakeAppointmentRepository();
let listProviderDayAvailabilityService: ListProviderDayAvailabilityService;

describe('ListProviderDayAvailability', () => {
    beforeEach(() => {
        fakeAppointmentRepository = new FakeAppointmentRepository();
        listProviderDayAvailabilityService = new ListProviderDayAvailabilityService(
            fakeAppointmentRepository,
        );
    });

    it('should list the day availability from a specific provider', async () => {
        const provider_id = uuid();
        const user_id = uuid();

        await fakeAppointmentRepository.create({
            user_id,
            provider_id,
            date: new Date(2020, 4, 20, 8, 0, 0),
        });
        await fakeAppointmentRepository.create({
            user_id,
            provider_id,
            date: new Date(2020, 4, 20, 10, 0, 0),
        });
        await fakeAppointmentRepository.create({
            user_id,
            provider_id,
            date: new Date(2020, 4, 20, 12, 0, 0),
        });
        await fakeAppointmentRepository.create({
            user_id,
            provider_id,
            date: new Date(2020, 4, 20, 13, 0, 0),
        });
        await fakeAppointmentRepository.create({
            user_id,
            provider_id,
            date: new Date(2020, 4, 20, 16, 0, 0),
        });
        await fakeAppointmentRepository.create({
            user_id,
            provider_id,
            date: new Date(2020, 4, 20, 17, 0, 0),
        });

        const availability = await listProviderDayAvailabilityService.execute({
            provider_id,
            day: 20,
            month: 5,
            year: 2020,
        });

        expect(availability).toEqual(
            expect.arrayContaining([
                { hour: 8, available: false },
                { hour: 9, available: true },
                { hour: 10, available: false },
                { hour: 11, available: true },
                { hour: 12, available: false },
                { hour: 13, available: false },
                { hour: 14, available: true },
                { hour: 15, available: true },
                { hour: 16, available: false },
                { hour: 17, available: false },
            ]),
        );
    });

    // This is the bullshit test, down there:
    it('should not list an appointment as available, if the appointment day has already past', async () => {
        const provider_id = uuid();
        const user_id = uuid();

        jest.spyOn(Date, 'now').mockImplementationOnce(() => {
            const customDate = new Date();

            return customDate.setFullYear(2300);
        });

        await fakeAppointmentRepository.create({
            user_id,
            provider_id,
            date: new Date(2020, 4, 20, 8, 0, 0),
        });

        const availability = await listProviderDayAvailabilityService.execute({
            provider_id,
            day: 20,
            month: 5,
            year: 2020,
        });

        expect(availability).toEqual(
            expect.arrayContaining([
                { hour: 8, available: false },
                { hour: 9, available: false },
                { hour: 10, available: false },
                { hour: 11, available: false },
                { hour: 12, available: false },
                { hour: 13, available: false },
                { hour: 14, available: false },
                { hour: 15, available: false },
                { hour: 16, available: false },
                { hour: 17, available: false },
            ]),
        );
    });
});
