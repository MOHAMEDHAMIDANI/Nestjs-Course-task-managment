import { IsString, Matches, MaxLength, MinLength } from "class-validator";

export class AuthDto {
    @IsString()
    @MinLength(4)
    @MaxLength(20)
    username : string ;
    @IsString()
    @MinLength(4)
    @MaxLength(20)
    // @Matches( reg , { message : "message to display "}) if i have a reg to apply 
    password : string ;
}