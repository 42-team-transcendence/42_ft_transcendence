import {BadRequestException, Controller, Get, Param, Res, UseGuards} from '@nestjs/common';
import {UserService} from "../user/user.service";

@Controller('public')
export class PublicController {

    constructor(
        private readonly userService: UserService,
    ) { }

    @Get('picture/:string')
    @UseGuards()
    async getProfilePicture (
        @Param('string') username: string,
        @Res() res,
    ) {
        const filename = await this.userService.findPP(username);
        if (!filename) {
            throw new BadRequestException('Invalid username this login doesnt exist');
        }
        if (filename.startsWith('http') || filename.startsWith('https')) {
            return (res.redirect(filename));
        } else {
            res.sendFile(process.cwd() + '/' + filename);
        }
    }
}
