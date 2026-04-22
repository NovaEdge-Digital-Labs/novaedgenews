import { Controller, Get, Query, Res, Header } from '@nestjs/common';
import { AdminService } from './admin.service';
import type { Response } from 'express';

@Controller('api/admin')
export class AdminController {
    constructor(private readonly adminService: AdminService) { }

    @Get('dashboard/stats')
    async getDashboardStats() {
        return this.adminService.getDashboardStats();
    }

    @Get('export/report')
    @Header('Content-Type', 'text/csv')
    @Header('Content-Disposition', 'attachment; filename="admin_report.csv"')
    async exportReport(@Query('period') period: string, @Res() res: Response) {
        const csv = await this.adminService.getExportReport(period || 'month');
        res.send(csv);
    }
}
