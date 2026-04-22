import { IsEmail, IsNotEmpty, IsOptional, IsArray, IsBoolean, IsEnum, ValidateNested, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class SubscriberPreferencesDto {
    @IsOptional()
    @IsEnum(['daily', 'weekly', 'instantly'])
    frequency?: 'daily' | 'weekly' | 'instantly';

    @IsOptional()
    @IsArray()
    categories?: string[];

    @IsOptional()
    @IsBoolean()
    deepAnalysisOnly?: boolean;

    @IsOptional()
    @IsBoolean()
    receiveDigests?: boolean;
}

export class SubscribeDto {
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsOptional()
    @ValidateNested()
    @Type(() => SubscriberPreferencesDto)
    preferences?: SubscriberPreferencesDto;

    @IsOptional()
    @IsEnum(['homepage', 'article', 'telegram', 'unknown'])
    source?: string;
}

export class ConfirmDto {
    @IsNotEmpty()
    @IsString()
    token: string;
}

export class UnsubscribeDto {
    @IsNotEmpty()
    @IsString()
    token: string;
}
