-- ============================================================
-- EVENT MANAGEMENT SYSTEM — Full Database Schema
-- Run this in Supabase SQL Editor (supabase.com → SQL Editor)
-- ============================================================

-- =========================
-- LAYER 1: PUBLIC DATA
-- =========================

-- Events Table
CREATE TABLE public.events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL CHECK (type IN ('Cultural', 'Technical', 'Sports', 'Workshop', 'Seminar', 'Hackathon', 'Other')),
    start_date DATE NOT NULL,
    end_date DATE NOT NULL CHECK (end_date >= start_date),
    num_guests INT NOT NULL DEFAULT 0 CHECK (num_guests >= 0),
    status VARCHAR(50) NOT NULL DEFAULT 'Draft' CHECK (status IN ('Draft', 'UnderReview', 'Approved', 'Published', 'Completed')),
    description TEXT,
    venue VARCHAR(255),
    organizer_id UUID REFERENCES auth.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Services Table
CREATE TABLE public.services (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    service_type VARCHAR(50) NOT NULL CHECK (service_type IN ('Photography', 'Venue', 'Catering', 'Music', 'Decoration')),
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Event-Services Junction (Used In)
CREATE TABLE public.event_services (
    event_id UUID REFERENCES public.events(id) ON DELETE CASCADE,
    service_id UUID REFERENCES public.services(id) ON DELETE CASCADE,
    PRIMARY KEY (event_id, service_id)
);

-- =========================
-- LAYER 2: USER & PARTICIPATION
-- =========================

-- Profiles (extends auth.users)
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20),
    role VARCHAR(50) NOT NULL DEFAULT 'participant' CHECK (role IN ('participant', 'organizer', 'faculty_advisor', '4ys', 'oc', 'poc')),
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Event Participants (N:N junction)
CREATE TABLE public.event_participants (
    participant_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    event_id UUID REFERENCES public.events(id) ON DELETE CASCADE,
    registered_at TIMESTAMPTZ DEFAULT NOW(),
    status VARCHAR(50) DEFAULT 'Registered' CHECK (status IN ('Registered', 'Confirmed', 'Cancelled')),
    PRIMARY KEY (participant_id, event_id)
);

-- Feedback
CREATE TABLE public.feedback (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    event_id UUID REFERENCES public.events(id) ON DELETE CASCADE,
    organizer_id UUID REFERENCES auth.users(id),
    rating SMALLINT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comments TEXT,
    submitted_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(customer_id, event_id)
);

-- =========================
-- LAYER 3: ORGANIZATIONAL & FINANCIAL
-- =========================

-- OC Members (extends profiles)
CREATE TABLE public.oc_members (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    invite_code VARCHAR(50) UNIQUE
);

-- OC Member Domains (Multi-Domain Junction)
CREATE TABLE public.oc_member_domains (
    oc_id UUID REFERENCES public.oc_members(id) ON DELETE CASCADE,
    domain VARCHAR(50) NOT NULL CHECK (domain IN ('Logistics', 'MediaProduction', 'Creative', 'PR', 'Content', 'Sponsorship', 'SocialMedia', 'Graphics', 'Technical')),
    PRIMARY KEY (oc_id, domain)
);

-- Budget (1:1 with Event)
CREATE TABLE public.budgets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID UNIQUE REFERENCES public.events(id) ON DELETE CASCADE,
    total_amount DECIMAL(12,2) NOT NULL DEFAULT 0,
    estimated_cost DECIMAL(12,2) NOT NULL DEFAULT 0,
    discount DECIMAL(12,2) DEFAULT 0,
    payment_type VARCHAR(20) CHECK (payment_type IN ('Cash', 'Card', 'UPI', 'NEFT')),
    amount_paid DECIMAL(12,2) DEFAULT 0,
    amount_due DECIMAL(12,2) GENERATED ALWAYS AS (total_amount - amount_paid - discount) STORED,
    customer_id UUID REFERENCES auth.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Special Offers
CREATE TABLE public.special_offers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    budget_id UUID REFERENCES public.budgets(id) ON DELETE CASCADE,
    offer_type VARCHAR(100) NOT NULL,
    valid_from DATE NOT NULL,
    valid_to DATE NOT NULL CHECK (valid_to >= valid_from),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =========================
-- ROW LEVEL SECURITY (RLS)
-- =========================

ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.oc_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.oc_member_domains ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.budgets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.special_offers ENABLE ROW LEVEL SECURITY;

-- Events: public read, authenticated write
CREATE POLICY "Events are viewable by everyone" ON public.events FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create events" ON public.events FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Event owners can update" ON public.events FOR UPDATE USING (auth.uid() = organizer_id);
CREATE POLICY "Event owners can delete" ON public.events FOR DELETE USING (auth.uid() = organizer_id);

-- Services: public read
CREATE POLICY "Services are viewable by everyone" ON public.services FOR SELECT USING (true);
CREATE POLICY "Authenticated users can manage services" ON public.services FOR ALL USING (auth.uid() IS NOT NULL);

-- Event Services: public read
CREATE POLICY "Event services viewable by everyone" ON public.event_services FOR SELECT USING (true);
CREATE POLICY "Authenticated can manage event services" ON public.event_services FOR ALL USING (auth.uid() IS NOT NULL);

-- Profiles: public read, self-update
CREATE POLICY "Profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Event Participants
CREATE POLICY "Participants viewable by authenticated" ON public.event_participants FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Users can register for events" ON public.event_participants FOR INSERT WITH CHECK (auth.uid() = participant_id);
CREATE POLICY "Users can cancel own registration" ON public.event_participants FOR UPDATE USING (auth.uid() = participant_id);
CREATE POLICY "Users can delete own registration" ON public.event_participants FOR DELETE USING (auth.uid() = participant_id);

-- Feedback
CREATE POLICY "Feedback viewable by authenticated" ON public.feedback FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Users can submit feedback" ON public.feedback FOR INSERT WITH CHECK (auth.uid() = customer_id);

-- OC Members
CREATE POLICY "OC members viewable by authenticated" ON public.oc_members FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "OC members can insert self" ON public.oc_members FOR INSERT WITH CHECK (auth.uid() = id);

-- OC Domains
CREATE POLICY "OC domains viewable by authenticated" ON public.oc_member_domains FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "OC members can manage own domains" ON public.oc_member_domains FOR ALL USING (auth.uid() = oc_id);

-- Budgets
CREATE POLICY "Budgets viewable by authenticated" ON public.budgets FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Authenticated can manage budgets" ON public.budgets FOR ALL USING (auth.uid() IS NOT NULL);

-- Special Offers
CREATE POLICY "Offers viewable by authenticated" ON public.special_offers FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Authenticated can manage offers" ON public.special_offers FOR ALL USING (auth.uid() IS NOT NULL);

-- =========================
-- AUTO-CREATE PROFILE ON SIGNUP
-- =========================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, full_name, email, phone, role)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'full_name', 'User'),
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'phone', NULL),
        COALESCE(NEW.raw_user_meta_data->>'role', 'participant')
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =========================
-- INDEXES FOR PERFORMANCE
-- =========================

CREATE INDEX idx_events_start_date ON public.events(start_date);
CREATE INDEX idx_events_status ON public.events(status);
CREATE INDEX idx_events_organizer ON public.events(organizer_id);
CREATE INDEX idx_profiles_email ON public.profiles(email);
CREATE INDEX idx_profiles_role ON public.profiles(role);
CREATE INDEX idx_event_participants_event ON public.event_participants(event_id);
CREATE INDEX idx_feedback_event ON public.feedback(event_id);
