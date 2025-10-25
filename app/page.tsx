import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Zap, Target, Code, TrendingUp, Sparkles } from "lucide-react";

export default function LandingPage() {
  const features = [
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Go from problem description to deployed model in under an hour. No manual feature engineering required.",
      color: "text-yellow-500",
    },
    {
      icon: Target,
      title: "Purpose-Built",
      description: "Create models tailored to your exact use case, not generic solutions that don't fit your data.",
      color: "text-red-500",
    },
    {
      icon: Code,
      title: "Production-Ready API",
      description: "Get instant API endpoints for your models. Integrate with your existing systems in minutes.",
      color: "text-blue-500",
    },
    {
      icon: TrendingUp,
      title: "Automated Excellence",
      description: "AI agents handle data analysis, feature engineering, and model selection automatically.",
      color: "text-green-500",
    },
  ];

  return (
    <div className="min-h-screen">
      <nav className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              BuildML
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/signin">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link href="/signup">
              <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      <section className="relative py-24 px-4 md:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 -z-10" />
        <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] -z-10" />
        
        <div className="max-w-6xl mx-auto text-center animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-100 text-purple-700 text-sm font-medium mb-6">
            <Sparkles className="h-4 w-4" />
            <span>Powered by AI Agents</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold mb-6 bg-gradient-to-r from-purple-600 via-blue-600 to-pink-600 bg-clip-text text-transparent leading-tight">
            Build Custom ML Models<br />in Minutes, Not Months
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed">
            Stop blindly using ChatGPT for ML tasks. BuildML helps Machine Learning Engineers create lightweight, custom models tailored to specific business needs automatically.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/signup">
              <Button size="lg" className="text-lg px-8 py-6 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 shadow-lg hover:shadow-xl transition-all">
                Get Started Free
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="text-lg px-8 py-6">
              View Demo
            </Button>
          </div>
        </div>
      </section>

      <section className="py-24 px-4 md:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Everything you need to ship faster
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              BuildML provides all the tools and automation you need to create production-ready ML models
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card key={feature.title} className="border-2 hover:border-primary/50 transition-all hover:shadow-lg animate-slide-up" style={{ animationDelay: `${index * 0.1}s` }}>
                <CardHeader>
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-100 to-blue-100 flex items-center justify-center mb-4">
                    <feature.icon className={`h-7 w-7 ${feature.color}`} />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 px-4 md:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600 to-blue-600 -z-10" />
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Transform Your ML Workflow?
          </h2>
          <p className="text-xl mb-10 opacity-90">
            Join ML engineers who are shipping custom models faster than ever.
          </p>
          <Link href="/signup">
            <Button size="lg" className="text-lg px-8 py-6 bg-white text-purple-600 hover:bg-gray-100 shadow-xl">
              Start Building Now
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
