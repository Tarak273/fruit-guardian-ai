import { motion } from "framer-motion";
import { 
  Apple, AlertTriangle, CheckCircle2, Pill, 
  ShieldCheck, Sparkles, Info, Beaker
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

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

interface AnalysisResultsProps {
  result: AnalysisResult;
}

const getSeverityClass = (severity: string) => {
  switch (severity.toLowerCase()) {
    case "healthy": return "severity-healthy";
    case "mild": return "severity-mild";
    case "moderate": return "severity-moderate";
    case "severe": return "severity-severe";
    default: return "severity-healthy";
  }
};

const getSeverityIcon = (severity: string) => {
  switch (severity.toLowerCase()) {
    case "healthy": return CheckCircle2;
    case "mild": return Info;
    case "moderate": return AlertTriangle;
    case "severe": return AlertTriangle;
    default: return CheckCircle2;
  }
};

const AnalysisResults = ({ result }: AnalysisResultsProps) => {
  if (result.error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl mx-auto"
      >
        <Card className="border-destructive/30 bg-destructive/5">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 text-destructive">
              <AlertTriangle className="w-5 h-5" />
              <p className="font-medium">{result.error}</p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  const SeverityIcon = getSeverityIcon(result.disease.severity);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-2xl mx-auto space-y-4"
    >
      {/* Main Result Card */}
      <Card className="overflow-hidden shadow-lg">
        <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5 pb-4">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                <Apple className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground font-medium">Detected Fruit</p>
                <CardTitle className="text-2xl font-serif">{result.fruitType}</CardTitle>
              </div>
            </div>
            <Badge className={`${getSeverityClass(result.disease.severity)} border px-3 py-1.5 text-sm font-semibold`}>
              <SeverityIcon className="w-4 h-4 mr-1.5" />
              {result.disease.severity}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="pt-6 space-y-6">
          {/* Disease Info */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              <h3 className="font-semibold text-lg">Diagnosis</h3>
              <span className="ml-auto text-sm text-muted-foreground">
                {result.disease.confidence}% confidence
              </span>
            </div>
            
            <div className="bg-muted/50 rounded-xl p-4">
              <p className="font-semibold text-foreground mb-2">{result.disease.name}</p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {result.disease.description}
              </p>
            </div>
          </div>

          {/* Additional Notes */}
          {result.additionalNotes && (
            <div className="bg-secondary/50 rounded-xl p-4 flex gap-3">
              <Info className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
              <p className="text-sm text-secondary-foreground">{result.additionalNotes}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Treatment Cards */}
      <div className="grid md:grid-cols-2 gap-4">
        {/* Immediate Actions */}
        {result.treatment.immediate.length > 0 && (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2 font-sans">
                  <Pill className="w-5 h-5 text-accent" />
                  Immediate Actions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {result.treatment.immediate.map((action, index) => (
                    <li key={index} className="flex gap-2 text-sm text-muted-foreground">
                      <span className="w-5 h-5 rounded-full bg-accent/10 text-accent flex items-center justify-center flex-shrink-0 text-xs font-bold">
                        {index + 1}
                      </span>
                      {action}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Prevention */}
        {result.treatment.prevention.length > 0 && (
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2 font-sans">
                  <ShieldCheck className="w-5 h-5 text-success" />
                  Prevention Tips
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {result.treatment.prevention.map((tip, index) => (
                    <li key={index} className="flex gap-2 text-sm text-muted-foreground">
                      <span className="w-5 h-5 rounded-full bg-success/10 text-success flex items-center justify-center flex-shrink-0 text-xs font-bold">
                        ✓
                      </span>
                      {tip}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>

      {/* Chemical Treatments */}
      {result.treatment.chemicals.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2 font-sans">
                <Beaker className="w-5 h-5 text-primary" />
                Recommended Treatments
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {result.treatment.chemicals.map((chemical, index) => (
                  <Badge key={index} variant="secondary" className="px-3 py-1.5">
                    {chemical}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </motion.div>
  );
};

export default AnalysisResults;
