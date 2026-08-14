export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      passengers: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          default_daily_rate: number;
          active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          default_daily_rate: number;
          active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          default_daily_rate?: number;
          active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      rides: {
        Row: {
          id: string;
          user_id: string;
          passenger_id: string;
          ride_date: string;
          rate_charged: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          passenger_id: string;
          ride_date: string;
          rate_charged: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          passenger_id?: string;
          ride_date?: string;
          rate_charged?: number;
          created_at?: string;
        };
      };
      monthly_charges: {
        Row: {
          id: string;
          user_id: string;
          passenger_id: string;
          reference_month: string;
          total_amount: number;
          paid: boolean;
          paid_amount: number;
          paid_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          passenger_id: string;
          reference_month: string;
          total_amount: number;
          paid?: boolean;
          paid_amount?: number;
          paid_at?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          passenger_id?: string;
          reference_month?: string;
          total_amount?: number;
          paid?: boolean;
          paid_amount?: number;
          paid_at?: string | null;
          created_at?: string;
        };
      };
    };
  };
}
