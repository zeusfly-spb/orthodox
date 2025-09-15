export interface Entity {
  id: number | string;
  title: string;
  description: string;
  email: string;
  phone: string;
  json_attributes: string[];
  seats?: number;
  entityType: {
    id: number;
    slug: string;
    title: string;
  };
  location: {
    type: string;
    coordinates: number[];
  };
  requisite: {
    title: string;
    type: string;
  };
  parameters: {
    entityType: number;
  };
  created_at: string;
  updated_at: string;
}
