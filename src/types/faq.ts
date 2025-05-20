
export interface Faq {
  id: number;
  questions: string;
  answer: string;
  created_at?: string;
  updated_at?: string;
}

export interface FaqsResponse {
  message: string;
  data: Faq[];
}

export interface FaqDetailResponse {
  message: string;
  data: Faq;
}
