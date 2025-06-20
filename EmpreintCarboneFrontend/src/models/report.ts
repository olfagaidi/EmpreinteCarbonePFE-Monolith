
export interface Report {
  id: string;
  date: string;
  title: string;
  description: string;
  author: string;
  data: any;
  status: "draft" | "published";
  carbonFootprint: any;
  content: string;
  pdfUrl: string;
}

export interface ReportExportOptions {
  format: "pdf" | "excel" | "csv";
  includeCharts: boolean;
  includeRawData: boolean;
}