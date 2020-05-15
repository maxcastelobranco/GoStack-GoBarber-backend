import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import ListProvidersService from '@modules/appointments/services/ListProvidersService';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';

let fakeUsersRepository: FakeUsersRepository;
let fakeCacheProvider: FakeCacheProvider;
let listProvidersService: ListProvidersService;

describe('ListProviders', () => {
    beforeEach(() => {
        fakeUsersRepository = new FakeUsersRepository();
        fakeCacheProvider = new FakeCacheProvider();
        listProvidersService = new ListProvidersService(fakeUsersRepository, fakeCacheProvider);
    });

    it('should show all provider profiles', async () => {
        const testUser1 = await fakeUsersRepository.create({
            name: 'Test User 1',
            email: 'test1@test1.com',
            password: '123456',
        });

        const testUser2 = await fakeUsersRepository.create({
            name: 'Test User 2',
            email: 'test2@test2.com',
            password: '123456',
        });

        delete testUser1.password;
        delete testUser2.password;

        const loggedUser = await fakeUsersRepository.create({
            name: 'Max Castelo Branco',
            email: 'max_castelo_branco@hotmail.com',
            password: '@v3ng3r$',
        });

        const providers = await listProvidersService.execute({
            user_id: loggedUser.id,
        });

        expect(providers).toEqual([testUser1, testUser2]);
    });
});
