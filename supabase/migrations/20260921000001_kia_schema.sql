-- ==============================================================================
-- KIA 180 — Master PostgreSQL Schema
-- Version 1.0
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==============================================================================
-- ENUMS
-- ==============================================================================
CREATE TYPE cycle_status AS ENUM ('upcoming', 'active', 'completed', 'paused');
CREATE TYPE phase_status AS ENUM ('upcoming', 'active', 'completed');
CREATE TYPE goal_level AS ENUM ('180day', 'monthly', 'weekly', 'daily');
CREATE TYPE goal_status AS ENUM ('not_started', 'in_progress', 'achieved', 'missed', 'paused');
CREATE TYPE business_status AS ENUM ('active', 'validation', 'paused', 'closed');
CREATE TYPE business_role AS ENUM ('cash_engine', 'validation', 'growth');
CREATE TYPE project_status AS ENUM ('idea', 'planned', 'active', 'paused', 'completed', 'cancelled');
CREATE TYPE task_priority AS ENUM ('critical', 'high', 'medium', 'low');
CREATE TYPE task_status AS ENUM ('todo', 'in_progress', 'completed', 'deferred', 'cancelled');
CREATE TYPE pillar_tag AS ENUM ('money', 'build', 'grow');
CREATE TYPE energy_level AS ENUM ('high', 'medium', 'low');
CREATE TYPE commitment_status AS ENUM ('committed', 'in_progress', 'completed', 'deferred', 'cancelled');
CREATE TYPE time_block_category AS ENUM ('revenue', 'strategic', 'admin', 'learning', 'rest');
CREATE TYPE focus_session_mode AS ENUM ('normal', '5min_launch');
CREATE TYPE account_type AS ENUM ('personal', 'business');
CREATE TYPE obligation_priority AS ENUM ('urgent', 'high', 'medium', 'low');
CREATE TYPE obligation_status AS ENUM ('pending', 'partially_paid', 'settled');
CREATE TYPE payment_status AS ENUM ('pending', 'overdue', 'received', 'paid');
CREATE TYPE lead_status AS ENUM ('lead', 'contacted', 'conversation', 'qualified', 'proposal', 'negotiation', 'won', 'completed', 'lost');
CREATE TYPE knowledge_type AS ENUM ('article', 'book', 'research', 'note', 'idea', 'insight');
CREATE TYPE research_status AS ENUM ('open', 'in_progress', 'concluded');
CREATE TYPE evidence_type AS ENUM ('supporting', 'opposing', 'neutral');
CREATE TYPE authority_type AS ENUM ('article', 'post', 'framework', 'research', 'case_study');
CREATE TYPE idea_status AS ENUM ('captured', 'exploring', 'validating', 'active', 'parked', 'rejected', 'completed');
CREATE TYPE decision_status AS ENUM ('evaluating', 'approved', 'rejected', 'executed');
CREATE TYPE risk_category AS ENUM ('cash', 'revenue', 'execution', 'focus', 'time', 'knowledge', 'reputation', 'opportunity');
CREATE TYPE risk_level AS ENUM ('low', 'elevated', 'high', 'critical');
CREATE TYPE risk_trend AS ENUM ('improving', 'stable', 'worsening');
CREATE TYPE notification_type AS ENUM ('critical', 'high', 'medium', 'low');
CREATE TYPE recommendation_status AS ENUM ('active', 'accepted', 'dismissed');

-- ==============================================================================
-- 1. PROFILES & IDENTITY
-- ==============================================================================
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    full_name TEXT NOT NULL,
    currency TEXT DEFAULT 'GHS' NOT NULL,
    avatar_url TEXT,
    timezone TEXT DEFAULT 'Africa/Accra' NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ==============================================================================
-- 2. CYCLES, PHASES & PILLARS
-- ==============================================================================
CREATE TABLE IF NOT EXISTS cycles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    objective TEXT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    total_days INT DEFAULT 180 NOT NULL,
    status cycle_status DEFAULT 'active' NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS phases (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    cycle_id UUID NOT NULL REFERENCES cycles(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    phase_order INT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    focus_summary TEXT NOT NULL,
    status phase_status DEFAULT 'upcoming' NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS pillars (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    cycle_id UUID NOT NULL REFERENCES cycles(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    objective TEXT NOT NULL,
    priority INT DEFAULT 1 NOT NULL,
    color_hex TEXT DEFAULT '#C9A84C',
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ==============================================================================
-- 3. GOALS & MILESTONES
-- ==============================================================================
CREATE TABLE IF NOT EXISTS goals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    cycle_id UUID NOT NULL REFERENCES cycles(id) ON DELETE CASCADE,
    pillar_id UUID REFERENCES pillars(id) ON DELETE SET NULL,
    parent_goal_id UUID REFERENCES goals(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    target_value NUMERIC,
    current_value NUMERIC DEFAULT 0,
    unit TEXT,
    level goal_level DEFAULT '180day' NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    status goal_status DEFAULT 'not_started' NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS milestones (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    goal_id UUID NOT NULL REFERENCES goals(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    target_date DATE NOT NULL,
    status goal_status DEFAULT 'not_started' NOT NULL,
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ==============================================================================
-- 4. BUSINESSES & VENTURES
-- ==============================================================================
CREATE TABLE IF NOT EXISTS businesses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    role business_role NOT NULL,
    status business_status DEFAULT 'active' NOT NULL,
    revenue_current NUMERIC DEFAULT 0 NOT NULL,
    revenue_target NUMERIC DEFAULT 0 NOT NULL,
    color_hex TEXT DEFAULT '#38BDF8',
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS business_goals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
    goal_id UUID NOT NULL REFERENCES goals(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ==============================================================================
-- 5. PROJECTS & TASKS
-- ==============================================================================
CREATE TABLE IF NOT EXISTS projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    business_id UUID REFERENCES businesses(id) ON DELETE SET NULL,
    pillar_id UUID REFERENCES pillars(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    objective TEXT NOT NULL,
    success_condition TEXT NOT NULL,
    status project_status DEFAULT 'planned' NOT NULL,
    start_date DATE NOT NULL,
    target_date DATE NOT NULL,
    expected_value TEXT,
    estimated_effort TEXT,
    budget NUMERIC DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
    goal_id UUID REFERENCES goals(id) ON DELETE SET NULL,
    pillar_id UUID REFERENCES pillars(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    description TEXT,
    priority task_priority DEFAULT 'medium' NOT NULL,
    status task_status DEFAULT 'todo' NOT NULL,
    pillar_tag pillar_tag DEFAULT 'money' NOT NULL,
    estimated_duration INT,
    deadline TIMESTAMPTZ,
    why_it_matters TEXT,
    next_action TEXT,
    consequence_of_delay TEXT,
    deferral_count INT DEFAULT 0 NOT NULL,
    energy_required energy_level DEFAULT 'medium' NOT NULL,
    is_daily_three BOOLEAN DEFAULT FALSE NOT NULL,
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS subtasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    completed BOOLEAN DEFAULT FALSE NOT NULL,
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS commitments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    task_id UUID REFERENCES tasks(id) ON DELETE SET NULL,
    goal_id UUID REFERENCES goals(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    deadline TIMESTAMPTZ NOT NULL,
    importance task_priority DEFAULT 'high' NOT NULL,
    status commitment_status DEFAULT 'committed' NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ==============================================================================
-- 6. TIME, FOCUS & DAILY EXECUTION
-- ==============================================================================
CREATE TABLE IF NOT EXISTS calendar_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ NOT NULL,
    event_type TEXT DEFAULT 'task' NOT NULL,
    linked_task_id UUID REFERENCES tasks(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS time_blocks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ NOT NULL,
    category time_block_category DEFAULT 'revenue' NOT NULL,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS focus_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    task_id UUID REFERENCES tasks(id) ON DELETE SET NULL,
    started_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    ended_at TIMESTAMPTZ,
    duration_minutes INT DEFAULT 0 NOT NULL,
    mode focus_session_mode DEFAULT 'normal' NOT NULL,
    notes TEXT,
    completed BOOLEAN DEFAULT FALSE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS daily_plans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    plan_date DATE NOT NULL,
    north_star TEXT NOT NULL,
    ai_generated BOOLEAN DEFAULT FALSE NOT NULL,
    energy_level energy_level DEFAULT 'medium' NOT NULL,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    CONSTRAINT unique_user_daily_plan UNIQUE (user_id, plan_date)
);

-- ==============================================================================
-- 7. FINANCE (PERSONAL & BUSINESS)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS financial_accounts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    account_type account_type NOT NULL,
    currency TEXT DEFAULT 'GHS' NOT NULL,
    balance NUMERIC DEFAULT 0 NOT NULL,
    business_id UUID REFERENCES businesses(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS income_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    account_id UUID REFERENCES financial_accounts(id) ON DELETE SET NULL,
    business_id UUID REFERENCES businesses(id) ON DELETE SET NULL,
    amount NUMERIC NOT NULL,
    currency TEXT DEFAULT 'GHS' NOT NULL,
    source TEXT NOT NULL,
    category TEXT NOT NULL,
    record_date DATE NOT NULL,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS expense_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    account_id UUID REFERENCES financial_accounts(id) ON DELETE SET NULL,
    business_id UUID REFERENCES businesses(id) ON DELETE SET NULL,
    amount NUMERIC NOT NULL,
    currency TEXT DEFAULT 'GHS' NOT NULL,
    category TEXT NOT NULL,
    record_date DATE NOT NULL,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS obligations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    creditor TEXT NOT NULL,
    amount NUMERIC NOT NULL,
    paid_amount NUMERIC DEFAULT 0 NOT NULL,
    currency TEXT DEFAULT 'GHS' NOT NULL,
    due_date DATE NOT NULL,
    priority obligation_priority DEFAULT 'urgent' NOT NULL,
    status obligation_status DEFAULT 'pending' NOT NULL,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS receivables (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    debtor TEXT NOT NULL,
    amount NUMERIC NOT NULL,
    currency TEXT DEFAULT 'GHS' NOT NULL,
    due_date DATE NOT NULL,
    status payment_status DEFAULT 'pending' NOT NULL,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS payables (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    creditor TEXT NOT NULL,
    amount NUMERIC NOT NULL,
    currency TEXT DEFAULT 'GHS' NOT NULL,
    due_date DATE NOT NULL,
    status payment_status DEFAULT 'pending' NOT NULL,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ==============================================================================
-- 8. SALES PIPELINE & RELATIONSHIPS
-- ==============================================================================
CREATE TABLE IF NOT EXISTS contacts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    organization TEXT,
    phone TEXT,
    email TEXT,
    relationship_type TEXT,
    last_meaningful_contact TIMESTAMPTZ,
    follow_up_date DATE,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS sales_leads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
    contact_id UUID REFERENCES contacts(id) ON DELETE SET NULL,
    service TEXT NOT NULL,
    source TEXT,
    estimated_value NUMERIC DEFAULT 0 NOT NULL,
    probability INT DEFAULT 30 NOT NULL,
    status lead_status DEFAULT 'lead' NOT NULL,
    next_action TEXT,
    follow_up_date DATE,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS sales_activities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lead_id UUID NOT NULL REFERENCES sales_leads(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    activity_type TEXT NOT NULL,
    notes TEXT,
    activity_date TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    outcome TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS proposals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lead_id UUID NOT NULL REFERENCES sales_leads(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    value NUMERIC NOT NULL,
    currency TEXT DEFAULT 'GHS' NOT NULL,
    sent_date DATE NOT NULL,
    status TEXT DEFAULT 'pending' NOT NULL,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ==============================================================================
-- 9. KNOWLEDGE OS & AUTHORITY
-- ==============================================================================
CREATE TABLE IF NOT EXISTS knowledge_domains (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    priority INT DEFAULT 1 NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS research_questions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    domain_id UUID REFERENCES knowledge_domains(id) ON DELETE SET NULL,
    question TEXT NOT NULL,
    status research_status DEFAULT 'open' NOT NULL,
    conclusion TEXT,
    applications TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS knowledge_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    domain_id UUID REFERENCES knowledge_domains(id) ON DELETE SET NULL,
    research_question_id UUID REFERENCES research_questions(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    item_type knowledge_type DEFAULT 'note' NOT NULL,
    source TEXT,
    summary TEXT NOT NULL,
    key_insight TEXT,
    application TEXT,
    captured_date DATE DEFAULT CURRENT_DATE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS research_sources (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    question_id UUID NOT NULL REFERENCES research_questions(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    url TEXT,
    evidence_type evidence_type DEFAULT 'supporting' NOT NULL,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS learning_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    domain_id UUID REFERENCES knowledge_domains(id) ON DELETE SET NULL,
    session_date DATE DEFAULT CURRENT_DATE NOT NULL,
    duration_minutes INT NOT NULL,
    topic TEXT NOT NULL,
    notes TEXT,
    key_takeaway TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS authority_outputs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    domain_id UUID REFERENCES knowledge_domains(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    output_type authority_type DEFAULT 'article' NOT NULL,
    published_at TIMESTAMPTZ,
    url TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS speaking_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    event_name TEXT NOT NULL,
    event_date DATE NOT NULL,
    audience_size INT,
    topic TEXT NOT NULL,
    outcome TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ==============================================================================
-- 10. IDEAS, DECISIONS & RISKS
-- ==============================================================================
CREATE TABLE IF NOT EXISTS ideas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    category TEXT,
    status idea_status DEFAULT 'captured' NOT NULL,
    potential_value TEXT,
    capital_required TEXT,
    time_required TEXT,
    strategic_fit INT DEFAULT 3,
    evidence TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS decisions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    opportunity TEXT NOT NULL,
    revenue_potential TEXT,
    capital_required TEXT,
    time_required TEXT,
    strategic_fit INT DEFAULT 3,
    customer_certainty INT DEFAULT 3,
    capability_fit INT DEFAULT 3,
    opportunity_cost TEXT,
    risk_assessment TEXT,
    evidence TEXT,
    status decision_status DEFAULT 'evaluating' NOT NULL,
    ai_brief TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS risks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    category risk_category NOT NULL,
    level risk_level DEFAULT 'elevated' NOT NULL,
    evidence TEXT NOT NULL,
    trend risk_trend DEFAULT 'stable' NOT NULL,
    cause TEXT,
    mitigation TEXT NOT NULL,
    review_date DATE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS risk_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    risk_id UUID NOT NULL REFERENCES risks(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    event_date DATE DEFAULT CURRENT_DATE NOT NULL,
    description TEXT NOT NULL,
    impact TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ==============================================================================
-- 11. REVIEWS & ANALYTICS
-- ==============================================================================
CREATE TABLE IF NOT EXISTS daily_reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    review_date DATE NOT NULL,
    completed_actions TEXT,
    avoided_actions TEXT,
    money_moved NUMERIC DEFAULT 0,
    built TEXT,
    learned TEXT,
    distracted_by TEXT,
    tomorrow_number_one TEXT,
    energy_start energy_level,
    energy_end energy_level,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    CONSTRAINT unique_user_daily_review UNIQUE (user_id, review_date)
);

CREATE TABLE IF NOT EXISTS weekly_reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    week_start DATE NOT NULL,
    cash_collected NUMERIC DEFAULT 0,
    conversations_count INT DEFAULT 0,
    proposals_sent INT DEFAULT 0,
    deals_closed INT DEFAULT 0,
    commitment_rate NUMERIC DEFAULT 0,
    deep_work_hours NUMERIC DEFAULT 0,
    distraction_hours NUMERIC DEFAULT 0,
    learning_hours NUMERIC DEFAULT 0,
    what_worked TEXT,
    what_failed TEXT,
    what_avoided TEXT,
    what_learned TEXT,
    what_changes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    CONSTRAINT unique_user_weekly_review UNIQUE (user_id, week_start)
);

CREATE TABLE IF NOT EXISTS monthly_reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    month_start DATE NOT NULL,
    income_target NUMERIC DEFAULT 0,
    income_actual NUMERIC DEFAULT 0,
    revenue_target NUMERIC DEFAULT 0,
    revenue_actual NUMERIC DEFAULT 0,
    ceo_brief TEXT,
    lessons TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    CONSTRAINT unique_user_monthly_review UNIQUE (user_id, month_start)
);

-- ==============================================================================
-- 12. AI & NOTIFICATIONS
-- ==============================================================================
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    body TEXT NOT NULL,
    notification_type notification_type DEFAULT 'medium' NOT NULL,
    category TEXT,
    is_read BOOLEAN DEFAULT FALSE NOT NULL,
    action_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS ai_interactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    session_id TEXT NOT NULL,
    role TEXT NOT NULL,
    content TEXT NOT NULL,
    context_snapshot JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS ai_recommendations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    recommendation_type TEXT NOT NULL,
    content TEXT NOT NULL,
    context JSONB,
    status recommendation_status DEFAULT 'active' NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ==============================================================================
-- INDEXES FOR QUERY OPTIMIZATION
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_cycles_user_id ON cycles(user_id);
CREATE INDEX IF NOT EXISTS idx_phases_cycle_id ON phases(cycle_id);
CREATE INDEX IF NOT EXISTS idx_pillars_cycle_id ON pillars(cycle_id);
CREATE INDEX IF NOT EXISTS idx_goals_user_id ON goals(user_id);
CREATE INDEX IF NOT EXISTS idx_goals_pillar_id ON goals(pillar_id);
CREATE INDEX IF NOT EXISTS idx_projects_user_id ON projects(user_id);
CREATE INDEX IF NOT EXISTS idx_projects_business_id ON projects(business_id);
CREATE INDEX IF NOT EXISTS idx_tasks_user_id ON tasks(user_id);
CREATE INDEX IF NOT EXISTS idx_tasks_project_id ON tasks(project_id);
CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);
CREATE INDEX IF NOT EXISTS idx_tasks_deadline ON tasks(deadline);
CREATE INDEX IF NOT EXISTS idx_tasks_daily_three ON tasks(is_daily_three);
CREATE INDEX IF NOT EXISTS idx_financial_accounts_user_id ON financial_accounts(user_id);
CREATE INDEX IF NOT EXISTS idx_income_user_id ON income_records(user_id);
CREATE INDEX IF NOT EXISTS idx_expense_user_id ON expense_records(user_id);
CREATE INDEX IF NOT EXISTS idx_obligations_user_id ON obligations(user_id);
CREATE INDEX IF NOT EXISTS idx_sales_leads_user_id ON sales_leads(user_id);
CREATE INDEX IF NOT EXISTS idx_sales_leads_business_id ON sales_leads(business_id);
CREATE INDEX IF NOT EXISTS idx_knowledge_user_id ON knowledge_items(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id_read ON notifications(user_id, is_read);
CREATE INDEX IF NOT EXISTS idx_focus_sessions_user_id ON focus_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_daily_plans_user_date ON daily_plans(user_id, plan_date);
