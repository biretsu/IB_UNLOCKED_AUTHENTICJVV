
"use client";

import { useState, useMemo } from "react";
import { UNIVERSITIES, CAREERS, University } from "@/app/lib/ib-data";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, MapPin, ExternalLink, GraduationCap, Table as TableIcon, Info } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const regions = ["All", "United States", "United Kingdom", "Europe", "Asia", "Other"];

export default function UniversitiesPage() {
  const [region, setRegion] = useState("All");
  const [careerId, setCareerId] = useState("all");
  const [search, setSearch] = useState("");

  const filteredUnis = useMemo(() => {
    return UNIVERSITIES.filter(uni => {
      const regionMatch = region === "All" || uni.region === region;
      const careerMatch = careerId === "all" || uni.career === careerId;
      const searchMatch = uni.name.toLowerCase().includes(search.toLowerCase());
      return regionMatch && careerMatch && searchMatch;
    });
  }, [region, careerId, search]);

  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl space-y-12">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-primary">University Explorer</h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">Explore top universities worldwide and their typical IB entry requirements.</p>
      </div>

      <Card className="border-2 shadow-sm overflow-hidden bg-white">
        <CardHeader className="bg-primary/5 border-b py-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg"><TableIcon className="w-5 h-5 text-primary" /></div>
            <div>
              <CardTitle className="text-xl font-bold text-primary">Public Italian University Requirements</CardTitle>
              <CardDescription className="text-sm">Specific IB track requirements for Italian university recognition.</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50 hover:bg-muted/50">
                  <TableHead className="w-[150px] font-bold text-primary border-r">IB Group</TableHead>
                  <TableHead className="bg-success text-white font-bold text-center border-r min-w-[200px]">Linguistic Track</TableHead>
                  <TableHead className="bg-success text-white font-bold text-center border-r min-w-[200px]">Scientific Track</TableHead>
                  <TableHead className="bg-primary text-white font-bold text-center min-w-[200px]">Social Science Track</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow className="hover:bg-transparent">
                  <TableCell className="font-bold border-r bg-muted/20">Group 1</TableCell>
                  <TableCell className="text-center border-r p-4"><div className="font-bold text-primary">HL First Language</div><div className="text-[10px] text-muted-foreground italic">(must be Italian A for Italian citizens)</div></TableCell>
                  <TableCell className="text-center border-r p-4">First Language</TableCell>
                  <TableCell className="text-center p-4">First Language</TableCell>
                </TableRow>
                <TableRow className="hover:bg-transparent">
                  <TableCell className="font-bold border-r bg-muted/20">Group 2</TableCell>
                  <TableCell className="text-center border-r p-4">Second Language</TableCell>
                  <TableCell className="text-center border-r p-4">Second Language</TableCell>
                  <TableCell className="text-center p-4">Second Language</TableCell>
                </TableRow>
                <TableRow className="hover:bg-transparent">
                  <TableCell className="font-bold border-r bg-muted/20">Group 3</TableCell>
                  <TableCell className="text-center border-r p-4">History, Economics, or Psychology</TableCell>
                  <TableCell className="text-center border-r p-4">History, Economics, or Psychology</TableCell>
                  <TableCell className="text-center p-4"><div className="font-bold text-primary">HL History</div><div className="font-bold text-primary">HL Psychology</div></TableCell>
                </TableRow>
                <TableRow className="hover:bg-transparent">
                  <TableCell className="font-bold border-r bg-muted/20">Group 4</TableCell>
                  <TableCell className="text-center border-r p-4">Bio, Chem, Phys, ESS, or CS</TableCell>
                  <TableCell className="text-center border-r p-4">Biology, Chemistry, or Physics</TableCell>
                  <TableCell className="text-center p-4">Bio, Chem, Phys, ESS, or CS</TableCell>
                </TableRow>
                <TableRow className="hover:bg-transparent">
                  <TableCell className="font-bold border-r bg-muted/20">Group 5</TableCell>
                  <TableCell className="text-center border-r p-4">Mathematics</TableCell>
                  <TableCell className="text-center border-r p-4"><div className="font-bold text-primary">HL Mathematics</div></TableCell>
                  <TableCell className="text-center p-4">Mathematics</TableCell>
                </TableRow>
                <TableRow className="hover:bg-transparent">
                  <TableCell className="font-bold border-r bg-muted/20">Extra</TableCell>
                  <TableCell className="text-center border-r p-4">Third Language</TableCell>
                  <TableCell className="text-center border-r p-4">Another Science or Visual Art</TableCell>
                  <TableCell className="text-center p-4">Hist, Econ, or Visual Art</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <div className="bg-muted/50 p-6 rounded-2xl border shadow-sm grid md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase text-muted-foreground">Region</label>
          <Select value={region} onValueChange={setRegion}>
            <SelectTrigger className="bg-background"><SelectValue placeholder="Select region" /></SelectTrigger>
            <SelectContent>{regions.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}</SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase text-muted-foreground">Career Path</label>
          <Select value={careerId} onValueChange={setCareerId}>
            <SelectTrigger className="bg-background"><SelectValue placeholder="Select career" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Careers</SelectItem>
              {CAREERS.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase text-muted-foreground">Search</label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="University name..." className="pl-9 bg-background" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredUnis.length > 0 ? filteredUnis.map((uni, idx) => (
          <Card key={idx} className="hover:border-accent transition-all group shadow-sm flex flex-col">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-1.5 text-accent font-medium text-xs">
                  <MapPin className="w-3 h-3" /> {uni.region}
                </div>
                <Badge variant="secondary" className="font-bold text-[10px]">{uni.score}</Badge>
              </div>
              <CardTitle className="text-base group-hover:text-primary transition-colors mt-2">{uni.name}</CardTitle>
              <CardDescription className="flex items-center gap-1.5 text-[10px] mt-1">
                <GraduationCap className="w-3 h-3" /> {CAREERS.find(c => c.id === uni.career)?.name}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 flex-1 flex flex-col">
              <div className="p-3 bg-muted rounded-lg border text-[11px] leading-relaxed flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold block">Entry Requirements:</span>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="w-3 h-3 text-muted-foreground cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="text-[10px] max-w-[200px]">Always verify requirements with official university portals.</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                {uni.requirements}
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" className="text-[10px] h-8 px-2" asChild>
                  <a href={uni.link} target="_blank" rel="noopener noreferrer">Official Site <ExternalLink className="ml-1 w-2 h-2" /></a>
                </Button>
                {uni.programLink && (
                  <Button variant="default" className="text-[10px] h-8 px-2" asChild>
                    <a href={uni.programLink} target="_blank" rel="noopener noreferrer">Program Info <ExternalLink className="ml-1 w-2 h-2" /></a>
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        )) : (
          <div className="col-span-full text-center py-20 bg-muted/20 rounded-2xl border border-dashed">
            <p className="text-muted-foreground">No universities found matching these criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
}
