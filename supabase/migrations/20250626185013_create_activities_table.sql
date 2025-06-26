-- Create activities table
CREATE TABLE IF NOT EXISTS public.activities (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    type VARCHAR(50) NOT NULL CHECK (type IN ('user_action', 'system_event', 'data_change')),
    title TEXT NOT NULL,
    description TEXT,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations for now (can be restricted later)
CREATE POLICY "Allow all operations on activities" ON public.activities
    FOR ALL USING (true)
    WITH CHECK (true);

-- Enable real-time subscriptions
ALTER PUBLICATION supabase_realtime ADD TABLE public.activities;

-- Insert seed data
INSERT INTO public.activities (type, title, description, metadata) VALUES
    ('user_action', 'User Logged In', 'Sarah Johnson signed in to her account', '{"user_id": "user_123", "ip_address": "192.168.1.100", "device": "Chrome on MacOS"}'),
    ('user_action', 'Profile Updated', 'John Smith updated his profile information', '{"user_id": "user_456", "fields_changed": ["email", "phone"], "previous_email": "john.old@example.com"}'),
    ('data_change', 'Document Created', 'New project proposal document was created', '{"document_id": "doc_789", "title": "Q4 Marketing Strategy", "author": "user_123", "size": "2.4MB"}'),
    ('user_action', 'Password Changed', 'User successfully updated their password', '{"user_id": "user_456", "method": "self_service", "requires_reauth": true}'),
    ('system_event', 'Email Sent', 'Welcome email delivered to new user', '{"recipient": "alice@example.com", "template": "welcome_new_user", "delivery_status": "delivered"}'),
    ('data_change', 'Order Placed', 'Customer placed order for premium subscription', '{"order_id": "ord_999", "customer_id": "user_789", "amount": "$29.99", "plan": "premium_monthly"}'),
    ('user_action', 'File Uploaded', 'Marketing team uploaded new brand assets', '{"file_name": "logo_variants.zip", "size": "15.2MB", "uploaded_by": "user_123", "folder": "/assets/branding"}'),
    ('system_event', 'Payment Processed', 'Subscription renewal payment completed', '{"customer_id": "user_456", "amount": "$99.99", "method": "visa_4242", "next_billing": "2024-07-26"}'),
    ('user_action', 'Comment Added', 'Team member left feedback on project proposal', '{"document_id": "doc_789", "author": "user_456", "comment_length": 142, "mentions": ["user_123"]}'),
    ('data_change', 'Settings Updated', 'Notification preferences changed', '{"user_id": "user_123", "email_notifications": false, "push_notifications": true, "marketing_emails": false}'),
    ('user_action', 'Team Invited', 'Manager invited new team members to workspace', '{"inviter": "user_456", "invitees": ["alice@company.com", "bob@company.com"], "role": "editor"}'),
    ('system_event', 'Backup Completed', 'Daily data backup finished successfully', '{"backup_id": "backup_20240626", "size": "156.7GB", "duration": "23 minutes", "status": "success"}');
