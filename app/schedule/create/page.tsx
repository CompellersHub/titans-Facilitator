import { DashboardLayout } from "@/components/dashboard-layout"
import { CreateLiveClassForm } from "@/components/schedule/create-live-class-form"

export default function CreateLiveClass() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Schedule Live Class</h1>
          <p className="text-muted-foreground">Create a new live class session for your students</p>
        </div>
        <CreateLiveClassForm />
      </div>
    </DashboardLayout>
  )
}
