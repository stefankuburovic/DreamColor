export interface GeneratedImage {
  id: string;
  url: string; // Base64 data URL
  type: 'cover' | 'page';
  prompt: string;
}

export interface BookSettings {
  childName: string;
  theme: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}

export enum GenerationStatus {
  IDLE = 'IDLE',
  GENERATING = 'GENERATING',
  COMPLETE = 'COMPLETE',
  ERROR = 'ERROR',
}