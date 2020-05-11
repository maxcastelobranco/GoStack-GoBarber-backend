import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import { getRepository, Not, Repository } from 'typeorm';
import User from '@modules/users/infra/typeorm/entities/User';
import ICreateUserDTO from '@modules/users/dtos/ICreateUserDTO';
import IFindAllProvidersDTO from '@modules/users/dtos/IFindAllProvidersDTO';

class UsersRepository implements IUsersRepository {
    private ormRepository: Repository<User>;

    constructor() {
        this.ormRepository = getRepository(User);
    }

    public async create(userData: ICreateUserDTO): Promise<User> {
        const user = this.ormRepository.create(userData);

        return this.ormRepository.save(user);
    }

    public async findById(id: string): Promise<User | undefined> {
        return this.ormRepository.findOne(id);
    }

    public async findByEmail(email: string): Promise<User | undefined> {
        return this.ormRepository.findOne({ where: { email } });
    }

    public async save(user: User): Promise<User> {
        return this.ormRepository.save(user);
    }

    public async findAllProviders({ except_user_id }: IFindAllProvidersDTO): Promise<User[]> {
        if (!except_user_id) {
            return this.ormRepository.find();
        }

        return this.ormRepository.find({ where: { id: Not(except_user_id) } });
    }
}

export default UsersRepository;
