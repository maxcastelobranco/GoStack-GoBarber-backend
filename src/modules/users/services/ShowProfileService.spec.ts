import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import ShowProfileService from '@modules/users/services/ShowProfileService';
import AppError from '@shared/errors/AppError';

let fakeUsersRepository: FakeUsersRepository;
let showProfileService: ShowProfileService;

describe('UpdateProfile', () => {
    beforeEach(() => {
        fakeUsersRepository = new FakeUsersRepository();
        showProfileService = new ShowProfileService(fakeUsersRepository);
    });

    it('should show the profile', async () => {
        const user = await fakeUsersRepository.create({
            name: 'Max Castelo Branco',
            email: 'max_castelo_branco@hotmail.com',
            password: '@v3ng3r$',
        });

        const profile = await showProfileService.execute({
            user_id: user.id,
        });

        expect(profile?.name).toBe('Max Castelo Branco');
        expect(profile?.email).toBe('max_castelo_branco@hotmail.com');
    });

    it('should not show the profile of a non-existing user', async () => {
        await expect(
            showProfileService.execute({
                user_id: 'batata',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });
});
