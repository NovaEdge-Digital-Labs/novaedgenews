import { AdminService } from './admin.service';
import type { Response } from 'express';
export declare class AdminController {
    private readonly adminService;
    constructor(adminService: AdminService);
    getDashboardStats(): Promise<{
        kpi: {
            totalArticles: number;
            totalViews: any;
            totalClicks: any;
            avgCtr: number;
            topCategory: any;
            revenue: number;
        };
        charts: {
            dailyViews: {
                date: string;
                views: number;
                clicks: number;
            }[];
            categoryBreakdown: {
                category: any;
                views: any;
                percentage: number;
            }[];
        };
        topArticles: {
            id: string;
            title: string;
            views: number;
            clicks: number;
            ctr: number;
            category: string;
            status: string;
        }[];
        headlineTests: {
            articleId: string;
            title: string;
            variantA: {
                headline: string;
                ctr: number;
            };
            variantB: {
                headline: string;
                ctr: number;
            };
            winner: string;
            testDays: number;
        }[];
        newsletter: {
            subscribers: number;
            openRate: number;
            clickRate: number;
        };
        pipeline: {
            pending_discovery: any;
            pending_extraction: any;
            pending_rewrite: any;
            ready_publish: any;
            published_today: number;
            failed: any;
        };
    }>;
    exportReport(period: string, res: Response): Promise<void>;
}
