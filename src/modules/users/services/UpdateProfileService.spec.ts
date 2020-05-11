import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import UpdateProfileService from '@modules/users/services/UpdateProfileService';
import FakeHashProvider from '@modules/users/providers/HashProvider/fakes/FakeHashProvider';
import AppError from '@shared/errors/AppError';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let updateProfileService: UpdateProfileService;

describe('UpdateProfile', () => {
    beforeEach(() => {
        fakeUsersRepository = new FakeUsersRepository();
        fakeHashProvider = new FakeHashProvider();
        updateProfileService = new UpdateProfileService(fakeUsersRepository, fakeHashProvider);
    });

    it('should update the profile', async () => {
        const user = await fakeUsersRepository.create({
            name: 'Macs Castellho Branko',
            email: 'macs_castellho_branko@hotmail.com',
            password: '@v3ng3r$',
        });

        const updatedUser = await updateProfileService.execute({
            user_id: user.id,
            name: 'Max Castelo Branco',
            email: 'max_castelo_branco@hotmail.com',
        });

        expect(updatedUser.name).toBe('Max Castelo Branco');
        expect(updatedUser.email).toBe('max_castelo_branco@hotmail.com');
    });

    it('should not update the profile of a non-existing user', async () => {
        await expect(
            updateProfileService.execute({
                user_id: 'batata',
                name: 'Max Castelo Branco',
                email: 'max_castelo_branco@hotmail.com',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it("should not update the email to an email that's already being used", async () => {
        await fakeUsersRepository.create({
            name: 'Max Castelo Branco',
            email: 'max_castelo_branco@hotmail.com',
            password: '@v3ng3r$',
        });

        const user = await fakeUsersRepository.create({
            name: 'Jorge Robert Alfred',
            email: 'jorge_robert_alfred@gmail.com',
            password: 'some-other-password',
        });

        await expect(
            updateProfileService.execute({
                user_id: user.id,
                name: 'Jorge Robert Alfred',
                email: 'max_castelo_branco@hotmail.com',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should update the password', async () => {
        const user = await fakeUsersRepository.create({
            name: 'Max Castelo Branco',
            email: 'max_castelo_branco@hotmail.com',
            password: '@v3ng3r$',
        });

        const updatedUser = await updateProfileService.execute({
            user_id: user.id,
            name: 'Max Castelo Branco',
            email: 'max_castelo_branco@hotmail.com',
            old_password: '@v3ng3r$',
            password: 'batata',
        });

        expect(updatedUser.password).toBe('batata');
    });

    it('should not update the password if the old password is not presented', async () => {
        const user = await fakeUsersRepository.create({
            name: 'Max Castelo Branco',
            email: 'max_castelo_branco@hotmail.com',
            password: '@v3ng3r$',
        });

        await expect(
            updateProfileService.execute({
                user_id: user.id,
                name: 'Max Castelo Branco',
                email: 'max_castelo_branco@hotmail.com',
                password: 'batata',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should not update the password if the old password is incorrect', async () => {
        const user = await fakeUsersRepository.create({
            name: 'Max Castelo Branco',
            email: 'max_castelo_branco@hotmail.com',
            password: '@v3ng3r$',
        });

        await expect(
            updateProfileService.execute({
                user_id: user.id,
                name: 'Max Castelo Branco',
                email: 'max_castelo_branco@hotmail.com',
                old_password: 'batata',
                password: 'batata',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });
});
