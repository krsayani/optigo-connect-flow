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
      workspace_accounts: {
        Row: {
          username: string;
          email: string | null;
          password_salt: string;
          password_hash: string;
          display_name: string;
          created_at: string;
        };
        Insert: {
          username: string;
          email?: string | null;
          password_salt: string;
          password_hash: string;
          display_name?: string;
          created_at?: string;
        };
        Update: {
          username?: string;
          email?: string | null;
          password_salt?: string;
          password_hash?: string;
          display_name?: string;
          created_at?: string;
        };
        Relationships: [];
      };
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
