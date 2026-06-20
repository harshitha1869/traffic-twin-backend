"use client";

import jsPDF from "jspdf";
import { Button } from "@/components/ui/button";

export default function ExportPdfButton() {
  const exportReport = () => {
    const doc = new jsPDF();

    // Title
    doc.setFontSize(22);
    doc.text("TrafficTwin AI Command Center", 20, 20);

    doc.setFontSize(14);
    doc.text("Executive Traffic Intelligence Report", 20, 30);

    // Line
    doc.line(20, 35, 190, 35);

    // KPI Section
    doc.setFontSize(16);
    doc.text("Key Metrics", 20, 50);

    doc.setFontSize(12);
    doc.text("Total Traffic Events: 2,847", 25, 65);
    doc.text("Predicted High Risk Events: 164", 25, 75);
    doc.text("Road Closure Probability: 37%", 25, 85);
    doc.text("Average Resolution Time: 42 mins", 25, 95);
    doc.text("Active Hotspots: 28", 25, 105);

    // Model Section
    doc.setFontSize(16);
    doc.text("Model Performance", 20, 125);

    doc.setFontSize(12);
    doc.text("Accuracy: 87.7%", 25, 140);
    doc.text("AUC Score: 0.80", 25, 150);
    doc.text("Algorithm: XGBoost Classifier", 25, 160);

    // Recommendations
    doc.setFontSize(16);
    doc.text("AI Recommendations", 20, 180);

    doc.setFontSize(12);
    doc.text("• Deploy additional officers near MG Road", 25, 195);
    doc.text("• Monitor Silk Board Junction", 25, 205);
    doc.text("• Prepare alternate routes during peak hours", 25, 215);

    doc.save("TrafficTwin_Report.pdf");
  };

  return (
    <Button onClick={exportReport}>
      Export Snapshot
    </Button>
  );
}