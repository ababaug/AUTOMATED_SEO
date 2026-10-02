import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export async function POST(request: Request) {
  try {
    const { projectId } = await request.json()
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (!projectId) {
      return NextResponse.json({ error: 'Missing projectId' }, { status: 400 })
    }

    // Step 1: Verify the user has ownership/editor rights to this project
    // Our RLS policies enforce that a user can only read/update projects they have access to.
    const { data: project, error: fetchError } = await supabase
      .from('projects')
      .select('id, url, status')
      .eq('id', projectId)
      .single()

    if (fetchError || !project) {
      return NextResponse.json({ error: 'Project not found or unauthorized' }, { status: 404 })
    }

    // Step 2: Website Ownership/Management Verification Workflow Stub
    // In a full production implementation, we would HTTP GET project.url and look for a specific meta tag
    // or perform a DNS TXT lookup. For M1, we validate the workflow logic executes securely.
    const isVerifiedLocally = true // stubbed logic

    if (isVerifiedLocally) {
      const { error: updateError } = await supabase
        .from('projects')
        .update({ status: 'verified' })
        .eq('id', projectId)

      if (updateError) {
        return NextResponse.json({ error: 'Failed to update project status' }, { status: 500 })
      }

      return NextResponse.json({ success: true, status: 'verified' })
    }

    return NextResponse.json({ error: 'Verification failed' }, { status: 400 })

  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
