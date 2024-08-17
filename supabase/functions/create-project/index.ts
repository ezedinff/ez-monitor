import { serve } from "https://deno.land/std@0.177.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

serve(async (req) => {
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL'),
    Deno.env.get('SUPABASE_ANON_KEY')
  )

  const { name, user_id } = await req.json()

  const { data, error } = await supabase
    .from('projects')
    .insert({ name, user_id, api_key: crypto.randomUUID() })
    .select()

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { "Content-Type": "application/json" },
      status: 400,
    })
  }

  return new Response(JSON.stringify(data), {
    headers: { "Content-Type": "application/json" },
  })
})