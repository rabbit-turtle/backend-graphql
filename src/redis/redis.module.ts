import * as redisStore from 'cache-manager-redis-store';
import { CacheModule, Module } from '@nestjs/common';
import { RedisService } from './redis.service';

@Module({
  imports: [
    CacheModule.register({
      store: redisStore,
      ttl: null,
    }),
  ],
  providers: [RedisService],
  exports: [RedisService],
})
export class RedisModule {}
