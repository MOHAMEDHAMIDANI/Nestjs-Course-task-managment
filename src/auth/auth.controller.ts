import { Body, Controller, Post } from '@nestjs/common';
import { AuthDto } from './Dto/auth.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
    constructor(private authService : AuthService) {}
    @Post('/signup')
    signUp(@Body() authDto : AuthDto) {
        this.authService.createUser(authDto);
    }
}
