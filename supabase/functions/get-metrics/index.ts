import { serve } from "https://deno.land/std@0.177.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

serve(async (req) => {
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL'),
    Deno.env.get('SUPABASE_ANON_KEY')
  )

  const url = new URL(req.url)
  const project_id = url.searchParams.get('project_id')
  const timeframe = url.searchParams.get('timeframe') || 'day'

  if (!project_id) {
    return new Response(JSON.stringify({ error: 'Missing project_id' }), {
      headers: { "Content-Type": "application/json" },
      status: 400,
    })
  }

  let timeFilter
  switch (timeframe) {
    case 'minute':
      timeFilter = 'now() - interval \'1 minute\''
      break
    case 'hour':
      timeFilter = 'now() - interval \'1 hour\''
      break
    case 'day':
      timeFilter = 'now() - interval \'1 day\''
      break
    case 'week':
      timeFilter = 'now() - interval \'1 week\''
      break
    case 'month':
      timeFilter = 'now() - interval \'1 month\''
      break
    case 'year':
      timeFilter = 'now() - interval \'1 year\''
      break
    default:
      timeFilter = 'now() - interval \'1 day\''
  }

  const { data, error } = await supabase
    .rpc('get_metrics', { p_project_id: project_id, p_time_filter: timeFilter })

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