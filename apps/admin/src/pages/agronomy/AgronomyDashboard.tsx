import { PageHeader } from '@/components/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import {
  Beaker, Calculator, Bug, Calendar, TrendingUp, Droplets,
  Zap, MapPin, Mountain, Tractor, BookOpen, Package, History,
} from 'lucide-react';

const agronomyTools = [
  { title: 'Fertiliser Planner', desc: 'Calculate optimal fertiliser rates', icon: Beaker, url: '/agronomy/fertiliser' },
  { title: 'Lime Calculator', desc: 'Determine lime application rates', icon: Calculator, url: '/agronomy/lime' },
  { title: 'Spray Programs', desc: 'Plan pest & disease management', icon: Bug, url: '/agronomy/spray' },
  { title: 'Crop Calendar', desc: 'Seasonal planting and activity plans', icon: Calendar, url: '/agronomy/calendar' },
  { title: 'Yield Estimator', desc: 'Forecast expected crop yields', icon: TrendingUp, url: '/agronomy/yield' },
  { title: 'Irrigation Planner', desc: 'Water management and scheduling', icon: Droplets, url: '/agronomy/irrigation' },
];

const intelligenceModules = [
  { title: 'Recommendation Engine', desc: 'Generate intelligent crop-based product recommendations', icon: Zap, url: '/agronomy/recommend' },
  { title: 'Region Profiles', desc: 'Geographic production contexts', icon: MapPin, url: '/agronomy/regions' },
  { title: 'Soil Profiles', desc: 'Soil characteristics for advisory logic', icon: Mountain, url: '/agronomy/soils' },
  { title: 'Farming Systems', desc: 'Production system contexts', icon: Tractor, url: '/agronomy/farming-systems' },
  { title: 'Advisory Rules', desc: 'Configurable recommendation rules', icon: BookOpen, url: '/agronomy/advisory-rules' },
  { title: 'Solution Bundles', desc: 'Pre-defined product programs', icon: Package, url: '/agronomy/bundles' },
  { title: 'Recommendation History', desc: 'Track all generated recommendations', icon: History, url: '/agronomy/history' },
];

function ToolGrid({ tools }: { tools: typeof agronomyTools }) {
  return (
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
  );
}

export default function AgronomyDashboard() {
  return (
    <div className="space-y-8">
      <PageHeader title="Agronomy Intelligence" description="Precision agriculture planning, analysis tools, and product recommendation engine" />

      <div>
        <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
          <Zap className="h-5 w-5 text-primary" />Agronomy Intelligence
        </h2>
        <ToolGrid tools={intelligenceModules} />
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
          <Beaker className="h-5 w-5 text-primary" />Planning Tools
        </h2>
        <ToolGrid tools={agronomyTools} />
      </div>
    </div>
  );
}
