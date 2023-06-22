import { ExecutionContext, createParamDecorator } from "@nestjs/common";

export const GetUser = createParamDecorator(
    (data: string | undefined, ctx: ExecutionContext) => {
        const request = ctx //get request object from express
            .switchToHttp()
            .getRequest();
        return request.user;
    },
); 