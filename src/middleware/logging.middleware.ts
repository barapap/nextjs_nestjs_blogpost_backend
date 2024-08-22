// Purpose: Logs incoming HTTP requests, including details like the request method, URL, and response time.
// Benefits:
    // Monitoring: Helps you keep track of incoming requests and how your server is responding to them.
    // Debugging: Useful for debugging by providing a trail of what requests were made and when.
    // Auditing: Useful for audit purposes, tracking who accessed what resources.


import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggingMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    console.log(`Request... ${req.method} ${req.url}`);
    next();
  }
}
