import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import { inject, injectable } from 'tsyringe';
import IHashProvider from '@modules/users/providers/HashProvider/models/IHashProvider';
import User from '@modules/users/infra/typeorm/entities/User';
import AppError from '@shared/errors/AppError';

interface IRequest {
    user_id: string;
    name: string;
    email: string;
    old_password?: string;
    password?: string;
}

@injectable()
class UpdateProfileService {
    constructor(
        @inject('UsersRepository')
        private usersRepository: IUsersRepository,
        @inject('HashProvider')
        private hashProvider: IHashProvider,
    ) {}

    public async execute({
        user_id,
        name,
        email,
        old_password,
        password,
    }: IRequest): Promise<User> {
        const user = await this.usersRepository.findById(user_id);

        if (!user) {
            throw new AppError('Invalid user_id');
        }

        const possibleUserWithSameEmail = await this.usersRepository.findByEmail(email);

        if (possibleUserWithSameEmail && possibleUserWithSameEmail.id !== user.id) {
            throw new AppError('Email address already being used');
        }

        if (password && !old_password) {
            throw new AppError('You must confirm your old password before updating it');
        }

        if (old_password && password) {
            const oldPasswordMatches = await this.hashProvider.compareHash(
                old_password,
                user.password,
            );

            if (!oldPasswordMatches) {
                throw new AppError('Incorrect password');
            }

            user.password = await this.hashProvider.generateHash(password);
        }

        user.name = name;
        user.email = email;

        return this.usersRepository.save(user);
    }
}

export default UpdateProfileService;
