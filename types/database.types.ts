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
          view_count: number;
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
          view_count?: number;
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
          view_count?: number;
          created_at?: string;
        };
      };
      post_views: {
        Row: {
          id: string;
          post_id: string;
          viewer_ip: string | null;
          user_id: string | null;
          viewed_at: string;
        };
        Insert: {
          id?: string;
          post_id: string;
          viewer_ip?: string | null;
          user_id?: string | null;
          viewed_at?: string;
        };
        Update: {
          id?: string;
          post_id?: string;
          viewer_ip?: string | null;
          user_id?: string | null;
          viewed_at?: string;
        };
      };
      favorites: {
        Row: {
          id: string;
          user_id: string;
          post_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          post_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          post_id?: string;
          created_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      increment_view_count: {
        Args: { post_id: string };
        Returns: void;
      };
      get_trending_posts: {
        Args: { limit_count?: number };
        Returns: {
          id: string;
          seller_id: string;
          instagram_url: string;
          title: string;
          price: number | null;
          deadline: string | null;
          status: "open" | "closed" | "upcoming";
          view_count: number;
          created_at: string;
          trending_score: number;
        }[];
      };
    };
    Enums: {
      post_status: "open" | "closed" | "upcoming";
    };
  };
};

// 편의용 타입
export type Seller = Database["public"]["Tables"]["sellers"]["Row"];
export type GongguPost = Database["public"]["Tables"]["gonggu_posts"]["Row"];
export type PostView = Database["public"]["Tables"]["post_views"]["Row"];
export type Favorite = Database["public"]["Tables"]["favorites"]["Row"];
export type NewSeller = Database["public"]["Tables"]["sellers"]["Insert"];
export type NewGongguPost = Database["public"]["Tables"]["gonggu_posts"]["Insert"];
export type NewPostView = Database["public"]["Tables"]["post_views"]["Insert"];
