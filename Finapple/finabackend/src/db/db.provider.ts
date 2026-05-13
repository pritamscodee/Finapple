import { Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema';

export const DbProvider: Provider = {
    provide: 'DRIZZLE',

    inject: [ConfigService],

    useFactory: (configService: ConfigService) => {
        const databaseUrl = configService.get<string>('DATABASE_URL');

        if (!databaseUrl) {
            throw new Error('DATABASE_URL missing');
        }

        const pool = new Pool({
            connectionString: databaseUrl,
            max: 10,
        });

        return drizzle(pool, { schema });
    },
};
