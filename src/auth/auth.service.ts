import { ConflictException, Injectable, InternalServerErrorException, Query, UnauthorizedException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthDto } from './Dto/auth.dto';
import * as bcrypt from 'bcrypt';
import { JwtPayload } from './payload.entity';
import { JwtService } from '@nestjs/jwt';
@Injectable()
export class AuthService {
    constructor(@InjectRepository(User) private UserRepository :Repository<User>  , private jwtService : JwtService ) { }
    async createUser( authCredDto : AuthDto): Promise<void> { 
        const { username, password } = authCredDto;
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(password, salt);
        const user = this.UserRepository.create({ username, password:hashedPassword });
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

    async SignInUser ( authCredDto : AuthDto): Promise<{accessToken : string }> {
        const {username , password } = authCredDto;
        let user = await this.UserRepository.findOne({ where : { username } });
        if(user && (await bcrypt.compare(password, user.password))) {
            const JwtPayload : JwtPayload= {username};
            const accessToken = await this.jwtService.sign(JwtPayload);
            return {accessToken}
        }else {
            throw new UnauthorizedException("please check your username and password")
        }
    }
}
