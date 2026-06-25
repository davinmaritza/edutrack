import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { ExamRunner } from "@/components/dashboard/exam-runner"

export default async function ExamDetailPage({ params }: { params: { id: string } }) {
  const session = await auth()
  if (!session) redirect("/login")

  const role = (session.user as any)?.role
  if (role !== 'STUDENT') redirect("/dashboard")

  const { id } = await params

  return (
    <div className="min-h-screen">
      <ExamRunner examId={id} />
    </div>
  )
}
