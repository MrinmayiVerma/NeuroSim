
import { createClient } from '@supabase/supabase-js';
import { supabase as supabaseIntegration } from '@/integrations/supabase/client';

// We'll use the supabase client from the integration that was already configured
export const supabase = supabaseIntegration;
