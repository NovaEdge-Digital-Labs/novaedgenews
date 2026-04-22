"use client";
import { ResponsiveContainer, LineChart as RechartsLineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

export function LineChart({ data, title, yAxisLabel }: { data: any[], title: string, yAxisLabel?: string }) {
    return (
        <div className="premium-glass p-6 rounded-2xl flex flex-col gap-6 h-[400px]">
            <h3 className="text-lg font-bold">{title}</h3>
            <div className="flex-1 w-full h-full">
                <ResponsiveContainer width="100%" height="100%">
                    <RechartsLineChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                        <XAxis dataKey="date" stroke="rgba(255,255,255,0.5)" fontSize={12} tickMargin={10} />
                        <YAxis stroke="rgba(255,255,255,0.5)" fontSize={12} tickMargin={10} label={yAxisLabel ? { value: yAxisLabel, angle: -90, position: 'insideLeft', fill: 'rgba(255,255,255,0.5)' } : undefined} />
                        <Tooltip
                            contentStyle={{ backgroundColor: '#000', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                            itemStyle={{ color: '#fff' }}
                        />
                        <Line type="monotone" dataKey="views" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4, fill: '#3b82f6' }} activeDot={{ r: 6 }} />
                        <Line type="monotone" dataKey="clicks" stroke="#10b981" strokeWidth={3} dot={{ r: 4, fill: '#10b981' }} />
                    </RechartsLineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
