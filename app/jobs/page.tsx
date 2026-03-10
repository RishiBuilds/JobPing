"use client";

import { useState, useEffect, useMemo } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  MapPin,
  DollarSign,
  Briefcase,
  Clock,
  Search,
  Building,
} from "lucide-react";
import Link from "next/link";

// Custom debounce hook
function useDebouncedValue<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}

export default function JobsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [location, setLocation] = useState("");
  const [jobType, setJobType] = useState("");
  const [workMode, setWorkMode] = useState("");
  const [experienceLevel, setExperienceLevel] = useState("");

  // Debounce search inputs by 300ms
  const debouncedSearch = useDebouncedValue(searchTerm, 300);
  const debouncedLocation = useDebouncedValue(location, 300);

  const jobs = useQuery(api.jobs.searchJobs, {
    searchTerm: debouncedSearch || undefined,
    location: debouncedLocation || undefined,
    jobType: jobType || undefined,
    workMode: workMode || undefined,
    experienceLevel: experienceLevel || undefined,
  });

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold">
          Find Your{" "}
          <span className="text-foreground">
            Dream Job
          </span>
        </h1>
        <p className="mt-2 text-muted-foreground">
          Browse thousands of opportunities from top companies
        </p>
      </div>

      {/* Search & Filters */}
      <Card className="mb-8 border-border/50">
        <CardContent className="p-6">
          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by title, skill, or keyword..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="relative w-full sm:w-48">
              <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Location..."
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-3">
            <Select value={jobType} onValueChange={setJobType}>
              <SelectTrigger className="w-36">
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="full-time">Full-time</SelectItem>
                <SelectItem value="part-time">Part-time</SelectItem>
                <SelectItem value="contract">Contract</SelectItem>
                <SelectItem value="internship">Internship</SelectItem>
              </SelectContent>
            </Select>

            <Select value={workMode} onValueChange={setWorkMode}>
              <SelectTrigger className="w-36">
                <SelectValue placeholder="All Modes" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Modes</SelectItem>
                <SelectItem value="remote">Remote</SelectItem>
                <SelectItem value="onsite">Onsite</SelectItem>
                <SelectItem value="hybrid">Hybrid</SelectItem>
              </SelectContent>
            </Select>

            <Select value={experienceLevel} onValueChange={setExperienceLevel}>
              <SelectTrigger className="w-36">
                <SelectValue placeholder="All Levels" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                <SelectItem value="entry">Entry Level</SelectItem>
                <SelectItem value="mid">Mid Level</SelectItem>
                <SelectItem value="senior">Senior</SelectItem>
                <SelectItem value="lead">Lead</SelectItem>
                <SelectItem value="executive">Executive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      <p className="mb-4 text-sm text-muted-foreground">
        {jobs?.length ?? 0} jobs found
      </p>

      {!jobs ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="border-border/50 animate-pulse">
              <CardContent className="p-6">
                <div className="h-6 w-64 rounded bg-muted" />
                <div className="mt-3 h-4 w-48 rounded bg-muted" />
                <div className="mt-2 h-4 w-36 rounded bg-muted" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : jobs.length === 0 ? (
        <Card className="border-border/50">
          <CardContent className="py-16 text-center">
            <Briefcase className="mx-auto mb-4 h-12 w-12 text-muted-foreground/50" />
            <p className="font-medium">No jobs found</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Try adjusting your search or filters
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {jobs.map((job) => (
            <Link key={job._id} href={`/jobs/${job._id}`}>
              <Card className="group relative overflow-hidden border border-border/40 bg-background transition-all duration-200 hover:-translate-y-[2px] hover:border-border/80 hover:shadow-lg hover:shadow-black/[0.03]">
                <CardContent className="p-6">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    {/* Left: Company Logo & Details */}
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border border-border/50 bg-muted/30 font-bold text-foreground transition-colors group-hover:bg-foreground group-hover:text-background">
                        {job.companyName.charAt(0).toUpperCase()}
                      </div>
                      <div className="space-y-1.5">
                        <h3 className="text-lg font-semibold tracking-tight text-foreground transition-colors group-hover:text-primary">
                          {job.title}
                        </h3>
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
                          <span className="font-medium text-foreground/80">
                            {job.companyName}
                          </span>
                          <span className="hidden h-1 w-1 rounded-full bg-border sm:block" />
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3.5 w-3.5" />
                            {job.location}
                          </span>
                          <span className="hidden h-1 w-1 rounded-full bg-border sm:block" />
                          <span className="flex items-center gap-1">
                            <Clock className="h-3.5 w-3.5" />
                            {job.jobType}
                          </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-2 pt-2">
                          {job.skills.slice(0, 4).map((skill) => (
                            <Badge
                              key={skill}
                              variant="secondary"
                              className="bg-muted/40 font-medium text-muted-foreground transition-colors hover:text-foreground"
                            >
                              {skill}
                            </Badge>
                          ))}
                          {job.skills.length > 4 && (
                            <Badge variant="secondary" className="bg-muted/30 text-muted-foreground">
                              +{job.skills.length - 4}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Right: Salary & Tags */}
                    <div className="flex flex-row items-center justify-between border-t border-border/40 pt-4 sm:flex-col sm:items-end sm:border-0 sm:pt-0">
                      <div className="flex items-center gap-2 sm:mb-2 text-sm font-semibold text-foreground/90">
                        {job.salaryMin != null && job.salaryMax != null ? (
                          <>
                            <DollarSign className="h-4 w-4 text-muted-foreground" />
                            {job.salaryMin.toLocaleString()} - {job.salaryMax.toLocaleString()}
                          </>
                        ) : (
                          <span className="text-muted-foreground font-medium">Salary n/a</span>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Badge variant="outline" className="border-border/60 text-[10px] uppercase tracking-wider text-muted-foreground">
                          {job.workMode}
                        </Badge>
                        <Badge variant="outline" className="border-border/60 text-[10px] uppercase tracking-wider text-muted-foreground">
                          {job.experienceLevel}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
