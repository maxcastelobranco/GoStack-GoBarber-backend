import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeStorageProvider from '@shared/container/providers/StorageProvider/fakes/FakeStorageProvider';
import UpdateUserAvatarService from '@modules/users/services/UpdateUserAvatarService';
import AppError from '@shared/errors/AppError';

let fakeUsersRepository: FakeUsersRepository;
let fakeStorageProvider: FakeStorageProvider;
let updateUserAvatarService: UpdateUserAvatarService;

describe('UpdateUserAvatar', () => {
    beforeEach(() => {
        fakeUsersRepository = new FakeUsersRepository();
        fakeStorageProvider = new FakeStorageProvider();
        updateUserAvatarService = new UpdateUserAvatarService(
            fakeUsersRepository,
            fakeStorageProvider,
        );
    });

    it('should update the user avatar', async () => {
        const user = await fakeUsersRepository.create({
            name: 'Max Castelo Branco',
            email: 'max_castelo_branco@hotmail.com',
            password: '@v3ng3r$',
        });

        await updateUserAvatarService.execute({
            userId: user.id,
            avatarFilename: 'avatar.png',
        });

        expect(user.avatar).toBe('avatar.png');
    });

    it('should not update the avatar of a non-existing user', async () => {
        await expect(
            updateUserAvatarService.execute({
                userId: 'non-existing-id',
                avatarFilename: 'avatar.png',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should delete previous avatar if existent', async () => {
        const deleteFileMethod = jest.spyOn(fakeStorageProvider, 'deleteFile');

        const user = await fakeUsersRepository.create({
            name: 'Max Castelo Branco',
            email: 'max_castelo_branco@hotmail.com',
            password: '@v3ng3r$',
        });

        await updateUserAvatarService.execute({
            userId: user.id,
            avatarFilename: 'avatar.png',
        });

        await updateUserAvatarService.execute({
            userId: user.id,
            avatarFilename: 'new-avatar.png',
        });

        expect(deleteFileMethod).toHaveBeenCalledWith('avatar.png');
        expect(user.avatar).toBe('new-avatar.png');
    });
});
