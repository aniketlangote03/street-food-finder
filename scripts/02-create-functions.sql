-- Function to create a public.users entry on new auth.users signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, display_name, full_name, role)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'display_name', NEW.raw_user_meta_data->>'full_name', 'user');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to call handle_new_user on auth.users insert
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update average_rating and review_count on new review
CREATE OR REPLACE FUNCTION public.update_stall_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.stalls
  SET
    average_rating = (SELECT AVG(rating) FROM public.reviews WHERE stall_id = NEW.stall_id),
    review_count = (SELECT COUNT(*) FROM public.reviews WHERE stall_id = NEW.stall_id)
  WHERE id = NEW.stall_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to call update_stall_rating on reviews insert/update/delete
DROP TRIGGER IF EXISTS on_review_change ON public.reviews;
CREATE TRIGGER on_review_change
AFTER INSERT OR UPDATE OR DELETE ON public.reviews
FOR EACH ROW EXECUTE FUNCTION public.update_stall_rating();

-- Function to update 'updated_at' columns automatically
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Triggers for 'updated_at'
DROP TRIGGER IF EXISTS set_users_updated_at ON public.users;
CREATE TRIGGER set_users_updated_at
BEFORE UPDATE ON public.users
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS set_stalls_updated_at ON public.stalls;
CREATE TRIGGER set_stalls_updated_at
BEFORE UPDATE ON public.stalls
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS set_menu_items_updated_at ON public.menu_items;
CREATE TRIGGER set_menu_items_updated_at
BEFORE UPDATE ON public.menu_items
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS set_reviews_updated_at ON public.reviews;
CREATE TRIGGER set_reviews_updated_at
BEFORE UPDATE ON public.reviews
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Function to allow admin to approve/reject stalls
CREATE OR REPLACE FUNCTION public.authorize_admin_stall_action(stall_id uuid, action public.approval_status)
RETURNS void AS $$
DECLARE
    user_role public.user_role;
BEGIN
    SELECT role INTO user_role FROM public.users WHERE id = auth.uid();

    IF user_role = 'admin' THEN
        UPDATE public.stalls
        SET is_approved = (action = 'approved')
        WHERE id = stall_id;
    ELSE
        RAISE EXCEPTION 'Permission denied: Only administrators can perform this action.';
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to allow admin to change user roles
CREATE OR REPLACE FUNCTION public.authorize_admin_change_user_role(target_user_id uuid, new_role public.user_role)
RETURNS void AS $$
DECLARE
    caller_role public.user_role;
BEGIN
    SELECT role INTO caller_role FROM public.users WHERE id = auth.uid();

    IF caller_role = 'admin' THEN
        UPDATE public.users
        SET role = new_role
        WHERE id = target_user_id;
    ELSE
        RAISE EXCEPTION 'Permission denied: Only administrators can change user roles.';
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
