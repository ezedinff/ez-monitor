import { serve } from "https://deno.land/std@0.177.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

serve(async (req) => {
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL'),
    Deno.env.get('SUPABASE_ANON_KEY')
  )

  const url = new URL(req.url)
  const project_id = url.searchParams.get('project_id')
  const start_date = url.searchParams.get('start_date')
  const end_date = url.searchParams.get('end_date')

  if (!project_id || !start_date || !end_date) {
    return new Response(JSON.stringify({ error: 'Missing required parameters' }), {
      headers: { "Content-Type": "application/json" },
      status: 400,
    })
  }

  const { data, error } = await supabase
    .from('reports')
    .select('*')
    .eq('project_id', project_id)
    .gte('created_at', start_date)
    .lte('created_at', end_date)

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