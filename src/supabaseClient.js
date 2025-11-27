import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://pvhbfmsnxxyxdjtmvxpt.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB2aGJmbXNueHh5eGRqdG12eHB0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQyMTk4MTIsImV4cCI6MjA3OTc5NTgxMn0.MmreJWQtTUBXFFOgXb05hr2BW_bn-ADWKHshG84yQv0";

export const supabase = createClient(supabaseUrl, supabaseKey);
