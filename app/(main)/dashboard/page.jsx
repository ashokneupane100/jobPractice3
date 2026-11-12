import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import PageHeader from "@/components/reusables";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  getAvailability,
  getInterviewerAppointments,
  getInterviewerStats,
  getWithdrawalHistory,
} from "@/actions/dashboard";
import AvailabilitySection from "./_components/AvailabilitySection";
import AppointmentsSection from "./_components/AppointmentsSection";
import EarningsSection from "./_components/EarningsSection";
import { ClipboardList, Clock, Wallet } from "lucide-react";
import { getCurrentUser } from "@/actions/user";

export default async function InterviewerDashboardPage() {
  const user = await currentUser();
  if (!user) redirect("/");

  const dbUser = await getCurrentUser();
  if (!dbUser) redirect("/onboarding");
  if (dbUser.role === "INTERVIEWEE") redirect("/appointments");

  // Each section fails independently: one slow/broken query should not blank
  // the whole dashboard.
  const [availability, appointments, stats, withdrawalHistory] =
    await Promise.all([
      getAvailability().catch((error) => {
        console.error("[dashboard] availability failed:", error);
        return null;
      }),
      getInterviewerAppointments().catch((error) => {
        console.error("[dashboard] appointments failed:", error);
        return [];
      }),
      getInterviewerStats().catch((error) => {
        console.error("[dashboard] stats failed:", error);
        return null;
      }),

      // Assignment
      getWithdrawalHistory().catch((error) => {
        console.error("[dashboard] withdrawal history failed:", error);
        return [];
      }),
    ]);

  return (
    <main className="min-h-screen bg-black">
      {/* Page header */}
      <PageHeader
        label="Interviewer dashboard"
        gray="Welcome back,"
        gold={dbUser.name?.split(" ")[0] ?? "Interviewer"}
        description={
          dbUser.title && dbUser.company
            ? `${dbUser.title} · ${dbUser.company}`
            : undefined
        }
        right={
          <div>
            <p className="text-xs text-stone-600">Credit balance</p>
            <p className="font-serif text-3xl leading-none bg-linear-to-br from-amber-300 to-amber-500 bg-clip-text text-transparent text-right">
              {stats?.creditBalance ?? 0}
            </p>
          </div>
        }
      />

      {/* Tabbed content */}
      <div className="max-w-6xl mx-auto px-8 py-10">
        <Tabs defaultValue="earnings">
          <TabsList className="bg-[#0f0f11] border border-white/10 mb-8 w-full">
            <TabsTrigger value="earnings" className="p-5">
              <Wallet size={16} className="text-amber-400" /> Earnings
            </TabsTrigger>
            <TabsTrigger value="appointments" className="p-5">
              <ClipboardList size={18} className="text-amber-400" />{" "}
              Appointments
            </TabsTrigger>
            <TabsTrigger value="availability" className="p-5">
              <Clock size={18} className="text-amber-400" /> Availability
            </TabsTrigger>
          </TabsList>

          <TabsContent value="appointments">
            <AppointmentsSection appointments={appointments} />
          </TabsContent>

          <TabsContent value="availability">
            <AvailabilitySection initial={availability} />
          </TabsContent>

          <TabsContent value="earnings">
            <EarningsSection stats={stats} history={withdrawalHistory} />
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}