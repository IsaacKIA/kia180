export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type CycleStatus = 'upcoming' | 'active' | 'completed' | 'paused';
export type PhaseStatus = 'upcoming' | 'active' | 'completed';
export type GoalLevel = '180day' | 'monthly' | 'weekly' | 'daily';
export type GoalStatus = 'not_started' | 'in_progress' | 'achieved' | 'missed' | 'paused';
export type BusinessStatus = 'active' | 'validation' | 'paused' | 'closed';
export type BusinessRole = 'cash_engine' | 'validation' | 'growth';
export type ProjectStatus = 'idea' | 'planned' | 'active' | 'paused' | 'completed' | 'cancelled';
export type TaskPriority = 'critical' | 'high' | 'medium' | 'low';
export type TaskStatus = 'todo' | 'in_progress' | 'completed' | 'deferred' | 'cancelled';
export type PillarTag = 'money' | 'build' | 'grow';
export type EnergyLevel = 'high' | 'medium' | 'low';
export type CommitmentStatus = 'committed' | 'in_progress' | 'completed' | 'deferred' | 'cancelled';
export type TimeBlockCategory = 'revenue' | 'strategic' | 'admin' | 'learning' | 'rest';
export type FocusSessionMode = 'normal' | '5min_launch';
export type AccountType = 'personal' | 'business';
export type ObligationPriority = 'urgent' | 'high' | 'medium' | 'low';
export type ObligationStatus = 'pending' | 'partially_paid' | 'settled';
export type PaymentStatus = 'pending' | 'overdue' | 'received' | 'paid';
export type LeadStatus = 'lead' | 'contacted' | 'conversation' | 'qualified' | 'proposal' | 'negotiation' | 'won' | 'completed' | 'lost';
export type KnowledgeType = 'article' | 'book' | 'research' | 'note' | 'idea' | 'insight';
export type ResearchStatus = 'open' | 'in_progress' | 'concluded';
export type EvidenceType = 'supporting' | 'opposing' | 'neutral';
export type AuthorityType = 'article' | 'post' | 'framework' | 'research' | 'case_study';
export type IdeaStatus = 'captured' | 'exploring' | 'validating' | 'active' | 'parked' | 'rejected' | 'completed';
export type DecisionStatus = 'evaluating' | 'approved' | 'rejected' | 'executed';
export type RiskCategory = 'cash' | 'revenue' | 'execution' | 'focus' | 'time' | 'knowledge' | 'reputation' | 'opportunity';
export type RiskLevel = 'low' | 'elevated' | 'high' | 'critical';
export type RiskTrend = 'improving' | 'stable' | 'worsening';
export type NotificationType = 'critical' | 'high' | 'medium' | 'low';
export type RecommendationStatus = 'active' | 'accepted' | 'dismissed';

export interface Profile {
  id: string;
  email: string;
  full_name: string;
  currency: string;
  avatar_url?: string | null;
  timezone: string;
  created_at: string;
  updated_at: string;
}

export interface Cycle {
  id: string;
  user_id: string;
  title: string;
  objective: string;
  start_date: string;
  end_date: string;
  total_days: number;
  status: CycleStatus;
  created_at: string;
  updated_at: string;
}

export interface Phase {
  id: string;
  cycle_id: string;
  user_id: string;
  name: string;
  phase_order: number;
  start_date: string;
  end_date: string;
  focus_summary: string;
  status: PhaseStatus;
  created_at: string;
  updated_at: string;
}

export interface Pillar {
  id: string;
  cycle_id: string;
  user_id: string;
  name: string;
  description?: string | null;
  objective: string;
  priority: number;
  color_hex: string;
  created_at: string;
  updated_at: string;
}

export interface Goal {
  id: string;
  user_id: string;
  cycle_id: string;
  pillar_id?: string | null;
  parent_goal_id?: string | null;
  title: string;
  description?: string | null;
  target_value?: number | null;
  current_value: number;
  unit?: string | null;
  level: GoalLevel;
  start_date: string;
  end_date: string;
  status: GoalStatus;
  created_at: string;
  updated_at: string;
}

export interface Milestone {
  id: string;
  goal_id: string;
  user_id: string;
  title: string;
  target_date: string;
  status: GoalStatus;
  completed_at?: string | null;
  created_at: string;
  updated_at: string;
}

export interface Business {
  id: string;
  user_id: string;
  name: string;
  description?: string | null;
  role: BusinessRole;
  status: BusinessStatus;
  revenue_current: number;
  revenue_target: number;
  color_hex: string;
  created_at: string;
  updated_at: string;
}

export interface Project {
  id: string;
  user_id: string;
  business_id?: string | null;
  pillar_id?: string | null;
  title: string;
  objective: string;
  success_condition: string;
  status: ProjectStatus;
  start_date: string;
  target_date: string;
  expected_value?: string | null;
  estimated_effort?: string | null;
  budget: number;
  created_at: string;
  updated_at: string;
}

export interface Task {
  id: string;
  user_id: string;
  project_id?: string | null;
  goal_id?: string | null;
  pillar_id?: string | null;
  title: string;
  description?: string | null;
  priority: TaskPriority;
  status: TaskStatus;
  pillar_tag: PillarTag;
  estimated_duration?: number | null; // in minutes
  deadline?: string | null;
  why_it_matters?: string | null;
  next_action?: string | null;
  consequence_of_delay?: string | null;
  deferral_count: number;
  energy_required: EnergyLevel;
  is_daily_three: boolean;
  completed_at?: string | null;
  created_at: string;
  updated_at: string;
  // Joins
  project?: Project;
  goal?: Goal;
  pillar?: Pillar;
}

export interface Commitment {
  id: string;
  user_id: string;
  task_id?: string | null;
  goal_id?: string | null;
  title: string;
  deadline: string;
  importance: TaskPriority;
  status: CommitmentStatus;
  created_at: string;
  updated_at: string;
}

export interface FinancialAccount {
  id: string;
  user_id: string;
  name: string;
  account_type: AccountType;
  currency: string;
  balance: number;
  business_id?: string | null;
  created_at: string;
  updated_at: string;
}

export interface IncomeRecord {
  id: string;
  user_id: string;
  account_id?: string | null;
  business_id?: string | null;
  amount: number;
  currency: string;
  source: string;
  category: string;
  record_date: string;
  notes?: string | null;
  created_at: string;
}

export interface ExpenseRecord {
  id: string;
  user_id: string;
  account_id?: string | null;
  business_id?: string | null;
  amount: number;
  currency: string;
  category: string;
  record_date: string;
  notes?: string | null;
  created_at: string;
}

export interface Obligation {
  id: string;
  user_id: string;
  title: string;
  creditor: string;
  amount: number;
  paid_amount: number;
  currency: string;
  due_date: string;
  priority: ObligationPriority;
  status: ObligationStatus;
  notes?: string | null;
  created_at: string;
  updated_at: string;
}

export interface SalesLead {
  id: string;
  user_id: string;
  business_id: string;
  contact_id?: string | null;
  service: string;
  source?: string | null;
  estimated_value: number;
  probability: number;
  status: LeadStatus;
  next_action?: string | null;
  follow_up_date?: string | null;
  notes?: string | null;
  created_at: string;
  updated_at: string;
}

export interface Risk {
  id: string;
  user_id: string;
  title: string;
  category: RiskCategory;
  level: RiskLevel;
  evidence: string;
  trend: RiskTrend;
  cause?: string | null;
  mitigation: string;
  review_date: string;
  created_at: string;
  updated_at: string;
}

export interface DailyReview {
  id: string;
  user_id: string;
  review_date: string;
  completed_actions?: string | null;
  avoided_actions?: string | null;
  money_moved: number;
  built?: string | null;
  learned?: string | null;
  distracted_by?: string | null;
  tomorrow_number_one?: string | null;
  energy_start?: EnergyLevel | null;
  energy_end?: EnergyLevel | null;
  created_at: string;
}

export interface DailyPlan {
  id: string;
  user_id: string;
  plan_date: string;
  north_star: string;
  ai_generated: boolean;
  energy_level: EnergyLevel;
  notes?: string | null;
  created_at: string;
  updated_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  body: string;
  notification_type: NotificationType;
  category?: string | null;
  is_read: boolean;
  action_url?: string | null;
  created_at: string;
}
