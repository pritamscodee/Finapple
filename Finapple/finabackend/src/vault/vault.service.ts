import { Inject, Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { files } from 'src/db/schema';
import { Filebody } from 'src/types/file';

@Injectable()
export class VaultService {

    constructor(
        @Inject('DRIZZLE') private db: any,
    ) { }

    async Uploadfile(f: Filebody, userId: string) {
        const inserted = await this.db.insert(files).values({
            userId,
            height: f.height,
            width: f.width,
            resource_type: f.resource_type,
            url: f.url,
            page: f.page,
            publicId: f.publicId,
        });

        return { "INSERTED-FILES": inserted, message: 'File inserted successfully' };
    }

    async Getfiles(userId: string) {
        return this.db.select().from(files).where(eq(files.userId, userId));
    }


    async DeleteFile(public_id: string) {
        try {


            const deletedFile = await this.db.delete(files).where(eq(files.publicId, public_id));
            return {
                message: "DeletedFile Successfully",
                deletedFile: deletedFile
            }

        } catch (error: any) {
            return {
                message: "Deletetion error"
            }

        }

    }
}
