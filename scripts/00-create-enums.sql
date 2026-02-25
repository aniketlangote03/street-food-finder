-- Create ENUM for user roles
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
        CREATE TYPE public.user_role AS ENUM ('user', 'stall_owner', 'admin');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'stall_status') THEN
        CREATE TYPE public.stall_status AS ENUM ('open', 'closed', 'maintenance');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'approval_status') THEN
        CREATE TYPE public.approval_status AS ENUM ('pending', 'approved', 'rejected');
    END IF;
END $$;
