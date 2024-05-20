import { Body, Controller, Post } from '@nestjs/common';
import { AuthDto } from './Dto/auth.dto';
import { AuthService } from './auth.service';
import { access } from 'fs';

@Controller('auth')
export class AuthController {
    constructor(private authService : AuthService) {}
    @Post('/signup')
    signUp(@Body() authDto : AuthDto) : Promise<void> {
        return this.authService.createUser(authDto);
    }
    @Post('/signin')
    signIn(@Body() authDto : AuthDto) : Promise<{accessToken : string }> {
        return this.authService.SignInUser(authDto);
    }
}
