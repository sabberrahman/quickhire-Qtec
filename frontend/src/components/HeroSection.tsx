import { Search, MapPin, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import heroPerson from "@/assets/header-person.png";
import heroPattern from "@/assets/header-pattern.png";

const HeroSection = () => {
  const [query, setQuery] = useState("");
  const [location, setLocation] = useState("");
  const navigate = useNavigate();

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (query) params.set("q", query);
    if (location) params.set("location", location);
    navigate(`/jobs?${params.toString()}`);
  };

  return (
    <section className="bg-background overflow-hidden">
      <div className="container py-16 md:py-24">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <h1 className="text-4xl md:text-5xl lg:text-[56px] font-bold leading-[1.15] mb-2">
              Discover<br />more than<br />
              <span className="text-primary relative inline-block">
                5000+ Jobs
                <svg className="absolute -bottom-3 left-0 w-full" viewBox="0 0 280 14" fill="none">
                  <path d="M2 10C20 4 60 2 140 6C220 10 260 6 278 4" stroke="hsl(195 100% 60%)" strokeWidth="3" strokeLinecap="round" />
                  <path d="M2 12C40 4 100 2 160 8C220 12 260 8 278 6" stroke="hsl(195 100% 60%)" strokeWidth="2.5" strokeLinecap="round" />
                  <path d="M10 8C50 2 120 4 180 6C240 8 268 4 278 2" stroke="hsl(195 100% 60%)" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </span>
            </h1>
            <p className="text-muted-foreground mt-8 mb-10 max-w-md leading-relaxed text-base">
              Great platform for the job seeker that searching for new career heights and passionate about startups.
            </p>

            {/* Search Bar - underline style matching design */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-[1fr_1fr_auto] items-end gap-4 bg-background p-4 rounded-lg shadow-lg border border-border/50"
            >
              <div className="flex items-center gap-3 border-b border-border pb-2 w-full min-w-0">
                <Search className="w-5 h-5 text-muted-foreground shrink-0" />
                <input
                  type="text"
                  placeholder="Job title or keyword"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="bg-transparent border-none outline-none text-sm flex-1 placeholder:text-muted-foreground/60"
                />
              </div>
              <div className="flex items-center gap-3 border-b border-border pb-2 w-full min-w-0">
                <MapPin className="w-5 h-5 text-muted-foreground shrink-0" />
                <input
                  type="text"
                  placeholder="Florence, Italy"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="bg-transparent border-none outline-none text-sm flex-1 placeholder:text-muted-foreground/60"
                />
                <ChevronDown className="w-4 h-4 text-muted-foreground" />
              </div>
              <Button onClick={handleSearch} className="w-full md:w-auto shrink-0 px-8 h-12 text-sm font-semibold">
                Search my job
              </Button>
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="text-sm text-muted-foreground mt-5"
            >
              Popular : <span className="font-medium text-foreground">UI Designer, UX Researcher, Android, Admin</span>
            </motion.p>
          </motion.div>

          {/* Hero image with pattern */}
          <motion.div
            className="hidden md:flex justify-end relative"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.2 }}
          >
            <img
              src={heroPattern}
              alt=""
              className="absolute top-0 right-0 w-full h-full object-contain opacity-60 pointer-events-none"
            />
            <img
              src={heroPerson}
              alt="Job seeker"
              className="relative z-10 w-full max-w-lg object-contain"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
