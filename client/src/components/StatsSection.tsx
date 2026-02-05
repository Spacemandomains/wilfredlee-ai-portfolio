import { motion } from "framer-motion";
import { DollarSign, Rocket, TrendingUp, Users } from "lucide-react";
import { Card } from "@/components/ui/card";

interface StatsSectionProps {
  totalRevenue: number;
  projectCount: number;
  launchCount: number;
  customerCount: number;
}

export function StatsSection({ 
  totalRevenue, 
  projectCount, 
  launchCount, 
  customerCount 
}: StatsSectionProps) {
  const formatCurrency = (amount: number) => {
    if (amount === 0) return "$0";
    if (amount >= 1000) return `$${(amount / 1000).toFixed(1)}k`;
    return `$${amount}`;
  };

  const stats = [
    {
      label: "Total Revenue",
      value: formatCurrency(totalRevenue),
      icon: DollarSign,
      color: "text-green-400",
      bgColor: "bg-green-400/10",
    },
    {
      label: "Active Projects",
      value: projectCount.toString(),
      icon: Rocket,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      label: "PH Launches",
      value: launchCount.toString(),
      icon: TrendingUp,
      color: "text-[#FF6154]",
      bgColor: "bg-[#FF6154]/10",
    },
    {
      label: "Customers",
      value: customerCount.toString(),
      icon: Users,
      color: "text-secondary",
      bgColor: "bg-secondary/10",
    },
  ];

  return (
    <section className="py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <Card className="p-5 bg-card border-card-border hover-elevate">
                <div className={`w-10 h-10 rounded-lg ${stat.bgColor} flex items-center justify-center mb-3`}>
                  <stat.icon className={`w-5 h-5 ${stat.color}`} />
                </div>
                <p 
                  className="text-2xl md:text-3xl font-bold font-mono text-foreground"
                  data-testid={`stat-value-${stat.label.toLowerCase().replace(/\s/g, '-')}`}
                >
                  {stat.value}
                </p>
                <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
