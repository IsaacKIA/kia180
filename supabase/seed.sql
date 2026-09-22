-- ==============================================================================
-- KIA 180 — Isaac Agya Koomson Baseline Seed Data
-- Cycle: 21 September 2026 → 20 March 2027
-- ==============================================================================

-- Template user ID for initial seeding (or replace with authenticated user)
DO $$
DECLARE
    v_user_id UUID;
    v_cycle_id UUID;
    v_phase1_id UUID;
    v_phase2_id UUID;
    v_phase3_id UUID;
    v_pillar_money UUID;
    v_pillar_build UUID;
    v_pillar_grow UUID;
    v_biz_kia UUID;
    v_biz_civitas UUID;
    v_biz_agrivora UUID;
    v_proj_immediate_cash UUID;
    v_goal_cash UUID;
    v_goal_personal_income UUID;
BEGIN
    -- Select first registered user or placeholder
    SELECT id INTO v_user_id FROM auth.users ORDER BY created_at ASC LIMIT 1;
    
    IF v_user_id IS NULL THEN
        -- Generate placeholder UUID if auth.users is empty for offline seeding
        v_user_id := '00000000-0000-0000-0000-000000000001'::uuid;
    END IF;

    -- Upsert profile
    INSERT INTO profiles (id, email, full_name, currency, timezone)
    VALUES (v_user_id, 'isaac@kia180.com', 'Isaac Agya Koomson', 'GHS', 'Africa/Accra')
    ON CONFLICT (id) DO UPDATE 
    SET full_name = EXCLUDED.full_name, currency = EXCLUDED.currency;

    -- 180-Day Cycle
    INSERT INTO cycles (id, user_id, title, objective, start_date, end_date, total_days, status)
    VALUES (
        uuid_generate_v4(),
        v_user_id,
        'KIA 180 — Master Execution Cycle 1',
        'Move from Uncertain to Structured, Fragile to Stable, Hesitant to Decisive with GHS 15k/mo personal income & GHS 50k/mo venture cashflow.',
        '2026-09-21',
        '2027-03-20',
        180,
        'active'
    ) RETURNING id INTO v_cycle_id;

    -- Phases
    INSERT INTO phases (id, cycle_id, user_id, name, phase_order, start_date, end_date, focus_summary, status)
    VALUES 
    (uuid_generate_v4(), v_cycle_id, v_user_id, 'Phase 1: Foundation & Cash Stability', 1, '2026-09-21', '2026-11-04', 'Eliminate immediate cash drag, settle urgent obligations, secure first consulting retainer clients.', 'active')
    RETURNING id INTO v_phase1_id;

    INSERT INTO phases (id, cycle_id, user_id, name, phase_order, start_date, end_date, focus_summary, status)
    VALUES 
    (uuid_generate_v4(), v_cycle_id, v_user_id, 'Phase 2: Systems & Business Acceleration', 2, '2026-11-05', '2027-01-18', 'Systematize operations, scale sales pipelines across ventures, establish recurring retainers.', 'upcoming')
    RETURNING id INTO v_phase2_id;

    INSERT INTO phases (id, cycle_id, user_id, name, phase_order, start_date, end_date, focus_summary, status)
    VALUES 
    (uuid_generate_v4(), v_cycle_id, v_user_id, 'Phase 3: Authority, Expansion & Sustainable Scale', 3, '2027-01-19', '2027-03-20', 'Establish regional executive thought leadership, automated cashflow, long-term asset positioning.', 'upcoming')
    RETURNING id INTO v_phase3_id;

    -- Pillars
    INSERT INTO pillars (id, cycle_id, user_id, name, description, objective, priority, color_hex)
    VALUES 
    (uuid_generate_v4(), v_cycle_id, v_user_id, 'Money', 'Personal financial independence & business revenue engines', 'Achieve GHS 15k personal income & eliminate GHS 7k debt', 1, '#C9A84C')
    RETURNING id INTO v_pillar_money;

    INSERT INTO pillars (id, cycle_id, user_id, name, description, objective, priority, color_hex)
    VALUES 
    (uuid_generate_v4(), v_cycle_id, v_user_id, 'Build', 'Ventures, product systems, and operational execution', 'Build KIA Consult, Civitas & Agrivora into sustainable vehicles', 2, '#38BDF8')
    RETURNING id INTO v_pillar_build;

    INSERT INTO pillars (id, cycle_id, user_id, name, description, objective, priority, color_hex)
    VALUES 
    (uuid_generate_v4(), v_cycle_id, v_user_id, 'Grow', 'Executive leadership, energy, discipline, and knowledge mastery', 'Zero pre-start resistance, high daily commitment rate, authority publishing', 3, '#10B981')
    RETURNING id INTO v_pillar_grow;

    -- Businesses
    INSERT INTO businesses (id, user_id, name, description, role, status, revenue_current, revenue_target, color_hex)
    VALUES 
    (uuid_generate_v4(), v_user_id, 'KIA-Start Up Consult', 'Primary cash engine — Advisory, business setup, strategic structuring and funding readiness for founders.', 'cash_engine', 'active', 100, 25000, '#38BDF8')
    RETURNING id INTO v_biz_kia;

    INSERT INTO businesses (id, user_id, name, description, role, status, revenue_current, revenue_target, color_hex)
    VALUES 
    (uuid_generate_v4(), v_user_id, 'Civitas', 'Validation & governance advisory — Municipal/civic tech solutions and civic leadership consulting.', 'validation', 'active', 0, 15000, '#10B981')
    RETURNING id INTO v_biz_civitas;

    INSERT INTO businesses (id, user_id, name, description, role, status, revenue_current, revenue_target, color_hex)
    VALUES 
    (uuid_generate_v4(), v_user_id, 'Agrivora', 'Growth vehicle — Agribusiness value addition, supply aggregation and sustainable farm intelligence.', 'growth', 'active', 0, 10000, '#F59E0B')
    RETURNING id INTO v_biz_agrivora;

    -- Strategic Goals
    INSERT INTO goals (id, user_id, cycle_id, pillar_id, title, description, target_value, current_value, unit, level, start_date, end_date, status)
    VALUES 
    (uuid_generate_v4(), v_user_id, v_cycle_id, v_pillar_money, 'Personal Monthly Income GHS 15,000', 'Scale personal income from GHS 2,000 baseline to GHS 15,000/mo sustainable run-rate', 15000, 2000, 'GHS/mo', '180day', '2026-09-21', '2027-03-20', 'in_progress')
    RETURNING id INTO v_goal_personal_income;

    INSERT INTO goals (id, user_id, cycle_id, pillar_id, title, description, target_value, current_value, unit, level, start_date, end_date, status)
    VALUES 
    (uuid_generate_v4(), v_user_id, v_cycle_id, v_pillar_money, 'Clear Outstanding Obligations (GHS 7,000)', 'Complete settlement of all current debt obligations to restore full financial posture.', 7000, 0, 'GHS', 'monthly', '2026-09-21', '2026-11-30', 'in_progress')
    RETURNING id INTO v_goal_cash;

    -- Initial Project
    INSERT INTO projects (id, user_id, business_id, pillar_id, title, objective, success_condition, status, start_date, target_date, expected_value, estimated_effort, budget)
    VALUES 
    (uuid_generate_v4(), v_user_id, v_biz_kia, v_pillar_money, 'KIA Consult Immediate Client Acquisition Sprint', 'Secure first 3 paid startup consulting clients at min GHS 3,000 retainer.', '3 signed agreements and GHS 9,000 initial payments received.', 'active', '2026-09-21', '2026-10-15', 'GHS 9,000', '40 hours', 0)
    RETURNING id INTO v_proj_immediate_cash;

    -- Daily Three Tasks (Day 1)
    INSERT INTO tasks (id, user_id, project_id, goal_id, pillar_id, title, description, priority, status, pillar_tag, estimated_duration, why_it_matters, next_action, consequence_of_delay, energy_required, is_daily_three)
    VALUES 
    (
        uuid_generate_v4(), v_user_id, v_proj_immediate_cash, v_goal_personal_income, v_pillar_money,
        'Compile list of 15 target founders for KIA Start-Up Consult',
        'Identify warm contacts and growing ventures in Accra requiring business formalization and investor decks.',
        'critical', 'todo', 'money', 60,
        'Without targeted pipeline outreach, zero revenue flows into the business this week.',
        'Open LinkedIn and WhatsApp to filter founders and note phone numbers in pipeline.',
        'Another day with zero pipeline leads, prolonging cash deficit.',
        'high', TRUE
    ),
    (
        uuid_generate_v4(), v_user_id, v_proj_immediate_cash, v_goal_personal_income, v_pillar_money,
        'Draft 1-page executive advisory package & pricing sheet',
        'Define 3 clear service tiers (Startup Setup: GHS 2.5k, Growth Audit: GHS 5k, Monthly Advisory: GHS 3k/mo).',
        'high', 'todo', 'build', 45,
        'Enables instant quoting during founder conversations instead of hesitation.',
        'Outline the deliverables and pricing bullets in simple markdown.',
        'Inability to quote immediate figures when prospective clients ask.',
        'medium', TRUE
    ),
    (
        uuid_generate_v4(), v_user_id, v_proj_immediate_cash, v_goal_cash, v_pillar_money,
        'Map GHS 7,000 obligations into priority settlement calendar',
        'Categorize the debt obligations by creditor urgency and match to expected revenue milestones.',
        'critical', 'todo', 'money', 30,
        'Clarity removes psychological weight and stops anxiety-driven avoidance.',
        'List creditors, amounts, contact persons and proposed settlement dates.',
        'Continued background stress draining cognitive focus from business building.',
        'medium', TRUE
    );

    -- Financial Accounts
    INSERT INTO financial_accounts (id, user_id, name, account_type, currency, balance, business_id)
    VALUES 
    (uuid_generate_v4(), v_user_id, 'Isaac Personal Operating Account', 'personal', 'GHS', 0, NULL),
    (uuid_generate_v4(), v_user_id, 'KIA Consult Commercial Account', 'business', 'GHS', 0, v_biz_kia);

    -- Obligations
    INSERT INTO obligations (id, user_id, title, creditor, amount, paid_amount, currency, due_date, priority, status, notes)
    VALUES 
    (uuid_generate_v4(), v_user_id, 'Immediate Outstanding Debt Pool', 'Creditors', 7000, 0, 'GHS', '2026-11-30', 'urgent', 'pending', 'Core baseline debt to clear in Phase 1.');

    -- Risks
    INSERT INTO risks (id, user_id, title, category, level, evidence, trend, cause, mitigation, review_date)
    VALUES 
    (
        uuid_generate_v4(), v_user_id, 'Immediate Cash Deficit', 'cash', 'critical',
        'Cash available is GHS 0 with GHS 7,000 obligations and personal baseline needs of GHS 8,000/mo.',
        'stable', 'Under-monetized services and historical pre-start delay in outreach.',
        'Prioritize daily client outreach Sprint; 2 sales conversations daily until 3 retainers closed.',
        '2026-09-28'
    ),
    (
        uuid_generate_v4(), v_user_id, 'Pre-Start Friction & Distraction', 'execution', 'high',
        'Historical delay before starting high-leverage business tasks.',
        'improving', 'Cognitive friction regarding task size and fear of negative feedback.',
        'Utilize 5-minute launch rule and AI Task Decomposition engine on any task causing hesitation.',
        '2026-09-28'
    );

    -- Daily Plan (Day 1)
    INSERT INTO daily_plans (id, user_id, plan_date, north_star, energy_level, notes)
    VALUES (
        uuid_generate_v4(), v_user_id, '2026-09-21',
        'Secure 2 client discovery conversations and establish absolute clarity on debt retirement schedule.',
        'high', 'Day 1 of 180. Focus strictly on Money pillar and client pipeline creation.'
    );

END $$;
