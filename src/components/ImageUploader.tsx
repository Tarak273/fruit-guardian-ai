import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, X, Image as ImageIcon, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ImageUploaderProps {
  onImageUpload: (base64: string) => void;
  isAnalyzing: boolean;
  uploadedImage: string | null;
  onClear: () => void;
}

const ImageUploader = ({ onImageUpload, isAnalyzing, uploadedImage, onClear }: ImageUploaderProps) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = useCallback((file: File) => {
    if (!file.type.startsWith("image/")) {
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      onImageUpload(base64);
    };
    reader.readAsDataURL(file);
  }, [onImageUpload]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  }, [handleFile]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className="w-full max-w-xl mx-auto"
    >
      <AnimatePresence mode="wait">
        {uploadedImage ? (
          <motion.div
            key="preview"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative rounded-2xl overflow-hidden bg-card shadow-lg border border-border"
          >
            <img
              src={uploadedImage}
              alt="Uploaded fruit"
              className="w-full h-80 object-cover"
            />
            
            {/* Scanning overlay */}
            {isAnalyzing && (
              <div className="absolute inset-0 bg-foreground/20 backdrop-blur-sm flex items-center justify-center">
                <div className="absolute inset-0 overflow-hidden">
                  <div className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent scan-line" />
                </div>
                <div className="bg-card/90 backdrop-blur-md px-6 py-4 rounded-xl shadow-lg flex items-center gap-3">
                  <Loader2 className="w-5 h-5 text-primary animate-spin" />
                  <span className="font-medium text-foreground">Analyzing fruit...</span>
                </div>
              </div>
            )}

            {/* Clear button */}
            {!isAnalyzing && (
              <Button
                variant="secondary"
                size="icon"
                className="absolute top-3 right-3 rounded-full bg-card/90 backdrop-blur-sm shadow-md hover:bg-card"
                onClick={onClear}
              >
                <X className="w-4 h-4" />
              </Button>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="upload"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={`upload-zone cursor-pointer ${isDragging ? "dragging" : ""}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => document.getElementById("file-input")?.click()}
          >
            <input
              id="file-input"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleInputChange}
            />

            <div className="flex flex-col items-center gap-4 py-8">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center pulse-glow">
                <Upload className="w-8 h-8 text-primary" />
              </div>

              <div className="text-center">
                <p className="text-lg font-semibold text-foreground mb-1">
                  Drop your fruit image here
                </p>
                <p className="text-sm text-muted-foreground">
                  or click to browse from your device
                </p>
              </div>

              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <ImageIcon className="w-3.5 h-3.5" />
                <span>Supports JPG, PNG, WebP • Max 10MB</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ImageUploader;
