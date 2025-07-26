import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Zdravmost Telemedicine API is running! 🏥';
  }
}
