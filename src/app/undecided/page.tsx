"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { CAREERS, IB_SUBJECTS, Career } from "@/app/lib/ib-data";
import { ChevronRight, ArrowRight, BrainCircuit, Lightbulb, GraduationCap } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const interests = [
  { id: 'math', label: 'Solving complex math problems' },
  { id: 'brain', label: 'Understanding how the brain works' },
  { id: 'design', label: 'Designing things and visuals' },
  { id: 'politics', label: 'Debating politics and history' },
  { id: 'software', label: 'Building software and apps' },
  { id: 'environment', label: 'Protecting the environment' },
  { id: 'business', label: 'Managing money and organizations' },
  { id: 'writing', label: 'Creative writing and investigation' },
  { id: 'animals', label: 'Caring for and treating animals' },
  { id: 'chemistry', label: 'Working with chemistry and materials' },
  { id: 'aerospace', label: 'Exploring aircraft and robotics' },
  { id: 'recovery', label: 'Helping people with physical recovery' },
  { id: 'social', label: 'Analyzing social dynamics and culture' },
  { id: 'fashion', label: 'Designing fashion and apparel' },
  { id: 'films', label: 'Creating films and storytelling' },
  { id: 'security', label: 'Securing networks and digital data' },
];

export default function UndecidedFlow() {
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [showResults, setShowResults] = useState(false);

  const toggleInterest = (id: string) => {
    setSelectedInterests(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const getRecommendedCareers = () => {
    const recommendations: Career[] = [];
    
    if (selectedInterests.includes('math')) {
      ['quant', 'astrophysics', 'data_sci', 'finance'].forEach(id => {
        const c = CAREERS.find(x => x.id === id);
        if (c) recommendations.push(c);
      });
    }
    if (selectedInterests.includes('brain')) {
      ['neuro', 'psychology', 'medicine'].forEach(id => {
        const c = CAREERS.find(x => x.id === id);
        if (c) recommendations.push(c);
      });
    }
    if (selectedInterests.includes('software')) {
      ['cs_eng', 'ai_eng', 'devops', 'cyber'].forEach(id => {
        const c = CAREERS.find(x => x.id === id);
        if (c) recommendations.push(c);
      });
    }
    if (selectedInterests.includes('business')) {
      ['ib_banking', 'economics', 'finance', 'hosp_mgmt'].forEach(id => {
        const c = CAREERS.find(x => x.id === id);
        if (c) recommendations.push(c);
      });
    }
    
    // Deduplicate and fallback
    const uniqueRecs = Array.from(new Map(recommendations.map(r => [r.id, r])).values());
    
    if (uniqueRecs.length < 3) {
      CAREERS.slice(0, 5).forEach(c => {
        if (uniqueRecs.length < 3 && !uniqueRecs.some(r => r.id === c.id)) {
          uniqueRecs.push(c);
        }
      });
    }

    return uniqueRecs.slice(0, 3);
  };

  const recommendedCareers = getRecommendedCareers();

  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      {!showResults ? (
        <div className="space-y-10 animate-fade-in">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-accent/10 text-accent rounded-full flex items-center justify-center mx-auto mb-6">
              <BrainCircuit className="w-8 h-8" />
            </div>
            <h1 className="text-4xl font-bold text-primary">Discover Your Pathway</h1>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              Answer a few questions about your interests, and we&apos;ll suggest career paths and IB combinations that keep your options open.
            </p>
          </div>

          <Card className="border-2 shadow-xl">
            <CardHeader>
              <CardTitle className="text-2xl">What do you enjoy?</CardTitle>
              <CardDescription>Select all that apply to you.</CardDescription>
            </CardHeader>
            <CardContent className="grid sm:grid-cols-2 gap-4">
              {interests.map(interest => (
                <div 
                  key={interest.id} 
                  className={cn(
                    "flex items-center space-x-3 p-4 rounded-xl border-2 transition-all cursor-pointer",
                    selectedInterests.includes(interest.id) ? "border-accent bg-accent/5" : "hover:border-muted-foreground/30"
                  )}
                  onClick={() => toggleInterest(interest.id)}
                >
                  <Checkbox 
                    checked={selectedInterests.includes(interest.id)}
                    className="w-5 h-5 pointer-events-none"
                    onCheckedChange={() => {}} 
                  />
                  <span className="font-medium">{interest.label}</span>
                </div>
              ))}
            </CardContent>
            <div className="p-6 pt-0 flex justify-center">
              <Button 
                size="lg" 
                className="px-12 rounded-full h-14 font-bold bg-primary hover:bg-primary/90" 
                disabled={selectedInterests.length === 0}
                onClick={() => setShowResults(true)}
              >
                Analyze My Interests <ChevronRight className="ml-2 w-5 h-5" />
              </Button>
            </div>
          </Card>
        </div>
      ) : (
        <div className="space-y-12 animate-fade-in">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold text-primary">Your Top Career Pathways</h2>
            <p className="text-muted-foreground">Based on your interests, these paths show high alignment.</p>
          </div>

          <div className="grid gap-6">
            {recommendedCareers.map((career, idx) => (
              <Card key={`rec-card-${career.id}`} className="relative overflow-hidden group border-l-4 border-l-accent hover:shadow-lg transition-all">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-primary/10 text-primary rounded-full flex items-center justify-center font-bold text-lg">
                      {idx + 1}
                    </div>
                    <div>
                      <CardTitle className="text-xl">{career.name}</CardTitle>
                      <CardDescription>{career.description}</CardDescription>
                    </div>
                  </div>
                  <Button variant="ghost" asChild className="text-accent hover:text-accent/80 hover:bg-accent/10">
                    <Link href={`/planned?careerId=${career.id}`}>Explore Prereqs <ArrowRight className="ml-2 w-4 h-4" /></Link>
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="p-4 bg-muted/50 rounded-xl">
                    <h4 className="text-sm font-bold text-primary mb-3 flex items-center gap-2">
                      <GraduationCap className="w-4 h-4" /> Suggested IB Combo for this path:
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {career.requiredSubjects.map(req => (
                        <Badge key={`req-${career.id}-${req.id}`} variant="secondary" className="px-3 py-1 font-bold">
                          {IB_SUBJECTS.find(s => s.id === req.id)?.name} {req.level}
                        </Badge>
                      ))}
                      <Badge variant="outline" className="px-3 py-1 border-primary/30">Math AA HL/SL</Badge>
                      <Badge variant="outline" className="px-3 py-1 border-primary/30">Language B</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="bg-primary text-primary-foreground border-none shadow-2xl">
            <CardHeader>
              <div className="flex items-center gap-2 mb-2">
                <Lightbulb className="w-6 h-6 text-accent" />
                <CardTitle className="text-xl">Advisor Note for Undecided Students</CardTitle>
              </div>
              <CardDescription className="text-primary-foreground/90 text-base leading-relaxed">
                If you are still unsure, we recommend taking **Math AA HL** and at least one strong Science (Physics/Chemistry) and one strong Humanities subject (Economics/History) at Higher Level. This combination keeps roughly 80% of degree paths available to you worldwide.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center pb-8">
              <Button asChild className="bg-accent hover:bg-accent/90 text-white font-bold rounded-full px-8 h-12">
                <Link href="/planned">Go to Subject Navigator</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}