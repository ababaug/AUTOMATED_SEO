-- Create Enums
CREATE TYPE user_role AS ENUM ('owner', 'editor', 'viewer');
CREATE TYPE verification_status AS ENUM ('unverified', 'verified', 'failed');
CREATE TYPE entitlement_status AS ENUM ('trial', 'premium', 'canceled', 'expired');

-- Organizations
CREATE TABLE organizations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Memberships
CREATE TABLE memberships (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    role user_role NOT NULL DEFAULT 'owner',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (organization_id, user_id)
);

-- Projects
CREATE TABLE projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    url TEXT NOT NULL,
    status verification_status NOT NULL DEFAULT 'unverified',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Entitlements
CREATE TABLE entitlements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    plan_id TEXT NOT NULL,
    status entitlement_status NOT NULL DEFAULT 'trial',
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(organization_id)
);

-- Updated_at Trigger Function
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply Triggers
CREATE TRIGGER set_organizations_updated_at BEFORE UPDATE ON organizations FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER set_memberships_updated_at BEFORE UPDATE ON memberships FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER set_projects_updated_at BEFORE UPDATE ON projects FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER set_entitlements_updated_at BEFORE UPDATE ON entitlements FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- Row Level Security (RLS)
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE entitlements ENABLE ROW LEVEL SECURITY;

-- Helper to check if a user is a member of an organization
CREATE OR REPLACE FUNCTION auth.is_org_member(org_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.memberships
    WHERE organization_id = org_id AND user_id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Helper to check if a user is an owner of an organization
CREATE OR REPLACE FUNCTION auth.is_org_owner(org_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.memberships
    WHERE organization_id = org_id AND user_id = auth.uid() AND role = 'owner'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Organization Policies
CREATE POLICY "Users can view their organizations"
ON organizations FOR SELECT
USING (auth.is_org_member(id));

CREATE POLICY "Owners can update their organizations"
ON organizations FOR UPDATE
USING (auth.is_org_owner(id));

CREATE POLICY "Authenticated users can create organizations"
ON organizations FOR INSERT
WITH CHECK (auth.uid() IS NOT NULL);

-- Membership Policies
CREATE POLICY "Users can view memberships in their organizations"
ON memberships FOR SELECT
USING (auth.is_org_member(organization_id));

CREATE POLICY "Owners can manage memberships"
ON memberships FOR ALL
USING (auth.is_org_owner(organization_id));

-- Projects Policies
CREATE POLICY "Users can view projects in their organizations"
ON projects FOR SELECT
USING (auth.is_org_member(organization_id));

-- Helper to check if a user is an editor or owner
CREATE OR REPLACE FUNCTION auth.is_org_editor_or_owner(org_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.memberships
    WHERE organization_id = org_id AND user_id = auth.uid() AND role IN ('owner', 'editor')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE POLICY "Editors and Owners can insert projects"
ON projects FOR INSERT
WITH CHECK (auth.is_org_editor_or_owner(organization_id));

CREATE POLICY "Editors and Owners can update projects"
ON projects FOR UPDATE
USING (auth.is_org_editor_or_owner(organization_id));

CREATE POLICY "Editors and Owners can delete projects"
ON projects FOR DELETE
USING (auth.is_org_editor_or_owner(organization_id));

-- Entitlements Policies
CREATE POLICY "Users can view entitlements in their organizations"
ON entitlements FOR SELECT
USING (auth.is_org_member(organization_id));

CREATE POLICY "Service role can manage entitlements"
ON entitlements FOR ALL
USING (current_setting('role') = 'service_role' OR auth.jwt() ->> 'role' = 'service_role');

-- Onboarding Function (Bypasses RLS to setup the tenant foundation safely)
CREATE OR REPLACE FUNCTION public.create_organization(org_name text)
RETURNS UUID AS $$
DECLARE
  new_org_id UUID;
BEGIN
  -- Insert organization
  INSERT INTO public.organizations (name)
  VALUES (org_name)
  RETURNING id INTO new_org_id;

  -- Insert membership for current user as owner
  INSERT INTO public.memberships (organization_id, user_id, role)
  VALUES (new_org_id, auth.uid(), 'owner');

  -- Insert trial entitlement
  INSERT INTO public.entitlements (organization_id, plan_id, status)
  VALUES (new_org_id, 'trial_plan', 'trial');

  RETURN new_org_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
