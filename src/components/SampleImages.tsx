import { motion } from "framer-motion";

interface SampleImagesProps {
  onSelectSample: (url: string) => void;
  disabled: boolean;
}

const samples = [
  {
    url: "https://images.unsplash.com/photo-1568702846914-96b305d2uj85?w=400&q=80",
    label: "Apple",
    fallbackUrl: "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=400&q=80",
  },
  {
    url: "https://images.unsplash.com/photo-1587735243615-c03f25aaff15?w=400&q=80",
    label: "Orange",
    fallbackUrl: "https://images.unsplash.com/photo-1547514701-42782101795e?w=400&q=80",
  },
  {
    url: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400&q=80",
    label: "Banana",
    fallbackUrl: "https://images.unsplash.com/photo-1603833665858-e61d17a86224?w=400&q=80",
  },
  {
    url: "https://images.unsplash.com/photo-1601004890684-d8cbf643f5f2?w=400&q=80",
    label: "Strawberry",
    fallbackUrl: "https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=400&q=80",
  },
];

const SampleImages = ({ onSelectSample, disabled }: SampleImagesProps) => {
  const handleClick = async (sample: typeof samples[0]) => {
    if (disabled) return;
    
    // Fetch and convert to base64
    try {
      const response = await fetch(sample.fallbackUrl);
      const blob = await response.blob();
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        onSelectSample(base64);
      };
      reader.readAsDataURL(blob);
    } catch (error) {
      console.error("Failed to load sample image:", error);
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto">
      <p className="text-center text-sm text-muted-foreground mb-4">
        Or try with a sample image
      </p>
      
      <div className="flex justify-center gap-3 flex-wrap">
        {samples.map((sample, index) => (
          <motion.button
            key={sample.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => handleClick(sample)}
            disabled={disabled}
            className={`
              group relative w-20 h-20 rounded-xl overflow-hidden 
              border-2 border-border/50 transition-all duration-300
              ${disabled 
                ? "opacity-50 cursor-not-allowed" 
                : "hover:border-primary hover:scale-105 cursor-pointer hover:shadow-md"
              }
            `}
          >
            <img
              src={sample.fallbackUrl}
              alt={sample.label}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-1.5">
              <span className="text-xs font-medium text-background">{sample.label}</span>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default SampleImages;
