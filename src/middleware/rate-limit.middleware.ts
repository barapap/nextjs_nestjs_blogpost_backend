// Purpose: Limits the number of requests a client can make to your server within a specific timeframe.
// Benefits:
    // Prevent Abuse: Helps protect your API from being overwhelmed by too many requests, either by accident or from malicious attacks (like DDoS).
    // Improved Stability: Ensures that your server remains stable and responsive by controlling the flow of requests.
    // Security: Helps mitigate brute force attacks by limiting the number of attempts a client can make.


import rateLimit from 'express-rate-limit';
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class RateLimitMiddleware implements NestMiddleware {
  private limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 50 requests per windowMs
    message: 'Too many requests from this IP, please try again later.',
  });

  use(req: Request, res: Response, next: NextFunction) {
    this.limiter(req, res, next);
  }
}
