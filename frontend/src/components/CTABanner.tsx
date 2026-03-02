import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const CTABanner = () => {
  return (
    <section className="bg-background py-10 md:py-14 overflow-hidden">
      <div className="container">
        <div className="relative isolate overflow-hidden rounded-[28px] bg-primary min-h-[360px]">
          <div className="absolute inset-y-0 left-0 w-24 bg-primary [clip-path:polygon(0_14%,100%_0,100%_100%,0_100%)]" />
          <div className="absolute inset-y-0 right-0 w-28 bg-primary [clip-path:polygon(0_0,100%_0,100%_86%,0_100%)]" />
          <div className="absolute -top-28 -right-16 h-72 w-72 rounded-full bg-white/10 blur-2xl" />
          <div className="grid md:grid-cols-2 gap-0 items-center min-h-[360px] px-8 md:px-16">
          <motion.div
            className="py-14 md:py-20 relative z-10"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-[62px] font-bold text-primary-foreground leading-[1.05] mb-4">
              Start posting<br />jobs today
            </h2>
            <p className="text-primary-foreground/85 mb-8 text-xl">
              Start posting jobs for only $10.
            </p>
            <Link to="/admin">
              <Button
                variant="outline"
                className="bg-white text-primary border-white hover:bg-white/90 font-semibold px-10 h-14 text-xl rounded-none"
              >
                Sign Up For Free
              </Button>
            </Link>
          </motion.div>

          <motion.div
            className="hidden md:flex justify-end items-end h-full relative z-10"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <div className="bg-background rounded-t-xl shadow-2xl w-full max-w-[560px] overflow-hidden border border-white/40">
              <div className="p-4 border-b border-border bg-secondary/50">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                    <span className="text-primary-foreground text-xs font-bold">Q</span>
                  </div>
                  <span className="text-sm font-semibold text-foreground">QuickHire</span>
                  <div className="ml-auto flex gap-2">
                    <div className="h-3 w-3 rounded-full bg-accent/40" />
                    <div className="h-3 w-3 rounded-full bg-primary/40" />
                  </div>
                </div>
              </div>
              <div className="p-4 space-y-3">
                <p className="text-xs font-semibold text-foreground">Good morning, Maria</p>
                <div className="grid grid-cols-3 gap-2">
                  <div className="bg-primary text-primary-foreground rounded-lg p-2 text-center">
                    <span className="text-lg font-bold text-primary-foreground">76</span>
                    <p className="text-[10px] text-primary-foreground/80">Candidates</p>
                  </div>
                  <div className="bg-accent/20 rounded-lg p-2 text-center">
                    <span className="text-lg font-bold text-foreground">3</span>
                    <p className="text-[10px] text-muted-foreground">Schedule</p>
                  </div>
                  <div className="bg-blue-100 rounded-lg p-2 text-center">
                    <span className="text-lg font-bold text-foreground">24</span>
                    <p className="text-[10px] text-muted-foreground">Messages</p>
                  </div>
                </div>
                <div className="flex items-end gap-1.5 h-16 pt-2">
                  {[40, 55, 35, 65, 50, 70, 45].map((h, i) => (
                    <div key={i} className="flex-1 flex flex-col gap-0.5">
                      <div className="bg-primary/60 rounded-t" style={{ height: `${h * 0.5}px` }} />
                      <div className="bg-accent/40 rounded-b" style={{ height: `${(80 - h) * 0.3}px` }} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
        </div>
      </div>
    </section>
  );
};

export default CTABanner;
