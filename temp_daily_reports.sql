
-- Daily Reports Table
CREATE TABLE IF NOT EXISTS public.daily_reports (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    instructor_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    is_paid BOOLEAN DEFAULT false,
    point_of_focus TEXT,
    new_words TEXT,
    homework TEXT,
    upcoming_class TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- RLS for Daily Reports
ALTER TABLE public.daily_reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Teachers can create reports"
    ON public.daily_reports FOR INSERT
    TO authenticated
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role IN ('teacher', 'admin')
        )
    );

CREATE POLICY "Teachers can view their created reports"
    ON public.daily_reports FOR SELECT
    TO authenticated
    USING (
        instructor_id = auth.uid() OR
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

CREATE POLICY "Students can view their own reports"
    ON public.daily_reports FOR SELECT
    TO authenticated
    USING (
        student_id = auth.uid()
    );
