export declare class SubscriberPreferencesDto {
    frequency?: 'daily' | 'weekly' | 'instantly';
    categories?: string[];
    deepAnalysisOnly?: boolean;
}
export declare class SubscribeDto {
    email: string;
    preferences?: SubscriberPreferencesDto;
}
export declare class UnsubscribeDto {
    token: string;
}
