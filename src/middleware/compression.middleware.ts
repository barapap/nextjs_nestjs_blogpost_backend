// Purpose: Compresses HTTP responses before they are sent to the client.
// Benefits:
    // Reduced Bandwidth: Compressing responses reduces the size of the data being sent, which can save bandwidth.
    // Faster Load Times: Smaller data size means faster load times for clients, improving user experience.
    // Improved Performance: Reduces the amount of data your server needs to send, which can improve overall server performance.


import compression from 'compression';
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class CompressionMiddleware implements NestMiddleware {
  private compression = compression();

  use(req: Request, res: Response, next: NextFunction) {
    this.compression(req, res, next);
  }
}
