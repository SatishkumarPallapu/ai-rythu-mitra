-- Fix security warning: Set search_path for function
DROP TRIGGER IF EXISTS trigger_generate_daily_tasks ON crop_plans;
DROP FUNCTION IF EXISTS generate_daily_tasks_for_crop();

CREATE OR REPLACE FUNCTION generate_daily_tasks_for_crop()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- This will be populated by AI service, trigger just ensures table is ready
  RETURN NEW;
END;
$$;

CREATE TRIGGER trigger_generate_daily_tasks
AFTER INSERT ON crop_plans
FOR EACH ROW
EXECUTE FUNCTION generate_daily_tasks_for_crop();