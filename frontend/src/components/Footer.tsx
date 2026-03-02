import { Link } from "react-router-dom";
import { Facebook, Instagram, Linkedin, Twitter } from "lucide-react";
import { motion } from "framer-motion";

const Footer = () => {
  return (
    <footer className="bg-[hsl(222_47%_11%)] text-[hsl(210_40%_98%)]">
      <div className="container py-14 md:py-16">
        <motion.div
          className="grid grid-cols-1 md:grid-cols-[1.5fr_1fr_1fr_1.5fr] gap-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div>
            <div className="flex items-center gap-2 font-bold text-xl mb-5">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                <span className="text-primary-foreground text-sm font-bold">Q</span>
              </div>
              QuickHire
            </div>
            <p className="text-sm opacity-60 leading-relaxed max-w-xs">
              Great platform for the job seeker that passionate about startups. Find your dream job easier.
            </p>
          </div>
          <div>
            <h4 className="font-bold mb-5 text-base">About</h4>
            <ul className="space-y-3 text-sm opacity-60">
              <li><Link to="/" className="hover:opacity-100 transition-opacity">Companies</Link></li>
              <li><Link to="/" className="hover:opacity-100 transition-opacity">Pricing</Link></li>
              <li><Link to="/" className="hover:opacity-100 transition-opacity">Terms</Link></li>
              <li><Link to="/" className="hover:opacity-100 transition-opacity">Advice</Link></li>
              <li><Link to="/" className="hover:opacity-100 transition-opacity">Privacy Policy</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-5 text-base">Resources</h4>
            <ul className="space-y-3 text-sm opacity-60">
              <li><Link to="/" className="hover:opacity-100 transition-opacity">Help Docs</Link></li>
              <li><Link to="/" className="hover:opacity-100 transition-opacity">Guide</Link></li>
              <li><Link to="/" className="hover:opacity-100 transition-opacity">Updates</Link></li>
              <li><Link to="/" className="hover:opacity-100 transition-opacity">Contact Us</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-5 text-base">Get job notifications</h4>
            <p className="text-sm opacity-60 mb-5 leading-relaxed">The latest job news, articles, sent to your inbox weekly.</p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Email Address"
                className="flex-1 px-4 py-3 rounded-md text-sm bg-[hsl(222_47%_16%)] border border-[hsl(222_20%_25%)] placeholder:opacity-40 focus:outline-none focus:ring-1 focus:ring-primary"
              />
              <button className="px-6 py-3 bg-primary text-primary-foreground text-sm font-semibold rounded-md hover:opacity-90 transition-opacity">
                Subscribe
              </button>
            </div>
          </div>
        </motion.div>
        <div className="border-t border-[hsl(222_20%_20%)] mt-12 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm opacity-40">2021 @ QuickHire. All rights reserved.</p>
          <div className="flex gap-3">
            {[Facebook, Instagram, Linkedin, Twitter].map((Icon, i) => (
              <div key={i} className="w-9 h-9 rounded-full border border-[hsl(222_20%_25%)] flex items-center justify-center opacity-50 hover:opacity-100 cursor-pointer transition-opacity">
                <Icon className="w-4 h-4" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
