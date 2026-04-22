import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
    label: string;
    value: string | number;
    change?: string;
    icon: LucideIcon;
    color?: string;
}

export function StatCard({ label, value, change, icon: Icon, color = 'text-primary' }: StatCardProps) {
    return (
        <div className="premium-glass p-6 rounded-2xl flex flex-col gap-4">
            <div className="flex justify-between items-start">
                <p className="text-sm text-muted-foreground font-medium">{label}</p>
                <div className={`p-2 rounded-xl bg-white/5 ${color}`}>
                    <Icon className="w-5 h-5" />
                </div>
            </div>
            <div>
                <h3 className="text-3xl font-black">{value}</h3>
                {change && (
                    <p className={`text-xs mt-2 font-medium ${change.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
                        {change}
                    </p>
                )}
            </div>
        </div>
    );
}
