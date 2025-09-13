
export enum ItemType {
  TEXT = 'TEXT',
  IMAGE = 'IMAGE',
  CODE = 'CODE',
  LINK = 'LINK',
  EMAIL = 'EMAIL',
  PHONE = 'PHONE',
  COLOR = 'COLOR',
  FILE = 'FILE', // Placeholder for file metadata
}

export interface ClipboardItem {
  id: string;
  type: ItemType;
  content: string; // For text, code, links, etc. or base64 for images
  preview: string; // Truncated text or thumbnail data
  createdAt: number;
  tags: string[];
  metadata?: {
    language?: string; // For code
    ocrText?: string;
    translation?: string;
    fileName?: string;
    fileType?: string;
    isSensitive?: boolean;
  };
}

export type Tag = {
  name: string;
  count: number;
};

export type Template = {
  id: string;
  name: string;
  content: string;
};
