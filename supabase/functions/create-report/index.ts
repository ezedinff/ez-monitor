import { serve } from "https://deno.land/std@0.177.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

serve(async (req) => {
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL'),
    Deno.env.get('SUPABASE_ANON_KEY')
  )

  const { api_key, ...reportData } = await req.json()

  const { data: project, error: projectError } = await supabase
    .from('projects')
    .select('id')
    .eq('api_key', api_key)
    .single()

  if (projectError) {
    return new Response(JSON.stringify({ error: 'Invalid API key' }), {
      headers: { "Content-Type": "application/json" },
      status: 401,
    })
  }

  const { data, error } = await supabase
    .from('reports')
    .insert({ ...reportData, project_id: project.id })

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { "Content-Type": "application/json" },
      status: 400,
    })
  }

  return new Response(JSON.stringify({ success: true }), {
    headers: { "Content-Type": "application/json" },
  })
})