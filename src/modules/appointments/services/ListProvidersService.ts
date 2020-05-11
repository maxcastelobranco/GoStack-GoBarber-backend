import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import { inject, injectable } from 'tsyringe';
import User from '@modules/users/infra/typeorm/entities/User';

interface IRequest {
    except_user_id: string;
}

@injectable()
class ListProvidersService {
    constructor(
        @inject('UsersRepository')
        private usersRepository: IUsersRepository,
    ) {}

    public async execute({ except_user_id }: IRequest): Promise<User[]> {
        const providers = await this.usersRepository.findAllProviders({ except_user_id });

        return providers.map(provider => {
            const formattedProvider = { ...provider };

            delete formattedProvider.password;

            return formattedProvider;
        });
    }
}

export default ListProvidersService;
