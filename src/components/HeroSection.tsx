import { motion } from "framer-motion";
import { Leaf, Scan, Shield } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-secondary/50 to-background pt-12 pb-8">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -right-20 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute top-40 -left-20 w-72 h-72 bg-accent/10 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-4xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Leaf className="w-4 h-4" />
            AI-Powered Agricultural Technology
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-foreground mb-6 leading-tight">
            Detect Fruit Diseases
            <span className="block text-primary mt-2">Before It's Too Late</span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 font-sans">
            Upload a photo of your fruit and get instant AI-powered analysis. Identify diseases, 
            assess severity, and receive treatment recommendations in seconds.
          </p>

          {/* Feature pills */}
          <div className="flex flex-wrap justify-center gap-4">
            {[
              { icon: Scan, text: "Surface & Internal Analysis" },
              { icon: Shield, text: "High Accuracy Detection" },
              { icon: Leaf, text: "Treatment Recommendations" },
            ].map((feature, index) => (
              <motion.div
                key={feature.text}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2 + index * 0.1 }}
                className="flex items-center gap-2 bg-card px-4 py-2.5 rounded-full shadow-sm border border-border/50"
              >
                <feature.icon className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-foreground">{feature.text}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
