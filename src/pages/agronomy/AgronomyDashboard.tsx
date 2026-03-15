import { PageHeader } from '@/components/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { Beaker, Calculator, Bug, Calendar, TrendingUp, Droplets } from 'lucide-react';

const tools = [
  { title: 'Fertiliser Planner', desc: 'Calculate optimal fertiliser rates', icon: Beaker, url: '/agronomy/fertiliser' },
  { title: 'Lime Calculator', desc: 'Determine lime application rates', icon: Calculator, url: '/agronomy/lime' },
  { title: 'Spray Programs', desc: 'Plan pest & disease management', icon: Bug, url: '/agronomy/spray' },
  { title: 'Crop Calendar', desc: 'Seasonal planting and activity plans', icon: Calendar, url: '/agronomy/calendar' },
  { title: 'Yield Estimator', desc: 'Forecast expected crop yields', icon: TrendingUp, url: '/agronomy/yield' },
  { title: 'Irrigation Planner', desc: 'Water management and scheduling', icon: Droplets, url: '/agronomy/irrigation' },
];

export default function AgronomyDashboard() {
  return (
    <div className="space-y-6">
      <PageHeader title="Agronomy Tools" description="Precision agriculture planning and analysis tools" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {tools.map(t => (
          <Link key={t.url} to={t.url}>
            <Card className="hover:border-primary/50 transition-colors cursor-pointer h-full">
              <CardHeader className="pb-3">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center mb-2">
                  <t.icon className="h-5 w-5 text-primary" />
                </div>
                <CardTitle className="text-base">{t.title}</CardTitle>
              </CardHeader>
              <CardContent><p className="text-sm text-muted-foreground">{t.desc}</p></CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
