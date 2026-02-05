import { useMemo } from "react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { TrendingUp, TrendingDown } from "lucide-react";
import type { RevenueData } from "@shared/schema";

interface RevenueChartProps {
  data: RevenueData[];
  compact?: boolean;
}

export function RevenueChart({ data, compact = false }: RevenueChartProps) {
  const { total, trend, trendPercent } = useMemo(() => {
    if (!data || data.length === 0) {
      return { total: 0, trend: "up" as const, trendPercent: 0 };
    }
    
    const total = data.reduce((sum, d) => sum + d.amount, 0);
    const midPoint = Math.floor(data.length / 2);
    const firstHalf = data.slice(0, midPoint).reduce((sum, d) => sum + d.amount, 0);
    const secondHalf = data.slice(midPoint).reduce((sum, d) => sum + d.amount, 0);
    const trend = secondHalf >= firstHalf ? "up" : "down";
    const trendPercent = firstHalf > 0 
      ? Math.abs(Math.round(((secondHalf - firstHalf) / firstHalf) * 100))
      : 0;
    
    return { total, trend, trendPercent };
  }, [data]);

  const formatCurrency = (value: number) => {
    if (value >= 1000) {
      return `$${(value / 1000).toFixed(1)}k`;
    }
    return `$${value}`;
  };

  if (compact) {
    return (
      <div className="w-full h-16">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(120, 100%, 50%)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(120, 100%, 50%)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <Area
              type="monotone"
              dataKey="amount"
              stroke="hsl(120, 100%, 50%)"
              strokeWidth={2}
              fill="url(#colorRevenue)"
              dot={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-3">
        <div>
          <p className="text-xs text-muted-foreground font-mono uppercase tracking-wider">Daily Revenue</p>
          <p className="text-2xl font-bold text-foreground font-mono">{formatCurrency(total)}</p>
        </div>
        <div className={`flex items-center gap-1 px-2 py-1 rounded-md text-xs font-mono ${
          trend === "up" 
            ? "bg-green-500/10 text-green-400" 
            : "bg-red-500/10 text-red-400"
        }`}>
          {trend === "up" ? (
            <TrendingUp className="w-3 h-3" />
          ) : (
            <TrendingDown className="w-3 h-3" />
          )}
          <span>{trendPercent}%</span>
        </div>
      </div>
      
      <div className="w-full h-24">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
            <defs>
              <linearGradient id="colorRevenueMain" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(120, 100%, 50%)" stopOpacity={0.4} />
                <stop offset="95%" stopColor="hsl(120, 100%, 50%)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis 
              dataKey="date" 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10, fill: "hsl(260, 10%, 60%)" }}
              tickFormatter={(value) => {
                const date = new Date(value);
                return `${date.getMonth() + 1}/${date.getDate()}`;
              }}
            />
            <YAxis 
              hide 
              domain={['dataMin', 'dataMax']}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(260, 15%, 10%)",
                border: "1px solid hsl(270, 25%, 18%)",
                borderRadius: "6px",
                fontSize: "12px",
                fontFamily: "JetBrains Mono, monospace",
              }}
              labelStyle={{ color: "hsl(60, 10%, 96%)" }}
              itemStyle={{ color: "hsl(120, 100%, 50%)" }}
              formatter={(value: number) => [`$${value}`, "Revenue"]}
              labelFormatter={(label) => {
                const date = new Date(label);
                return date.toLocaleDateString("en-US", { 
                  month: "short", 
                  day: "numeric" 
                });
              }}
            />
            <Area
              type="monotone"
              dataKey="amount"
              stroke="hsl(120, 100%, 50%)"
              strokeWidth={2}
              fill="url(#colorRevenueMain)"
              dot={false}
              activeDot={{ 
                r: 4, 
                fill: "hsl(120, 100%, 50%)",
                stroke: "hsl(240, 10%, 4%)",
                strokeWidth: 2
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
