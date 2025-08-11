export interface File {
  id: number;
  filename: string;
  original_name: string;
  mime_type: string;
  path: string;
  disk: string;
  size: number;
  collection: string;
  json_attributes: any[];
  order_column: number;
  uploadable_type: string;
  uploadable_id: number;
  created_at: string; // или Date, если будет преобразовываться
  updated_at: string; // или Date, если будет преобразовываться
}