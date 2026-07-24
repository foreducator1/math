import { createClient } from "@supabase/supabase-js";

// 환경변수가 설정되지 않았을 경우 빌드 에러를 방지하기 위해 fallback URL을 제공합니다.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.startsWith("http") 
  ? process.env.NEXT_PUBLIC_SUPABASE_URL 
  : "https://placeholder.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-key";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
