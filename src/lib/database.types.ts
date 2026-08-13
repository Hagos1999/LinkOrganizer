export type LinkStatus = "active" | "done";

export type Database = {
  public: {
    Tables: {
      niches: {
        Row: {
          id: string;
          name: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      links: {
        Row: {
          id: string;
          niche_id: string;
          title: string;
          url: string;
          notes: string | null;
          status: LinkStatus;
          created_at: string;
        };
        Insert: {
          id?: string;
          niche_id: string;
          title: string;
          url: string;
          notes?: string | null;
          status?: LinkStatus;
          created_at?: string;
        };
        Update: {
          id?: string;
          niche_id?: string;
          title?: string;
          url?: string;
          notes?: string | null;
          status?: LinkStatus;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "links_niche_id_fkey";
            columns: ["niche_id"];
            isOneToOne: false;
            referencedRelation: "niches";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

export type Niche = Database["public"]["Tables"]["niches"]["Row"];
export type Link = Database["public"]["Tables"]["links"]["Row"];
