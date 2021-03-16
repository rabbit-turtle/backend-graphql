import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { join } from 'path';
import { AuthModule } from './auth/auth.module';
import { ChatsModule } from './chats/chats.module';
import { RoomsModule } from './rooms/rooms.module';
import { UsersModule } from './users/users.module';
import { Request, Response } from 'express';
import { RedisModule } from './redis/redis.module';

export type CustomGraphQlContext = {
  req: Request;
  res: Response;
};

@Module({
  imports: [
    GraphQLModule.forRoot({
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      cors: {
        origin: true,
        credentials: true,
      },
      playground: true,
      context: ({ req, res }: { req: Request; res: Response }) => {
        return { req, res };
      },
    }),
    RedisModule,
    AuthModule,
    RoomsModule,
    UsersModule,
    ChatsModule,
  ],
  providers: [],
})
export class AppModule {}
