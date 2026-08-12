// Hand-written from the Pulse Supabase schema (clients/installations/readings/pulses).
// Regenerate with `supabase gen types typescript` once the Supabase CLI is linked
// to the real project, and this file can be replaced wholesale.

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
      clients: {
        Row: {
          id: string;
          name: string;
          contact_name: string | null;
          contact_email: string | null;
          contact_phone: string | null;
          status: string;
          onboarded_at: string | null;
          created_at: string;
          user_id: string | null;
        };
        Insert: Partial<Database["public"]["Tables"]["clients"]["Row"]> & {
          name: string;
        };
        Update: Partial<Database["public"]["Tables"]["clients"]["Row"]>;
        Relationships: [];
      };
      installations: {
        Row: {
          id: string;
          client_id: string;
          pulse_id: string;
          building: string | null;
          floor: string | null;
          location_key: string;
          premise_name: string | null;
          address_line: string | null;
          city: string | null;
          pincode: string | null;
          empty_mm: number;
          installed_by: string;
          installed_at: string;
          removed_by: string | null;
          removed_at: string | null;
          removal_reason: string | null;
        };
        Insert: Partial<Database["public"]["Tables"]["installations"]["Row"]> & {
          client_id: string;
          pulse_id: string;
          location_key: string;
          empty_mm: number;
          installed_by: string;
        };
        Update: Partial<Database["public"]["Tables"]["installations"]["Row"]>;
        Relationships: [];
      };
      readings: {
        Row: {
          id: number;
          pulse_id: string;
          seq: number;
          dist_mm: number | null;
          batt_mv: number | null;
          rssi: number | null;
          status: string | null;
          wake: string | null;
          fw_version: string | null;
          device_ts: string | null;
          server_ts: string;
          payload: Json;
        };
        Insert: Partial<Database["public"]["Tables"]["readings"]["Row"]> & {
          pulse_id: string;
          seq: number;
          payload: Json;
        };
        Update: Partial<Database["public"]["Tables"]["readings"]["Row"]>;
        Relationships: [];
      };
      pulses: {
        Row: {
          pulse_id: string;
          hw_rev: string;
          batch_id: string | null;
          iot_thing_name: string | null;
          label_serial: string | null;
          label_version: number;
          claimed_at: string | null;
          claimed_by: string | null;
          ble_key_version: number;
          state: string;
          fw_version: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["pulses"]["Row"]> & {
          pulse_id: string;
          hw_rev: string;
        };
        Update: Partial<Database["public"]["Tables"]["pulses"]["Row"]>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
