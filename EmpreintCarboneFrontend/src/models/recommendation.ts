export interface RecommendationItem {
    id?:string;
    category: string;
    description: string;
    potentialReduction: number;
    difficulty: 'Low' | 'Medium' | 'High';
    timeFrame: 'Short-term' | 'Medium-term' | 'Long-term';
  }