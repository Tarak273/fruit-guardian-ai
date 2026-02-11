import { motion } from "framer-motion";
import { 
  Apple, AlertTriangle, CheckCircle2, Pill, 
  ShieldCheck, Sparkles, Info, Beaker, XCircle,
  Utensils, Heart, TrendingDown, Bug, Microscope
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface AnalysisResult {
  fruitType: string;
  isHealthy: boolean;
  healthStatus?: "Excellent" | "Good" | "Fair" | "Poor" | "Critical";
  isEdible?: boolean;
  edibilityReason?: string;
  affectedPercentage?: number;
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

const getHealthStatusClass = (status: string) => {
  switch (status?.toLowerCase()) {
    case "excellent": return "bg-success text-success-foreground";
    case "good": return "bg-success/80 text-success-foreground";
    case "fair": return "bg-warning text-warning-foreground";
    case "poor": return "bg-accent text-accent-foreground";
    case "critical": return "bg-destructive text-destructive-foreground";
    default: return "bg-muted text-muted-foreground";
  }
};

const getAffectedColor = (percentage: number) => {
  if (percentage <= 10) return "bg-success";
  if (percentage <= 30) return "bg-warning";
  if (percentage <= 60) return "bg-accent";
  return "bg-destructive";
};

const stagger = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
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

  const isHealthy = result.disease.severity === "Healthy";

  return (
    <motion.div
      variants={stagger}
      initial="hidden"
      animate="visible"
      className="w-full max-w-2xl mx-auto space-y-4"
    >
      {/* ===== DISEASE NAME - HERO CARD ===== */}
      <motion.div variants={fadeUp}>
        <Card className={`overflow-hidden border-2 ${isHealthy ? 'border-success/40' : 'border-accent/40'} shadow-lg`}>
          <div className={`p-6 ${isHealthy ? 'bg-gradient-to-br from-success/10 via-success/5 to-transparent' : 'bg-gradient-to-br from-accent/10 via-accent/5 to-transparent'}`}>
            <div className="flex items-start gap-4">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                className={`w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0 ${isHealthy ? 'bg-success/20' : 'bg-accent/20'}`}
              >
                {isHealthy ? (
                  <CheckCircle2 className="w-8 h-8 text-success" />
                ) : (
                  <Bug className="w-8 h-8 text-accent" />
                )}
              </motion.div>

              <div className="flex-1 min-w-0">
                <p className="text-xs uppercase tracking-widest text-muted-foreground font-medium mb-1">
                  {isHealthy ? "Diagnosis Result" : "Disease Detected"}
                </p>
                <h2 className={`text-2xl md:text-3xl font-serif font-bold ${isHealthy ? 'text-success' : 'text-accent'} disease-glow`}>
                  {result.disease.name}
                </h2>
                <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                  {result.disease.description}
                </p>

                <div className="flex flex-wrap items-center gap-2 mt-3">
                  <Badge className={`${getSeverityClass(result.disease.severity)} border px-3 py-1 text-sm font-semibold`}>
                    {isHealthy ? <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> : <AlertTriangle className="w-3.5 h-3.5 mr-1" />}
                    {result.disease.severity}
                  </Badge>
                  <Badge variant="secondary" className="px-3 py-1 text-sm">
                    <Microscope className="w-3.5 h-3.5 mr-1" />
                    {result.disease.confidence}% confidence
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* ===== FRUIT TYPE + HEALTH + EDIBILITY ROW ===== */}
      <div className="grid grid-cols-3 gap-3">
        {/* Fruit Type */}
        <motion.div variants={fadeUp}>
          <Card className="h-full">
            <CardContent className="p-4 flex flex-col items-center text-center gap-2">
              <motion.div
                whileHover={{ rotate: 10, scale: 1.1 }}
                className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center"
              >
                <Apple className="w-6 h-6 text-primary" />
              </motion.div>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Fruit</p>
              <p className="text-base font-bold font-serif text-foreground leading-tight">{result.fruitType}</p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Health */}
        <motion.div variants={fadeUp}>
          <Card className={`h-full overflow-hidden ${result.isHealthy ? 'border-success/30' : 'border-destructive/30'}`}>
            <CardContent className="p-4 flex flex-col items-center text-center gap-2">
              <motion.div
                animate={result.isHealthy ? {} : { scale: [1, 1.1, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className={`w-12 h-12 rounded-xl flex items-center justify-center ${result.isHealthy ? 'bg-success/15' : 'bg-destructive/15'}`}
              >
                {result.isHealthy ? (
                  <Heart className="w-6 h-6 text-success" />
                ) : (
                  <AlertTriangle className="w-6 h-6 text-destructive" />
                )}
              </motion.div>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Health</p>
              <p className={`text-base font-bold ${result.isHealthy ? 'text-success' : 'text-destructive'}`}>
                {result.isHealthy ? "Healthy" : "Unhealthy"}
              </p>
              {result.healthStatus && (
                <Badge className={`text-[10px] ${getHealthStatusClass(result.healthStatus)}`}>
                  {result.healthStatus}
                </Badge>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Edibility */}
        <motion.div variants={fadeUp}>
          <Card className={`h-full overflow-hidden ${result.isEdible ? 'border-success/30' : 'border-destructive/30'}`}>
            <CardContent className="p-4 flex flex-col items-center text-center gap-2">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${result.isEdible ? 'bg-success/15' : 'bg-destructive/15'}`}>
                {result.isEdible ? (
                  <Utensils className="w-6 h-6 text-success" />
                ) : (
                  <XCircle className="w-6 h-6 text-destructive" />
                )}
              </div>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Edible</p>
              <p className={`text-base font-bold ${result.isEdible ? 'text-success' : 'text-destructive'}`}>
                {result.isEdible ? "Safe" : "No"}
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Edibility Reason */}
      {result.edibilityReason && (
        <motion.div variants={fadeUp}>
          <Card className={result.isEdible ? 'bg-success/5 border-success/30' : 'bg-destructive/5 border-destructive/30'}>
            <CardContent className="p-4 flex gap-3">
              <Info className={`w-5 h-5 flex-shrink-0 mt-0.5 ${result.isEdible ? 'text-success' : 'text-destructive'}`} />
              <p className="text-sm">{result.edibilityReason}</p>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Affected Percentage */}
      {result.affectedPercentage !== undefined && (
        <motion.div variants={fadeUp}>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <TrendingDown className="w-5 h-5 text-muted-foreground" />
                  <span className="font-semibold">Affected Area</span>
                </div>
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, delay: 0.3 }}
                  className={`text-2xl font-bold ${
                    result.affectedPercentage <= 10 ? 'text-success' :
                    result.affectedPercentage <= 30 ? 'text-warning' :
                    result.affectedPercentage <= 60 ? 'text-accent' : 'text-destructive'
                  }`}
                >
                  {result.affectedPercentage}%
                </motion.span>
              </div>
              <div className="h-3 bg-muted rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${result.affectedPercentage}%` }}
                  transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
                  className={`h-full rounded-full ${getAffectedColor(result.affectedPercentage)}`}
                />
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                {result.affectedPercentage <= 10 && "Minimal damage — excellent condition"}
                {result.affectedPercentage > 10 && result.affectedPercentage <= 30 && "Minor damage — still in good condition"}
                {result.affectedPercentage > 30 && result.affectedPercentage <= 60 && "Moderate damage — quality compromised"}
                {result.affectedPercentage > 60 && "Severe damage — significant deterioration"}
              </p>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Additional Notes */}
      {result.additionalNotes && (
        <motion.div variants={fadeUp}>
          <Card className="bg-secondary/50">
            <CardContent className="p-4 flex gap-3">
              <Info className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
              <p className="text-sm text-secondary-foreground">{result.additionalNotes}</p>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Treatment Cards */}
      <div className="grid md:grid-cols-2 gap-4">
        {result.treatment.immediate.length > 0 && (
          <motion.div variants={fadeUp}>
            <Card className="h-full hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2 font-sans">
                  <Pill className="w-5 h-5 text-accent" />
                  Immediate Actions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {result.treatment.immediate.map((action, index) => (
                    <motion.li
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + index * 0.1 }}
                      className="flex gap-2 text-sm text-muted-foreground"
                    >
                      <span className="w-5 h-5 rounded-full bg-accent/10 text-accent flex items-center justify-center flex-shrink-0 text-xs font-bold">
                        {index + 1}
                      </span>
                      {action}
                    </motion.li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {result.treatment.prevention.length > 0 && (
          <motion.div variants={fadeUp}>
            <Card className="h-full hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2 font-sans">
                  <ShieldCheck className="w-5 h-5 text-success" />
                  Prevention Tips
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {result.treatment.prevention.map((tip, index) => (
                    <motion.li
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.6 + index * 0.1 }}
                      className="flex gap-2 text-sm text-muted-foreground"
                    >
                      <span className="w-5 h-5 rounded-full bg-success/10 text-success flex items-center justify-center flex-shrink-0 text-xs font-bold">
                        ✓
                      </span>
                      {tip}
                    </motion.li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>

      {/* Chemical Treatments */}
      {result.treatment.chemicals.length > 0 && (
        <motion.div variants={fadeUp}>
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2 font-sans">
                <Beaker className="w-5 h-5 text-primary" />
                Recommended Treatments
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {result.treatment.chemicals.map((chemical, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.7 + index * 0.1 }}
                  >
                    <Badge variant="secondary" className="px-3 py-1.5 hover:bg-secondary/80 transition-colors">
                      {chemical}
                    </Badge>
                  </motion.div>
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
