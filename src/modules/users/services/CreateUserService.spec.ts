import AppError from '@shared/errors/AppError';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import CreateUserService from '@modules/users/services/CreateUserService';
import FakeHashProvider from '@modules/users/providers/HashProvider/fakes/FakeHashProvider';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let createUserService: CreateUserService;

describe('CreateUser', () => {
    beforeEach(() => {
        fakeUsersRepository = new FakeUsersRepository();
        fakeHashProvider = new FakeHashProvider();
        createUserService = new CreateUserService(fakeUsersRepository, fakeHashProvider);
    });

    it('should create a new user', async () => {
        const user = await createUserService.execute({
            name: 'Max Castelo Branco',
            email: 'max_castelo_branco@hotmail.com',
            password: '@v3ng3r$',
        });

        expect(user).toHaveProperty('id');
    });

    it('should not create a new user with repeated email', async () => {
        await createUserService.execute({
            name: 'Max Castelo Branco',
            email: 'max_castelo_branco@hotmail.com',
            password: '@v3ng3r$',
        });

        await expect(
            createUserService.execute({
                name: 'Max Castelo Branco',
                email: 'max_castelo_branco@hotmail.com',
                password: '@v3ng3r$',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });
});
