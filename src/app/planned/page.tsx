"use client";

import { useState, useMemo, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { CAREERS, IB_SUBJECTS, UNIVERSITIES, Career, Subject, University } from "@/app/lib/ib-data";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  CheckCircle2, 
  AlertTriangle, 
  Info, 
  Search,
  ChevronRight,
  Star,
  ChevronLeft,
  Check,
  Globe,
  ExternalLink,
  XCircle,
  MapPin,
  GraduationCap,
  Sparkles
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";

type SubjectSelection = {
  subjectId: string;
  level: "HL" | "SL" | null;
  groupId: number; 
};

const STEPS = ["Career", "Subjects", "Region", "Results"];
const REGIONS = [
  { name: "United Kingdom", code: "GB" },
  { name: "United States", code: "US" },
  { name: "Europe", code: "EU" },
  { name: "Asia", code: "AS" },
  { name: "Other", code: "INT" }
];

function PlannedFlowContent() {
  const [step, setStep] = useState(1);
  const [selectedCareer, setSelectedCareer] = useState<Career | null>(null);
  const [selectedRegions, setSelectedRegions] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selections, setSelections] = useState<SubjectSelection[]>([]);
  
  const searchParams = useSearchParams();
  const careerIdParam = searchParams.get('careerId');

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [step]);

  useEffect(() => {
    if (careerIdParam) {
      const career = CAREERS.find(c => c.id === careerIdParam);
      if (career) {
        setSelectedCareer(career);
        setStep(2);
      }
    }
  }, [careerIdParam]);

  const filteredCareers = useMemo(() => {
    return CAREERS.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [searchQuery]);

  const handleSubjectToggle = (subjectId: string, level: "HL" | "SL", currentGroupId: number) => {
    setSelections(prev => {
      const existing = prev.find(s => s.subjectId === subjectId);
      if (existing && existing.level === level) {
        return prev.filter(s => s.subjectId !== subjectId);
      }
      return [...prev.filter(s => s.subjectId !== subjectId), { subjectId, level, groupId: currentGroupId }];
    });
  };

  const handleRegionToggle = (regionName: string) => {
    setSelectedRegions(prev => 
      prev.includes(regionName) 
        ? prev.filter(r => r !== regionName) 
        : [...prev, regionName]
    );
  };

  const hlCount = selections.filter(s => s.level === "HL").length;
  const totalCount = selections.length;

  const isValid = useMemo(() => {
    if (totalCount !== 6) return false;
    if (hlCount < 3 || hlCount > 4) return false;
    
    const group1Selection = selections.filter(s => s.groupId === 1);
    const group2Selection = selections.filter(s => s.groupId === 2);
    const group3Selection = selections.filter(s => s.groupId === 3 || s.subjectId === 'ess');
    const group4Selection = selections.filter(s => s.groupId === 4 || s.subjectId === 'ess');
    const group5Selection = selections.filter(s => s.groupId === 5);
    
    const languageValid = (group1Selection.length >= 1 && group2Selection.length >= 1) || (group1Selection.length >= 2);
    if (!languageValid) return false;
    
    if (group3Selection.length < 1) return false;
    if (group4Selection.length < 1) return false;
    if (group5Selection.length !== 1) return false;

    return true;
  }, [selections, totalCount, hlCount]);

  const calculateMatch = (career: Career) => {
    let score = 0;
    const totalPossible = career.requiredSubjects.length + career.recommendedSubjects.length;
    
    const details = career.requiredSubjects.map(req => {
      const sel = selections.find(s => s.subjectId === req.id);
      const isMet = req.level === 'HL' ? sel?.level === 'HL' : !!sel;
      if (isMet) score += 1;
      return { id: req.id, isRequired: true, isMet, level: req.level };
    });

    career.recommendedSubjects.forEach(req => {
      const sel = selections.find(s => s.subjectId === req.id);
      const isMet = !!sel;
      if (isMet) score += 1;
      details.push({ id: req.id, isRequired: false, isMet, level: req.level });
    });

    const percent = totalPossible > 0 ? Math.round((score / totalPossible) * 100) : 100;
    return { percent, details };
  };

  const careerResults = useMemo(() => {
    const results = CAREERS.map(c => ({
      ...c,
      match: calculateMatch(c)
    }));

    return results.sort((a, b) => {
      if (selectedCareer) {
        if (a.id === selectedCareer.id) return -1;
        if (b.id === selectedCareer.id) return 1;
      }
      return b.match.percent - a.match.percent;
    });
  }, [selections, selectedCareer]);

  const renderStars = (count: number) => {
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => {
          const isFull = star <= count;
          const isHalf = !isFull && (star - 0.5 <= count);
          return (
            <div key={star} className="relative">
              <Star className="w-3 h-3 fill-muted text-muted" />
              {isFull && <Star className="absolute inset-0 w-3 h-3 fill-orange-400 text-orange-400" />}
              {isHalf && (
                <div className="absolute inset-0 overflow-hidden w-[50%]">
                  <Star className="w-3 h-3 fill-orange-400 text-orange-400" />
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  const getSubjectName = (id: string) => {
    return IB_SUBJECTS.find(s => s.id === id)?.name || id;
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] bg-background overflow-hidden">
      <div className="w-full bg-background border-b shadow-sm z-10">
        <div className="container mx-auto px-4 py-6 max-w-6xl">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-muted-foreground hover:text-primary"
              onClick={() => setStep(prev => Math.max(1, prev - 1))}
              disabled={step === 1}
            >
              <ChevronLeft className="w-4 h-4 mr-1" /> Back
            </Button>
            
            <div className="flex-1 flex items-center justify-center gap-4 sm:gap-12">
              {STEPS.map((label, i) => (
                <div key={label} className="flex items-center gap-2">
                  <div className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all",
                    step === i + 1 ? "bg-accent text-white" : step > i + 1 ? "bg-success text-white" : "bg-muted text-muted-foreground"
                  )}>
                    {step > i + 1 ? <Check className="w-4 h-4" /> : i + 1}
                  </div>
                  <span className={cn(
                    "text-sm font-semibold hidden sm:inline",
                    step === i + 1 ? "text-primary" : "text-muted-foreground"
                  )}>
                    {label}
                  </span>
                  {i < STEPS.length - 1 && <div className="hidden sm:block w-8 h-[2px] bg-muted mx-2" />}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <ScrollArea className="flex-1 w-full bg-muted/10">
        <div className="container mx-auto px-4 pb-32 max-w-6xl pt-6">
          {step === 1 && (
            <div className="space-y-8 animate-fade-in">
              <div className="text-center space-y-4 max-w-2xl mx-auto">
                <h1 className="text-4xl font-bold text-primary tracking-tight">Select your career goal</h1>
                <p className="text-muted-foreground text-lg">We'll tailor your IB subject recommendations based on what you want to become.</p>
                <div className="relative max-w-md mx-auto pt-4">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input placeholder="Search careers..." className="pl-12 h-12 rounded-xl bg-white border shadow-sm" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                </div>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCareers.map(career => (
                  <Card key={career.id} className={cn("relative cursor-pointer transition-all duration-300 border-2 hover:border-accent", selectedCareer?.id === career.id ? "border-accent bg-accent/5 ring-1 ring-accent shadow-lg" : "border-transparent bg-white shadow-sm")} onClick={() => setSelectedCareer(career)}>
                    <CardHeader className="space-y-3">
                      <Badge variant="outline" className={cn("w-fit flex gap-1.5 items-center px-3 py-1 rounded-full border-none font-semibold text-[10px] uppercase", career.riskLevel === 'Safe' ? 'bg-success/10 text-success' : career.riskLevel === 'Moderate' ? 'bg-warning/10 text-warning' : 'bg-destructive/10 text-destructive')}>
                        {career.riskLevel === 'Safe' ? <CheckCircle2 className="w-3 h-3" /> : career.riskLevel === 'Moderate' ? <AlertTriangle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                        {career.riskLevel} Risk
                      </Badge>
                      <CardTitle className="text-xl">{career.name}</CardTitle>
                      <CardDescription className="text-sm line-clamp-2">{career.description}</CardDescription>
                    </CardHeader>
                  </Card>
                ))}
              </div>
              <div className="flex justify-center pt-8"><Button disabled={!selectedCareer} onClick={() => setStep(2)} size="lg" className="h-14 px-12 rounded-full font-bold shadow-xl bg-primary">Continue to Subjects <ChevronRight className="ml-2 w-5 h-5" /></Button></div>
            </div>
          )}

          {step === 2 && selectedCareer && (
            <div className="space-y-10 animate-fade-in">
              <div className="space-y-4">
                <h1 className="text-4xl font-bold text-primary">Select your IB subjects</h1>
                <p className="text-muted-foreground text-lg">Choose 6 subjects — 3 or 4 at Higher Level (HL).</p>
              </div>

              <div className="space-y-6">
                <Card className="border-2 border-primary/20 bg-white shadow-md overflow-hidden rounded-2xl">
                  <div className="bg-primary/5 px-6 py-4 border-b flex items-center gap-3">
                    <Sparkles className="w-5 h-5 text-accent" />
                    <h3 className="text-sm font-bold text-primary uppercase tracking-wider">General Subject Requirements for {selectedCareer.name}</h3>
                  </div>
                  <CardContent className="p-6">
                    <div className="grid md:grid-cols-2 gap-8">
                      <div className="space-y-3">
                        <div className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Crucial Prerequisites</div>
                        <div className="flex flex-wrap gap-2">
                          {selectedCareer.requiredSubjects.map(req => (
                            <Badge key={req.id} variant="default" className="bg-primary text-white rounded-full px-4 py-1.5 text-xs font-bold">
                              {getSubjectName(req.id)} {req.level}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Recommended Support</div>
                        <div className="flex flex-wrap gap-2">
                          {selectedCareer.recommendedSubjects.map(req => (
                            <Badge key={req.id} variant="secondary" className="bg-muted text-primary rounded-full px-4 py-1.5 text-xs font-semibold">
                              {getSubjectName(req.id)} {req.level}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <TooltipProvider>
                <div className="space-y-12">
                  {[1, 2, 3, 4, 5, 6].map(groupNum => {
                    const groupSubjects = IB_SUBJECTS.filter(s => {
                      return Array.isArray(s.group) ? s.group.includes(groupNum) : s.group === groupNum;
                    });
                    if (groupSubjects.length === 0) return null;
                    return (
                      <div key={groupNum} className="space-y-6">
                        <div className="flex items-center gap-4">
                          <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-widest whitespace-nowrap">Group {groupNum}</h3>
                          <div className="h-px bg-muted w-full" />
                        </div>
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                          {groupSubjects.map(subject => {
                            const sel = selections.find(s => s.subjectId === subject.id);
                            const isSelectedGlobally = !!selections.find(s => s.subjectId === subject.id);
                            const currentDifficulty = sel ? (sel.level === 'HL' ? subject.difficultyHL : subject.difficultySL) : 0;

                            return (
                              <Card key={`${groupNum}-${subject.id}`} className={cn("transition-all border-2", isSelectedGlobally ? "border-accent bg-accent/5 shadow-md" : "bg-white")}>
                                <CardHeader className="p-4 pb-2">
                                  <div className="flex justify-between items-start gap-2">
                                    <div className="space-y-1">
                                      <CardTitle className="text-sm font-bold leading-tight">{subject.name}</CardTitle>
                                      {subject.isMandatory && <Badge className="bg-destructive/10 text-destructive text-[9px] px-1.5 h-4">Mandatory</Badge>}
                                    </div>
                                    <Tooltip>
                                      <TooltipTrigger asChild><Button variant="ghost" size="icon" className="w-5 h-5 rounded-full"><Info className="w-3 h-3" /></Button></TooltipTrigger>
                                      <TooltipContent className="max-w-[200px] p-3 shadow-xl border-2"><p className="text-xs">{subject.tip}</p></TooltipContent>
                                    </Tooltip>
                                  </div>
                                  <div className="mt-2">{renderStars(currentDifficulty)}</div>
                                </CardHeader>
                                <CardContent className="p-4 pt-4 flex gap-2">
                                  <Button 
                                    variant={sel?.level === 'HL' ? 'default' : 'outline'} 
                                    size="sm" 
                                    className="flex-1 text-[11px] font-bold" 
                                    onClick={() => handleSubjectToggle(subject.id, 'HL', groupNum)} 
                                    disabled={subject.id.endsWith('_ab') || subject.id === 'self_lang_a'}
                                  >
                                    HL
                                  </Button>
                                  <Button 
                                    variant={sel?.level === 'SL' ? 'default' : 'outline'} 
                                    size="sm" 
                                    className="flex-1 text-[11px] font-bold" 
                                    onClick={() => handleSubjectToggle(subject.id, 'SL', groupNum)}
                                  >
                                    SL
                                  </Button>
                                </CardContent>
                              </Card>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </TooltipProvider>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-12 animate-fade-in max-w-3xl mx-auto py-12 text-center">
              <h1 className="text-4xl font-bold text-primary">Target Study Regions</h1>
              <div className="grid sm:grid-cols-2 gap-4 text-left">
                {REGIONS.map(region => (
                  <Card key={region.name} className={cn("cursor-pointer border-2 p-6 flex items-center gap-4 transition-all hover:shadow-md", selectedRegions.includes(region.name) ? "border-accent bg-accent/5 ring-1 ring-accent" : "bg-white border-transparent shadow-sm")} onClick={() => handleRegionToggle(region.name)}>
                    <Globe className={cn("w-6 h-6", selectedRegions.includes(region.name) ? "text-accent" : "text-muted-foreground")} />
                    <span className="text-lg font-bold">{region.name}</span>
                  </Card>
                ))}
              </div>
              <div className="flex justify-center pt-8"><Button disabled={selectedRegions.length === 0} onClick={() => setStep(4)} size="lg" className="h-14 px-12 rounded-full font-bold bg-primary shadow-xl">Show Final Results <ChevronRight className="ml-2 w-5 h-5" /></Button></div>
            </div>
          )}

          {step === 4 && (
            <div className="animate-fade-in space-y-10 py-8">
              <h2 className="text-4xl font-bold text-primary tracking-tight">Your Career Matches</h2>
              <div className="space-y-12">
                {careerResults.map((career) => (
                  <Card key={career.id} className={cn("border-2 shadow-xl rounded-2xl bg-white overflow-hidden", selectedCareer?.id === career.id ? "border-primary ring-1 ring-primary/20" : "")}>
                    <CardHeader className="p-8 pb-4">
                      <div className="flex items-center justify-between gap-6">
                        <div className="space-y-4 flex-1">
                          <CardTitle className="text-3xl font-bold text-primary flex items-center gap-3">
                            {career.name}
                            {selectedCareer?.id === career.id && <Badge className="bg-accent text-white border-none text-[10px] py-0.5">SELECTED TARGET</Badge>}
                          </CardTitle>
                          <div className="flex flex-wrap gap-2">
                            {career.match.details.map((detail, i) => (
                              <Badge key={`${career.id}-req-${i}`} variant="outline" className={cn("px-4 py-2 text-xs font-bold rounded-full flex items-center gap-2", detail.isMet ? "bg-success/5 text-success border-success/30" : "bg-destructive/5 text-destructive border-destructive/30")}>
                                {detail.isMet ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                                {getSubjectName(detail.id)} {detail.level}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div className="text-primary font-black text-5xl tabular-nums">{career.match.percent}%</div>
                      </div>
                    </CardHeader>
                    <Accordion type="single" collapsible className="w-full border-t">
                      <AccordionItem value="unis" className="border-none">
                        <AccordionTrigger className="px-8 py-5 hover:no-underline hover:bg-muted/30 transition-colors">
                          <span className="font-bold text-primary text-lg flex items-center gap-2">
                            <GraduationCap className="w-5 h-5 text-accent" /> Recommended Universities
                          </span>
                        </AccordionTrigger>
                        <AccordionContent className="px-8 pb-10 pt-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
                          {UNIVERSITIES.filter(u => (selectedRegions.length === 0 || selectedRegions.includes(u.region)) && u.career === career.id).length > 0 ? (
                            UNIVERSITIES.filter(u => (selectedRegions.length === 0 || selectedRegions.includes(u.region)) && u.career === career.id).map((uni, i) => (
                              <Card key={`${career.id}-uni-${i}`} className="shadow-lg border-muted transition-all hover:border-accent flex flex-col rounded-xl overflow-hidden">
                                <CardHeader className="p-5 pb-3">
                                  <div className="flex justify-between items-start">
                                    <div className="flex items-center gap-1.5 text-accent font-bold text-[11px] uppercase tracking-wider"><MapPin className="w-3.5 h-3.5" /> {uni.region}</div>
                                    <Badge variant="secondary" className="font-black text-xs h-6 bg-muted px-2">{uni.score}</Badge>
                                  </div>
                                  <CardTitle className="text-base font-bold mt-2 text-primary">{uni.name}</CardTitle>
                                </CardHeader>
                                <CardContent className="p-5 pt-2 space-y-4 flex-1 flex flex-col">
                                  <div className="p-4 bg-muted/50 rounded-xl border border-muted text-[11px] leading-relaxed flex-1">
                                    <span className="font-bold block mb-2 text-primary uppercase text-[9px] tracking-widest">Entry Requirements</span>
                                    {uni.requirements}
                                  </div>
                                  <div className="grid grid-cols-2 gap-3">
                                    <Button variant="outline" className="text-[10px] h-9 px-2 font-bold" asChild><a href={uni.link} target="_blank" rel="noopener noreferrer">Official Site <ExternalLink className="ml-1.5 w-3 h-3" /></a></Button>
                                    <Button variant="default" className="text-[10px] h-9 px-2 font-bold bg-primary" asChild><a href={uni.programLink} target="_blank" rel="noopener noreferrer">Program <ExternalLink className="ml-1.5 w-3 h-3" /></a></Button>
                                  </div>
                                </CardContent>
                              </Card>
                            ))
                          ) : (
                            <div className="col-span-full py-12 text-center text-muted-foreground italic border rounded-xl bg-muted/20">
                              No universities found for this career in the selected regions.
                            </div>
                          )}
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {step === 2 && (
        <div className="z-50 p-6 bg-white border-t shadow-[0_-4px_20px_rgba(0,0,0,0.1)]">
          <div className="container mx-auto max-w-6xl flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-8 text-sm font-black text-primary uppercase tracking-widest">
              <span className="flex items-center gap-2">SUBJECTS SELECTED: <span className={cn(totalCount === 6 ? "text-success" : "text-destructive")}>{totalCount}/6</span></span>
              <span className="flex items-center gap-2">HL COUNT: <span className={cn(hlCount >= 3 && hlCount <= 4 ? "text-success" : "text-destructive")}>{hlCount}/3-4</span></span>
            </div>
            <Button disabled={!isValid} onClick={() => setStep(3)} className="w-full sm:w-auto px-12 h-14 rounded-full font-bold bg-accent hover:bg-accent/90 shadow-xl text-white text-lg">Check My Match <ChevronRight className="ml-2 w-6 h-6" /></Button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function PlannedFlow() {
  return (
    <Suspense fallback={<div className="flex h-screen items-center justify-center">Loading Navigator...</div>}>
      <PlannedFlowContent />
    </Suspense>
  );
}
