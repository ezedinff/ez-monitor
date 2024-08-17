-- Create users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create projects table
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),
  name TEXT NOT NULL,
  api_key UUID UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create reports table
CREATE TABLE reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES projects(id),
  app_name TEXT NOT NULL,
  endpoint TEXT NOT NULL,
  response_time FLOAT NOT NULL,
  status_code INTEGER NOT NULL,
  cpu_usage FLOAT NOT NULL,
  memory_usage FLOAT NOT NULL,
  custom_properties JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create function to get metrics
CREATE OR REPLACE FUNCTION get_metrics(p_project_id UUID, p_time_filter TEXT)
RETURNS TABLE (
  requests_count BIGINT,
  avg_response_time FLOAT,
  unique_visitors BIGINT,
  avg_cpu_usage FLOAT,
  avg_memory_usage FLOAT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    COUNT(*) AS requests_count,
    AVG(response_time) AS avg_response_time,
    COUNT(DISTINCT custom_properties->>'visitor_id') AS unique_visitors,
    AVG(cpu_usage) AS avg_cpu_usage,
    AVG(memory_usage) AS avg_memory_usage
  FROM reports
  WHERE project_id = p_project_id
    AND created_at >= (NOW() - p_time_filter::INTERVAL);
END;
$$ LANGUAGE plpgsql;