import type { Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";

export interface SignInInput {
  email: string;
  password: string;
}

export async function signInWithPassword(input: SignInInput): Promise<void> {
  const { error } = await supabase.auth.signInWithPassword(input);

  if (error) {
    throw new Error("E-mail ou senha inválidos.");
  }
}

export async function signOut(): Promise<void> {
  await supabase.auth.signOut();
}

export async function getSession(): Promise<Session | null> {
  const { data } = await supabase.auth.getSession();
  return data.session;
}
