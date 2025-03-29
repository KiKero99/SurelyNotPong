import { Logger, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PongModule } from './pong/pong.module';

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        PongModule,
    ],
    controllers: [],
    providers: [Logger],
})
export class AppModule {}
