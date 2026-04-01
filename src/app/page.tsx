"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { ArrowRight, Compass, GraduationCap, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function Home() {
  const [showChoices, setShowChoices] = useState(false);
  const choiceRef = useRef<HTMLDivElement>(null);

  const handleStartPlanning = () => {
    setShowChoices(true);
    // Smooth scroll to the choice section after a short delay for rendering
    setTimeout(() => {
      choiceRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 100);
  };

  return (
    <div className="flex flex-col items-center">
      {/* Hero Section */}
      <section className="w-full py-20 lg:py-32 bg-gradient-to-b from-background to-secondary/30 text-center">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 text-accent text-sm font-medium mb-6 animate-fade-in">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
            </span>
            IB Planning Made Intelligent
          </div>
          <h1 className="text-4xl md:text-6xl font-headline font-bold text-primary mb-6 animate-fade-in">
            Unlock the smartest IB subject choices for your future.
          </h1>
          <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed animate-fade-in">
            Align your diploma with your dream career. Navigate prerequisites, university requirements, and AI risks with total confidence.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in">
            <Button 
              size="lg" 
              className="bg-primary hover:bg-primary/90 rounded-full px-8"
              onClick={handleStartPlanning}
            >
              Start Planning My IB Path <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
            <Button asChild variant="outline" size="lg" className="rounded-full px-8">
              <Link href="/advisor">Talk to AI Advisor</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Choice Section - Revealed on click */}
      <section 
        ref={choiceRef}
        className={cn(
          "py-20 container mx-auto px-4 transition-all duration-700 ease-in-out transform",
          showChoices 
            ? "opacity-100 translate-y-0" 
            : "opacity-0 translate-y-10 pointer-events-none h-0 overflow-hidden py-0"
        )}
      >
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          <Card className="relative overflow-hidden group hover:shadow-xl transition-all duration-300 border-2 hover:border-accent/50 cursor-pointer">
            <Link href="/planned" className="absolute inset-0 z-10" />
            <CardHeader className="pb-2">
              <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Compass className="w-6 h-6" />
              </div>
              <CardTitle className="text-2xl">I already have a career in mind</CardTitle>
              <CardDescription className="text-base">
                Go directly to our Subject Navigator to check prerequisites for your target career.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-success" /> Prerequisite Checklists</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-success" /> IB Rules Validation</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-success" /> Career Match Analysis</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden group hover:shadow-xl transition-all duration-300 border-2 hover:border-accent/50 cursor-pointer">
            <Link href="/undecided" className="absolute inset-0 z-10" />
            <CardHeader className="pb-2">
              <div className="w-12 h-12 bg-accent/10 text-accent rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <GraduationCap className="w-6 h-6" />
              </div>
              <CardTitle className="text-2xl">I&apos;m still undecided</CardTitle>
              <CardDescription className="text-base">
                Take our Career Discovery Quiz to find pathways that match your interests and strengths.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-accent" /> Interest-Based Assessment</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-accent" /> Recommended Combinations</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-accent" /> Opportunity Analysis</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Trust Section */}
      <section className="bg-primary text-primary-foreground py-20 w-full">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="grid md:grid-cols-3 gap-12 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">49</div>
              <div className="text-primary-foreground/70">Career Pathways Analyzed</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">100%</div>
              <div className="text-primary-foreground/70">IB Rules Compliant</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">735</div>
              <div className="text-primary-foreground/70">Named University Programs</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
