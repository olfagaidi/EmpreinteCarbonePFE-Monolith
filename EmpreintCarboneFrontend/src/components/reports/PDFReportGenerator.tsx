
import React from 'react';
import { Button } from '@/components/ui/button';
import { FileText } from 'lucide-react';
import { toast } from '@/components/ui/sonner';

interface PDFReportGeneratorProps {
  variant?: 'default' | 'compact';
}

const PDFReportGenerator: React.FC<PDFReportGeneratorProps> = ({ variant = 'default' }) => {
  const handleGeneratePDF = () => {
    
    toast.success('Fonctionnalité PDF à implémenter');
  };

  return (
    <Button 
      onClick={handleGeneratePDF}
      variant={variant === 'compact' ? 'outline' : 'default'}
      size={variant === 'compact' ? 'sm' : 'default'}
    >
      <FileText className="w-4 h-4 mr-2" />
      {variant === 'compact' ? 'PDF' : 'Générer PDF'}
    </Button>
  );
};

export default PDFReportGenerator;