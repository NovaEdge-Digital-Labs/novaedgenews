"use client";
import { ResponsiveContainer, PieChart as RechartsPieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

export function PieChart({ data, title }: { data: any[], title: string }) {
    return (
        <div className="premium-glass p-6 rounded-2xl flex flex-col gap-6 h-[400px]">
            <h3 className="text-lg font-bold">{title}</h3>
            <div className="flex-1 w-full h-full">
                <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={100}
                            paddingAngle={5}
                            dataKey="views"
                            nameKey="category"
                            stroke="none"
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip
                            contentStyle={{ backgroundColor: '#000', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                            itemStyle={{ color: '#fff' }}
                            formatter={(value: any, name: any, props: any) => [`${value} views (${props.payload.percentage}%)`, name]}
                        />
                        <Legend verticalAlign="bottom" height={36} iconType="circle" />
                    </RechartsPieChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
