import ListProviderMonthAvailabilityService from '@modules/appointments/services/ListProviderMonthAvailabilityService';
import FakeAppointmentRepository from '@modules/appointments/repositories/fakes/FakeAppointmentRepository';
import { uuid } from 'uuidv4';

let fakeAppointmentRepository = new FakeAppointmentRepository();
let listProviderMonthAvailabilityService: ListProviderMonthAvailabilityService;

describe('ListProviderMonthAvailability', () => {
    beforeEach(() => {
        fakeAppointmentRepository = new FakeAppointmentRepository();
        listProviderMonthAvailabilityService = new ListProviderMonthAvailabilityService(
            fakeAppointmentRepository,
        );
    });

    it('should list the month availability from a specific provider', async () => {
        const provider_id = uuid();
        const user_id = uuid();

        await fakeAppointmentRepository.create({
            user_id,
            provider_id,
            date: new Date(2020, 4, 19, 8, 0, 0),
        });
        await fakeAppointmentRepository.create({
            user_id,
            provider_id,
            date: new Date(2020, 4, 20, 8, 0, 0),
        });
        await fakeAppointmentRepository.create({
            user_id,
            provider_id,
            date: new Date(2020, 4, 20, 9, 0, 0),
        });
        await fakeAppointmentRepository.create({
            user_id,
            provider_id,
            date: new Date(2020, 4, 20, 10, 0, 0),
        });
        await fakeAppointmentRepository.create({
            user_id,
            provider_id,
            date: new Date(2020, 4, 20, 11, 0, 0),
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
            date: new Date(2020, 4, 20, 14, 0, 0),
        });
        await fakeAppointmentRepository.create({
            user_id,
            provider_id,
            date: new Date(2020, 4, 20, 15, 0, 0),
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
        await fakeAppointmentRepository.create({
            user_id,
            provider_id,
            date: new Date(2020, 4, 21, 8, 0, 0),
        });

        const availability = await listProviderMonthAvailabilityService.execute({
            provider_id,
            month: 5,
            year: 2020,
        });

        expect(availability).toEqual(
            expect.arrayContaining([
                { day: 19, available: true },
                { day: 20, available: false },
                { day: 21, available: true },
            ]),
        );
    });
});
