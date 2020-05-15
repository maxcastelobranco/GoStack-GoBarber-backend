import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import AuthenticateUserService from '@modules/users/services/AuthenticateUserService';
import FakeHashProvider from '@modules/users/providers/HashProvider/fakes/FakeHashProvider';
import AppError from '@shared/errors/AppError';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let authenticateUserService: AuthenticateUserService;

describe('AuthenticateUser', () => {
    beforeEach(() => {
        fakeUsersRepository = new FakeUsersRepository();
        fakeHashProvider = new FakeHashProvider();
        authenticateUserService = new AuthenticateUserService(
            fakeUsersRepository,
            fakeHashProvider,
        );
    });

    it('should authenticate a user', async () => {
        const user = await fakeUsersRepository.create({
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
        await fakeUsersRepository.create({
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
