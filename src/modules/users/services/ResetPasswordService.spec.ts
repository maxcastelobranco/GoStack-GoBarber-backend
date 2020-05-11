import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeUserTokensRepository from '@modules/users/repositories/fakes/FakeUserTokensRepository';
import ResetPasswordService from '@modules/users/services/ResetPasswordService';
import FakeHashProvider from '@modules/users/providers/HashProvider/fakes/FakeHashProvider';
import AppError from '@shared/errors/AppError';

let fakeUsersRepository: FakeUsersRepository;
let fakeUserTokensRepository: FakeUserTokensRepository;
let resetPasswordService: ResetPasswordService;
let fakeHashProvider: FakeHashProvider;

describe('ResetPasswordService', () => {
    beforeEach(() => {
        fakeUsersRepository = new FakeUsersRepository();
        fakeUserTokensRepository = new FakeUserTokensRepository();
        fakeHashProvider = new FakeHashProvider();

        resetPasswordService = new ResetPasswordService(
            fakeUsersRepository,
            fakeUserTokensRepository,
            fakeHashProvider,
        );
    });

    it('should reset the users password', async () => {
        const user = await fakeUsersRepository.create({
            name: 'Max Castelo Branco',
            email: 'max_castelo_branco@hotmail.com',
            password: '@v3ng3r$',
        });

        const { token } = await fakeUserTokensRepository.generate(user.id);

        const generateHash = jest.spyOn(fakeHashProvider, 'generateHash');

        await resetPasswordService.execute({ token, password: 'new-password' });

        const loggedUser = await fakeUsersRepository.findById(user.id);

        expect(loggedUser?.password).toBe('new-password');
        expect(generateHash).toHaveBeenCalledWith('new-password');
    });

    it('should not reset the password with an invalid token', async () => {
        await expect(
            resetPasswordService.execute({ token: 'batata', password: 'new-password' }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should not reset the password with an non-existing user', async () => {
        const { token } = await fakeUserTokensRepository.generate('invalid_id');

        await expect(
            resetPasswordService.execute({ token, password: 'new-password' }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should not reset the password after 2 hours', async () => {
        const user = await fakeUsersRepository.create({
            name: 'Max Castelo Branco',
            email: 'max_castelo_branco@hotmail.com',
            password: '@v3ng3r$',
        });

        const { token } = await fakeUserTokensRepository.generate(user.id);

        jest.spyOn(Date, 'now').mockImplementationOnce(() => {
            const customDate = new Date();

            return customDate.setMinutes(customDate.getMinutes() + 121);
        });

        await expect(
            resetPasswordService.execute({ token, password: 'new-password' }),
        ).rejects.toBeInstanceOf(AppError);
    });
});
