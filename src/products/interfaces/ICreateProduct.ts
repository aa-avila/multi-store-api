export interface ICreateProduct {
  name: string;
  description: string;
  images: string[];
  display: boolean;
  category?: string;
}
