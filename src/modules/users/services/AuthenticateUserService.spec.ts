import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import AuthenticateUserService from '@modules/users/services/AuthenticateUserService';
import CreateUserService from '@modules/users/services/CreateUserService';
import FakeHashProvider from '@modules/users/providers/HashProvider/fakes/FakeHashProvider';
import AppError from '@shared/errors/AppError';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let authenticateUserService: AuthenticateUserService;
let createUserService: CreateUserService;

describe('AuthenticateUser', () => {
    beforeEach(() => {
        fakeUsersRepository = new FakeUsersRepository();
        fakeHashProvider = new FakeHashProvider();
        authenticateUserService = new AuthenticateUserService(
            fakeUsersRepository,
            fakeHashProvider,
        );
        createUserService = new CreateUserService(fakeUsersRepository, fakeHashProvider);
    });

    it('should authenticate a user', async () => {
        const user = await createUserService.execute({
            name: 'Max Castelo Branco',
            email: 'max_castelo_branco@hotmail.com',
            password: '@v3ng3r$',
        });

        const response = await authenticateUserService.execute({
            email: 'max_castelo_branco@hotmail.com',
            password: '@v3ng3r$',
        });

        expect(response).toHaveProperty('token');
        expect(response.user).toEqual(user);
    });

    it('should not authenticate a non-existing user', async () => {
        await expect(
            authenticateUserService.execute({
                email: 'max_castelo_branco@hotmail.com',
                password: '@v3ng3r$',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should not authenticate a user with the wrong password', async () => {
        await createUserService.execute({
            name: 'Max Castelo Branco',
            email: 'max_castelo_branco@hotmail.com',
            password: '@v3ng3r$',
        });

        await expect(
            authenticateUserService.execute({
                email: 'max_castelo_branco@hotmail.com',
                password: 'batata',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });
});
