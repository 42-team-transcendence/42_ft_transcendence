import { AuthGuard } from "@nestjs/passport";

export class IntraGuard extends AuthGuard('42') {
    constructor() {
        super();
    }
}
