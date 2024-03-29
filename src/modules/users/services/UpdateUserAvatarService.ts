import User from '@modules/users/infra/typeorm/entities/User';
import AppError from '@shared/errors/AppError';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import { inject, injectable } from 'tsyringe';
import IStorageProvider from '@shared/container/providers/StorageProvider/models/IStorageProvider';

interface IRequest {
    userId: string;
    avatarFilename: string;
}

@injectable()
class UpdateUserAvatarService {
    constructor(
        @inject('UsersRepository')
        private usersRepository: IUsersRepository,
        @inject('StorageProvider')
        private storageProvider: IStorageProvider,
    ) {}

    public async execute({ userId, avatarFilename }: IRequest): Promise<User> {
        const user = await this.usersRepository.findById(userId);

        if (!user) {
            throw new AppError('Only authenticated users can change their avatar.', 401);
        }

        if (user.avatar) {
            await this.storageProvider.deleteFile(user.avatar);
        }

        user.avatar = await this.storageProvider.saveFile(avatarFilename);

        await this.usersRepository.save(user);

        return user;
    }
}

export default UpdateUserAvatarService;
