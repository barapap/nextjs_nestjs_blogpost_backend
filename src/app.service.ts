import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hi, congratulation, you are in a correct localhost number, now proceed to localhost:3000/api/auth/, either end with "login" or "register" for previledged access';
  }
}
