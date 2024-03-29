import { uuid } from 'uuidv4';
import FakeAppointmentRepository from '@modules/appointments/repositories/fakes/FakeAppointmentRepository';
import ListProviderAppointmentsService from '@modules/appointments/services/ListProviderAppointmentsService';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';

let fakeAppointmentRepository = new FakeAppointmentRepository();
let fakeCacheProvider: FakeCacheProvider;
let listProviderAppointmentsService: ListProviderAppointmentsService;

describe('ListProviderDayAvailability', () => {
    beforeEach(() => {
        fakeAppointmentRepository = new FakeAppointmentRepository();
        fakeCacheProvider = new FakeCacheProvider();
        listProviderAppointmentsService = new ListProviderAppointmentsService(
            fakeAppointmentRepository,
            fakeCacheProvider,
        );
    });

    it('should list the appointments from a specific day', async () => {
        const provider_id = uuid();
        const user_id = uuid();

        const testAppointment1 = await fakeAppointmentRepository.create({
            provider_id,
            user_id,
            date: new Date(2200, 9, 9, 9),
        });

        const testAppointment2 = await fakeAppointmentRepository.create({
            provider_id,
            user_id,
            date: new Date(2200, 9, 9, 10),
        });

        const appointments = await listProviderAppointmentsService.execute({
            provider_id,
            day: 9,
            month: 10,
            year: 2200,
        });

        expect(appointments).toEqual([testAppointment1, testAppointment2]);
    });
});
