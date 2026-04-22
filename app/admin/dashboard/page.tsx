"use client";
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { StatCard } from '@/components/admin/StatCard';
import { LineChart } from '@/components/admin/LineChart';
import { PieChart } from '@/components/admin/PieChart';
import { DataTable } from '@/components/admin/DataTable';
import { FileText, Eye, MousePointerClick, TrendingUp, DollarSign, Users, Award, Download, ArrowLeft, MailOpen } from 'lucide-react';
import Link from 'next/link';

export default function AdminDashboardPage() {
    const { data: stats, isLoading, error } = useQuery({
        queryKey: ['adminStats'],
        queryFn: async () => {
            const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3005'}/api/admin/dashboard/stats`);
            return res.data;
        },
        refetchInterval: 5 * 60 * 1000, // 5 minutes
    });

    if (isLoading) {
        return <div className="min-h-screen flex items-center justify-center bg-background"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div></div>;
    }

    if (error || !stats) {
        return <div className="min-h-screen flex items-center justify-center bg-background text-red-500">Failed to load dashboard data.</div>;
    }

    const { kpi, charts, topArticles, headlineTests, newsletter, pipeline } = stats;

    const handleExport = async () => {
        window.open(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3005'}/api/admin/export/report?period=month`, '_blank');
    };

    return (
        <div className="min-h-screen bg-background p-6 md:p-12 font-sans overflow-x-hidden">
            <div className="max-w-[1600px] mx-auto space-y-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <Link href="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-2 transition-colors">
                            <ArrowLeft className="w-4 h-4 mr-2" /> Back to App
                        </Link>
                        <h1 className="text-3xl font-black tracking-tight">Analytics Dashboard</h1>
                        <p className="text-muted-foreground">Real-time overview of NovaEdge News performance</p>
                    </div>
                    <button
                        onClick={handleExport}
                        className="px-6 py-2.5 rounded-full bg-primary text-primary-foreground font-bold hover:bg-primary/90 transition-colors flex items-center gap-2"
                    >
                        <Download className="w-4 h-4" /> Export Report
                    </button>
                </div>

                {/* KPI Row 1 */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard label="Articles Published" value={kpi.totalArticles} icon={FileText} color="text-blue-500" />
                    <StatCard label="Total Views" value={Number(kpi.totalViews || 0).toLocaleString()} icon={Eye} color="text-emerald-500" />
                    <StatCard label="Total Clicks" value={Number(kpi.totalClicks || 0).toLocaleString()} icon={MousePointerClick} color="text-purple-500" />
                    <StatCard label="Avg CTR" value={`${kpi.avgCtr}%`} icon={TrendingUp} color="text-orange-500" />
                </div>

                {/* KPI Row 2 */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard label="Top Category" value={kpi.topCategory} icon={Award} color="text-yellow-500" />
                    <StatCard label="Est. Revenue" value={`$${kpi.revenue}`} icon={DollarSign} color="text-green-500" />
                    <StatCard label="Newsletter Subs" value={newsletter.subscribers} icon={Users} color="text-pink-500" />
                    <StatCard label="Open Rate" value={`${newsletter.openRate}%`} icon={MailOpen} color="text-teal-500" />
                </div>

                {/* Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2">
                        <LineChart data={charts.dailyViews} title="Views Over Time (30 Days)" yAxisLabel="Count" />
                    </div>
                    <div className="lg:col-span-1">
                        <PieChart data={charts.categoryBreakdown} title="Category Breakdown" />
                    </div>
                </div>

                {/* Content Pipeline */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    <PipelineStat label="Pending Discovery" value={pipeline.pending_discovery} />
                    <PipelineStat label="Pending Extraction" value={pipeline.pending_extraction} />
                    <PipelineStat label="Pending Rewrite" value={pipeline.pending_rewrite} />
                    <PipelineStat label="Ready Publish" value={pipeline.ready_publish} />
                    <PipelineStat label="Published Today" value={pipeline.published_today} color="text-primary" />
                    <PipelineStat label="Failed" value={pipeline.failed} color="text-red-500" />
                </div>

                {/* Tables */}
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                    <DataTable
                        title="Top 10 Articles"
                        columns={topArticlesColumns}
                        data={topArticles}
                    />
                    <DataTable
                        title="Headline A/B Testing Results"
                        columns={abTestColumns}
                        data={headlineTests}
                    />
                </div>
            </div>
        </div>
    );
}

function PipelineStat({ label, value, color = "text-muted-foreground" }: { label: string, value: number, color?: string }) {
    return (
        <div className="premium-glass p-4 rounded-xl flex flex-col items-center justify-center text-center gap-1 border-t-2 border-t-transparent hover:border-t-primary transition-all">
            <span className={`text-2xl font-black ${color}`}>{value}</span>
            <span className="text-xs font-semibold text-muted-foreground uppercase">{label}</span>
        </div>
    );
}


const topArticlesColumns = [
    { header: 'Title', cell: (row: any) => <div className="max-w-[200px] sm:max-w-[300px] truncate" title={row.title}>{row.title}</div> },
    { header: 'Category', accessorKey: 'category' },
    { header: 'Views', accessorKey: 'views' },
    { header: 'Clicks', accessorKey: 'clicks' },
    { header: 'CTR', cell: (row: any) => `${row.ctr.toFixed(1)}%` },
    {
        header: 'Status', cell: (row: any) => (
            <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${row.status === 'published' ? 'bg-green-500/20 text-green-500' : 'bg-yellow-500/20 text-yellow-500'}`}>
                {row.status}
            </span>
        )
    }
];

const abTestColumns = [
    { header: 'Title', cell: (row: any) => <div className="max-w-[150px] sm:max-w-[200px] truncate" title={row.title}>{row.title}</div> },
    { header: 'Variant A CTR', cell: (row: any) => <span className={row.winner === 'A' ? 'text-green-500 font-bold' : ''}>{row.variantA.ctr.toFixed(1)}%</span> },
    { header: 'Variant B CTR', cell: (row: any) => <span className={row.winner === 'B' ? 'text-green-500 font-bold' : ''}>{row.variantB.ctr.toFixed(1)}%</span> },
    {
        header: 'Winner', cell: (row: any) => (
            <span className="w-6 h-6 inline-flex items-center justify-center rounded-full bg-primary/20 text-primary text-xs font-bold ring-1 ring-primary/50">
                {row.winner}
            </span>
        )
    },
    { header: 'Days Running', cell: (row: any) => `${row.testDays}d` }
];
