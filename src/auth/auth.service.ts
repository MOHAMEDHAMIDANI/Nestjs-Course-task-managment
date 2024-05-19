import { ConflictException, Injectable, InternalServerErrorException, Query } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthDto } from './Dto/auth.dto';

@Injectable()
export class AuthService {
    constructor(@InjectRepository(User) private UserRepository :Repository<User>) { }
    async createUser( authCredDto : AuthDto): Promise<void> { 
        const { username, password } = authCredDto;
        const user = this.UserRepository.create({ username, password });
        try {
            await this.UserRepository.save(user);
        } catch (error) {
            if (error.code === "23505") {
                throw new ConflictException("User already exists");
            }
            else {
                throw new InternalServerErrorException()
            }
        }
    }
}
