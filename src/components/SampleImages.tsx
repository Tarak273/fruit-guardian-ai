import { motion } from "framer-motion";

interface SampleImagesProps {
  onSelectSample: (url: string) => void;
  disabled: boolean;
}

const samples = [
  {
    url: "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=400&q=80",
    label: "Apple",
    emoji: "🍎",
  },
  {
    url: "https://images.unsplash.com/photo-1547514701-42782101795e?w=400&q=80",
    label: "Orange",
    emoji: "🍊",
  },
  {
    url: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400&q=80",
    label: "Banana",
    emoji: "🍌",
  },
  {
    url: "https://images.unsplash.com/photo-1601004890684-d8cbf643f5f2?w=400&q=80",
    label: "Strawberry",
    emoji: "🍓",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.8 },
  visible: { opacity: 1, y: 0, scale: 1 },
};

const SampleImages = ({ onSelectSample, disabled }: SampleImagesProps) => {
  const handleClick = async (sample: typeof samples[0]) => {
    if (disabled) return;
    try {
      const response = await fetch(sample.url);
      const blob = await response.blob();
      const reader = new FileReader();
      reader.onloadend = () => onSelectSample(reader.result as string);
      reader.readAsDataURL(blob);
    } catch (error) {
      console.error("Failed to load sample image:", error);
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="w-full max-w-xl mx-auto"
    >
      <p className="text-center text-sm text-muted-foreground mb-4">
        Or try with a sample image
      </p>
      
      <div className="flex justify-center gap-4 flex-wrap">
        {samples.map((sample) => (
          <motion.button
            key={sample.label}
            variants={itemVariants}
            onClick={() => handleClick(sample)}
            disabled={disabled}
            whileHover={{ scale: 1.1, y: -4 }}
            whileTap={{ scale: 0.95 }}
            className={`
              group relative w-20 h-20 rounded-2xl overflow-hidden 
              border-2 border-border/50 transition-all duration-300 shadow-sm
              ${disabled 
                ? "opacity-50 cursor-not-allowed" 
                : "hover:border-primary hover:shadow-md cursor-pointer"
              }
            `}
          >
            <img
              src={sample.url}
              alt={sample.label}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-foreground/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col items-center justify-end pb-1.5">
              <span className="text-lg leading-none">{sample.emoji}</span>
              <span className="text-[10px] font-medium text-background">{sample.label}</span>
            </div>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
};

export default SampleImages;
