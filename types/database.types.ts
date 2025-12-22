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
      sellers: {
        Row: {
          id: string;
          instagram_username: string;
          profile_url: string | null;
          category: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          instagram_username: string;
          profile_url?: string | null;
          category?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          instagram_username?: string;
          profile_url?: string | null;
          category?: string | null;
          created_at?: string;
        };
      };
      gonggu_posts: {
        Row: {
          id: string;
          seller_id: string;
          instagram_url: string;
          title: string;
          price: number | null;
          deadline: string | null;
          status: "open" | "closed" | "upcoming";
          created_at: string;
        };
        Insert: {
          id?: string;
          seller_id: string;
          instagram_url: string;
          title: string;
          price?: number | null;
          deadline?: string | null;
          status?: "open" | "closed" | "upcoming";
          created_at?: string;
        };
        Update: {
          id?: string;
          seller_id?: string;
          instagram_url?: string;
          title?: string;
          price?: number | null;
          deadline?: string | null;
          status?: "open" | "closed" | "upcoming";
          created_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      post_status: "open" | "closed" | "upcoming";
    };
  };
};

// 편의용 타입
export type Seller = Database["public"]["Tables"]["sellers"]["Row"];
export type GongguPost = Database["public"]["Tables"]["gonggu_posts"]["Row"];
export type NewSeller = Database["public"]["Tables"]["sellers"]["Insert"];
export type NewGongguPost = Database["public"]["Tables"]["gonggu_posts"]["Insert"];
