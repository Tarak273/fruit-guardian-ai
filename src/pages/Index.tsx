import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Leaf, Github } from "lucide-react";
import HeroSection from "@/components/HeroSection";
import ImageUploader from "@/components/ImageUploader";
import AnalysisResults from "@/components/AnalysisResults";
import SampleImages from "@/components/SampleImages";
import { Button } from "@/components/ui/button";

interface AnalysisResult {
  fruitType: string;
  isHealthy: boolean;
  disease: {
    name: string;
    severity: "Healthy" | "Mild" | "Moderate" | "Severe";
    confidence: number;
    description: string;
  };
  treatment: {
    immediate: string[];
    prevention: string[];
    chemicals: string[];
  };
  additionalNotes: string;
  error?: string;
}

const Index = () => {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);

  const analyzeImage = useCallback(async (base64Image: string) => {
    setIsAnalyzing(true);
    setResult(null);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/analyze-fruit`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({ imageBase64: base64Image }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        if (response.status === 429) {
          toast.error("Rate limit exceeded. Please wait a moment and try again.");
          return;
        }
        if (response.status === 402) {
          toast.error("Service temporarily unavailable. Please try again later.");
          return;
        }
        throw new Error(errorData.error || "Failed to analyze image");
      }

      const analysisResult = await response.json();
      
      if (analysisResult.error) {
        toast.error(analysisResult.error);
        setResult({ error: analysisResult.error } as AnalysisResult);
      } else {
        setResult(analysisResult);
        toast.success(`${analysisResult.fruitType} detected successfully!`);
      }
    } catch (error) {
      console.error("Analysis error:", error);
      toast.error(error instanceof Error ? error.message : "Failed to analyze image");
    } finally {
      setIsAnalyzing(false);
    }
  }, []);

  const handleImageUpload = useCallback((base64: string) => {
    setUploadedImage(base64);
    setResult(null);
    analyzeImage(base64);
  }, [analyzeImage]);

  const handleClear = useCallback(() => {
    setUploadedImage(null);
    setResult(null);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center">
              <Leaf className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-serif font-bold text-xl text-foreground">FruitGuard</span>
          </div>
          <Button variant="ghost" size="sm" className="text-muted-foreground" asChild>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer">
              <Github className="w-4 h-4 mr-2" />
              GitHub
            </a>
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <HeroSection />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="space-y-8">
          {/* Upload Area */}
          <ImageUploader
            onImageUpload={handleImageUpload}
            isAnalyzing={isAnalyzing}
            uploadedImage={uploadedImage}
            onClear={handleClear}
          />

          {/* Sample Images */}
          {!uploadedImage && (
            <SampleImages 
              onSelectSample={handleImageUpload} 
              disabled={isAnalyzing} 
            />
          )}

          {/* Analyze Button (if image uploaded but not analyzing) */}
          {uploadedImage && !isAnalyzing && !result && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-center"
            >
              <Button
                size="lg"
                onClick={() => analyzeImage(uploadedImage)}
                className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 shadow-accent"
              >
                Analyze Fruit
              </Button>
            </motion.div>
          )}

          {/* Results */}
          {result && <AnalysisResults result={result} />}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 bg-card/30 py-8 mt-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Leaf className="w-4 h-4" />
              <span className="text-sm">FruitGuard — AI-Powered Disease Detection</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Helping farmers, students, and researchers protect crops worldwide.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
