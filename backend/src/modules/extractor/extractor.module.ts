import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ExtractorService } from './extractor.service';
import { ExtractorController } from './extractor.controller';

@Module({
    imports: [HttpModule],
    controllers: [ExtractorController],
    providers: [ExtractorService],
    exports: [ExtractorService],
})
export class ExtractorModule { }
