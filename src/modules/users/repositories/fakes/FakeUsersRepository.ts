import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import User from '@modules/users/infra/typeorm/entities/User';
import ICreateUserDTO from '@modules/users/dtos/ICreateUserDTO';
import { uuid } from 'uuidv4';
import IFindAllProvidersDTO from '@modules/users/dtos/IFindAllProvidersDTO';

class FakeUsersRepository implements IUsersRepository {
    private users: User[] = [];

    public async findById(id: string): Promise<User | undefined> {
        return this.users.find(user => user.id === id);
    }

    public async findByEmail(email: string): Promise<User | undefined> {
        return this.users.find(user => user.email === email);
    }

    public async create(userData: ICreateUserDTO): Promise<User> {
        const user = new User();

        Object.assign(user, { id: uuid() }, userData);

        this.users.push(user);

        return user;
    }

    public async save(user: User): Promise<User> {
        const userIndex = this.users.findIndex(u => u.id === user.id);

        this.users[userIndex] = user;

        return this.users[userIndex];
    }

    public async findAllProviders({ except_user_id }: IFindAllProvidersDTO): Promise<User[]> {
        return except_user_id ? this.users.filter(user => user.id !== except_user_id) : this.users;
    }
}

export default FakeUsersRepository;
