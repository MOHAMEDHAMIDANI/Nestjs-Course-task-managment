import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './Jwt.strategy';
@Module({
  imports: [TypeOrmModule.forFeature([User]) , 
PassportModule.register({ defaultStrategy: 'jwt' }),
JwtModule.register({secret: 'topSecret51' , 
  signOptions : {
    expiresIn: 3600,
  }
} , 
)],
  exports: [AuthService , JwtStrategy , PassportModule],
  providers: [AuthService , JwtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
