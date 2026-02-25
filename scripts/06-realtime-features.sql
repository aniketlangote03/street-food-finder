-- Add real-time tracking columns to stalls table
ALTER TABLE public.stalls 
ADD COLUMN IF NOT EXISTS queue_length INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS estimated_wait INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS last_order_time TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS busy_level TEXT DEFAULT 'low' CHECK (busy_level IN ('low', 'medium', 'high'));

-- Create stall analytics table for real-time data
CREATE TABLE IF NOT EXISTS public.stall_analytics (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  stall_id UUID REFERENCES public.stalls(id) ON DELETE CASCADE NOT NULL,
  current_queue INTEGER DEFAULT 0,
  estimated_wait INTEGER DEFAULT 0,
  peak_hours TEXT[] DEFAULT '{}',
  busy_level TEXT DEFAULT 'low' CHECK (busy_level IN ('low', 'medium', 'high')),
  hourly_visitors JSONB DEFAULT '{}',
  daily_stats JSONB DEFAULT '{}',
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(stall_id)
);

-- Create live orders table for tracking real-time activity
CREATE TABLE IF NOT EXISTS public.live_orders (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  stall_id UUID REFERENCES public.stalls(id) ON DELETE CASCADE NOT NULL,
  customer_name TEXT,
  order_items JSONB NOT NULL,
  total_amount DECIMAL(10, 2) NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'preparing', 'ready', 'completed', 'cancelled')),
  estimated_ready_time TIMESTAMP WITH TIME ZONE,
  queue_position INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create notifications table for real-time alerts
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  stall_id UUID REFERENCES public.stalls(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('stall_opened', 'stall_closed', 'queue_update', 'new_menu_item', 'price_change')),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  data JSONB DEFAULT '{}',
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for real-time queries
CREATE INDEX IF NOT EXISTS idx_stall_analytics_stall_id ON public.stall_analytics(stall_id);
CREATE INDEX IF NOT EXISTS idx_stall_analytics_last_updated ON public.stall_analytics(last_updated);
CREATE INDEX IF NOT EXISTS idx_live_orders_stall_id ON public.live_orders(stall_id);
CREATE INDEX IF NOT EXISTS idx_live_orders_status ON public.live_orders(status);
CREATE INDEX IF NOT EXISTS idx_live_orders_created_at ON public.live_orders(created_at);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON public.notifications(read);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON public.notifications(created_at);

-- Function to update stall analytics
CREATE OR REPLACE FUNCTION update_stall_analytics()
RETURNS TRIGGER AS $$
BEGIN
  -- Update analytics when stall status changes
  IF TG_OP = 'UPDATE' AND OLD.is_open != NEW.is_open THEN
    INSERT INTO public.stall_analytics (stall_id, last_updated)
    VALUES (NEW.id, NOW())
    ON CONFLICT (stall_id) 
    DO UPDATE SET last_updated = NOW();
    
    -- Create notification for stall status change
    INSERT INTO public.notifications (stall_id, type, title, message, data)
    VALUES (
      NEW.id,
      CASE WHEN NEW.is_open THEN 'stall_opened' ELSE 'stall_closed' END,
      CASE WHEN NEW.is_open THEN 'Stall is now open!' ELSE 'Stall is now closed' END,
      CASE WHEN NEW.is_open THEN NEW.name || ' is now serving customers' ELSE NEW.name || ' has closed for now' END,
      json_build_object('stall_id', NEW.id, 'stall_name', NEW.name, 'is_open', NEW.is_open)
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for stall analytics updates
DROP TRIGGER IF EXISTS trigger_update_stall_analytics ON public.stalls;
CREATE TRIGGER trigger_update_stall_analytics
  AFTER UPDATE ON public.stalls
  FOR EACH ROW
  EXECUTE FUNCTION update_stall_analytics();

-- Function to calculate queue metrics
CREATE OR REPLACE FUNCTION calculate_queue_metrics(stall_uuid UUID)
RETURNS TABLE (
  current_queue INTEGER,
  estimated_wait INTEGER,
  busy_level TEXT
) AS $$
DECLARE
  queue_count INTEGER;
  avg_prep_time INTEGER;
  current_hour INTEGER;
BEGIN
  -- Get current queue count
  SELECT COUNT(*) INTO queue_count
  FROM public.live_orders
  WHERE stall_id = stall_uuid AND status IN ('pending', 'preparing');
  
  -- Calculate average preparation time (in minutes)
  SELECT COALESCE(AVG(EXTRACT(EPOCH FROM (updated_at - created_at))/60), 5)::INTEGER
  INTO avg_prep_time
  FROM public.live_orders
  WHERE stall_id = stall_uuid 
    AND status = 'completed' 
    AND created_at > NOW() - INTERVAL '7 days';
  
  -- Determine busy level
  current_hour := EXTRACT(HOUR FROM NOW());
  
  RETURN QUERY
  SELECT 
    queue_count as current_queue,
    (queue_count * avg_prep_time)::INTEGER as estimated_wait,
    CASE 
      WHEN queue_count <= 3 THEN 'low'::TEXT
      WHEN queue_count <= 8 THEN 'medium'::TEXT
      ELSE 'high'::TEXT
    END as busy_level;
END;
$$ LANGUAGE plpgsql;

-- Insert sample analytics data ONLY for existing approved stalls
INSERT INTO public.stall_analytics (stall_id, current_queue, estimated_wait, peak_hours, busy_level, hourly_visitors) 
SELECT 
  s.id,
  CASE 
    WHEN s.name ILIKE '%noodle%' THEN 5
    WHEN s.name ILIKE '%bbq%' THEN 2
    ELSE 3
  END as current_queue,
  CASE 
    WHEN s.name ILIKE '%noodle%' THEN 15
    WHEN s.name ILIKE '%bbq%' THEN 8
    ELSE 12
  END as estimated_wait,
  CASE 
    WHEN s.name ILIKE '%noodle%' THEN '{"12:00-13:00", "18:00-19:00"}'::TEXT[]
    WHEN s.name ILIKE '%bbq%' THEN '{"11:30-12:30", "17:30-18:30"}'::TEXT[]
    ELSE '{"12:30-13:30", "19:00-20:00"}'::TEXT[]
  END as peak_hours,
  CASE 
    WHEN s.name ILIKE '%noodle%' THEN 'medium'
    WHEN s.name ILIKE '%bbq%' THEN 'low'
    ELSE 'high'
  END as busy_level,
  CASE 
    WHEN s.name ILIKE '%noodle%' THEN '{"12": 25, "13": 30, "18": 35, "19": 28}'::JSONB
    WHEN s.name ILIKE '%bbq%' THEN '{"11": 15, "12": 20, "17": 22, "18": 18}'::JSONB
    ELSE '{"12": 18, "13": 25, "19": 32, "20": 28}'::JSONB
  END as hourly_visitors
FROM public.stalls s
WHERE s.approval_status = 'approved'::approval_status
ON CONFLICT (stall_id) DO UPDATE SET
  current_queue = EXCLUDED.current_queue,
  estimated_wait = EXCLUDED.estimated_wait,
  peak_hours = EXCLUDED.peak_hours,
  busy_level = EXCLUDED.busy_level,
  hourly_visitors = EXCLUDED.hourly_visitors,
  last_updated = NOW();

-- Insert sample live orders for existing approved stalls
INSERT INTO public.live_orders (stall_id, customer_name, order_items, total_amount, status, queue_position)
SELECT 
  s.id,
  CASE 
    WHEN ROW_NUMBER() OVER (ORDER BY s.created_at) = 1 THEN 'John D.'
    WHEN ROW_NUMBER() OVER (ORDER BY s.created_at) = 2 THEN 'Sarah M.'
    ELSE 'Mike R.'
  END as customer_name,
  CASE 
    WHEN s.name ILIKE '%noodle%' THEN '[{"name": "Spicy Noodles", "quantity": 2, "price": 12.99}]'::JSONB
    WHEN s.name ILIKE '%bbq%' THEN '[{"name": "BBQ Ribs", "quantity": 1, "price": 24.99}]'::JSONB
    ELSE '[{"name": "Veggie Bowl", "quantity": 1, "price": 15.99}]'::JSONB
  END as order_items,
  CASE 
    WHEN s.name ILIKE '%noodle%' THEN 25.98
    WHEN s.name ILIKE '%bbq%' THEN 24.99
    ELSE 15.99
  END as total_amount,
  CASE 
    WHEN ROW_NUMBER() OVER (ORDER BY s.created_at) = 1 THEN 'preparing'
    WHEN ROW_NUMBER() OVER (ORDER BY s.created_at) = 2 THEN 'pending'
    ELSE 'ready'
  END as status,
  ROW_NUMBER() OVER (ORDER BY s.created_at) as queue_position
FROM public.stalls s
WHERE s.approval_status = 'approved'::approval_status
LIMIT 3;

-- Enable RLS on new tables
ALTER TABLE public.stall_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.live_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- RLS policies for stall_analytics
CREATE POLICY "Anyone can view stall analytics" ON public.stall_analytics
  FOR SELECT USING (true);

CREATE POLICY "Stall owners can update their analytics" ON public.stall_analytics
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.stalls 
      WHERE id = stall_id AND owner_id = auth.uid()
    )
  );

-- RLS policies for live_orders
CREATE POLICY "Anyone can view live orders for approved stalls" ON public.live_orders
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.stalls 
      WHERE id = stall_id AND approval_status = 'approved'::approval_status
    )
  );

CREATE POLICY "Stall owners can manage their orders" ON public.live_orders
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.stalls 
      WHERE id = stall_id AND owner_id = auth.uid()
    )
  );

-- RLS policies for notifications
CREATE POLICY "Users can view their notifications" ON public.notifications
  FOR SELECT USING (user_id = auth.uid() OR user_id IS NULL);

CREATE POLICY "System can create notifications" ON public.notifications
  FOR INSERT WITH CHECK (true);

-- Enable Row Level Security for the realtime_data table if not already done in 01-create-database-schema.sql
ALTER TABLE public.realtime_data ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows all authenticated users to insert into realtime_data
DROP POLICY IF EXISTS "Authenticated users can insert realtime data" ON public.realtime_data;
CREATE POLICY "Authenticated users can insert realtime data" ON public.realtime_data
FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Create a policy that allows everyone to read from realtime_data
DROP POLICY IF EXISTS "Realtime data is viewable by everyone" ON public.realtime_data;
CREATE POLICY "Realtime data is viewable by everyone" ON public.realtime_data
FOR SELECT USING (true);

-- Enable real-time capabilities for the 'stalls' table
ALTER PUBLICATION supabase_realtime ADD TABLE public.stalls;

-- Enable real-time capabilities for the 'realtime_data' table
ALTER PUBLICATION supabase_realtime ADD TABLE public.realtime_data;

-- You might also want to enable for 'users' if you want real-time updates on user profiles
-- ALTER PUBLICATION supabase_realtime ADD TABLE public.users;
