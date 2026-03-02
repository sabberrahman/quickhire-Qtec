import { motion } from "framer-motion";

const companies = [
  { name: "vodafone", display: "vodafone", prefix: "◑ " },
  { name: "intel", display: "intel." },
  { name: "tesla", display: "T E S L A" },
  { name: "amd", display: "AMD▎" },
  { name: "talkit", display: "Talkit" },
];

const CompanyLogos = () => {
  return (
    <section className="border-y border-border bg-background">
      <div className="container py-10">
        <p className="text-sm text-muted-foreground mb-8">Companies we helped grow</p>
        <motion.div
          className="flex flex-wrap items-center justify-between gap-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          {companies.map((company, i) => (
            <motion.span
              key={company.name}
              className="text-2xl md:text-3xl font-bold text-muted-foreground/40 tracking-wider select-none"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.4 }}
            >
              {company.prefix && <span>{company.prefix}</span>}
              {company.display}
            </motion.span>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default CompanyLogos;
