export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      lens_config_state: {
        Row: {
          organization_id: string;
          payload: Json;
          updated_at: string;
          updated_by: string | null;
        };
        Insert: {
          organization_id: string;
          payload: Json;
          updated_at?: string;
          updated_by?: string | null;
        };
        Update: {
          organization_id?: string;
          payload?: Json;
          updated_at?: string;
          updated_by?: string | null;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
