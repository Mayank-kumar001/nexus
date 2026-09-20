import { AchievementForm } from "@/components/dashboard/achievement-form";
import { requireUser } from "@/lib/session";
import { getCentralActivities } from "@/lib/central-records";
import { Info, TrendUp } from "@phosphor-icons/react/dist/ssr";
import { FadeUp, BlurReveal, StaggerContainer, StaggerItem } from "@/components/ui/motion-reveal";

export default async function SubmitPage() {
  const user = await requireUser();
  const activities = await getCentralActivities();

  return (
    <div 
      className="bg-[#0a0f0d] min-h-[calc(100vh-64px)] text-white px-4 pt-10 pb-16 sm:px-6 sm:pt-14 sm:pb-20 -mt-5 -mb-5 sm:-mt-8 sm:-mb-8"
      style={{ 
        width: '100vw', 
        marginLeft: 'calc(-50vw + 50%)'
      }}
    >
      <div className="mx-auto max-w-7xl relative -top-2 sm:-top-4">
        <div className="mb-10">
          <FadeUp delay={0.1}>
            <div className="flex items-center gap-2 text-[10px] font-bold tracking-widest text-[#86efac] uppercase mb-4">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[#111915] border border-[#1a2620]">
                <span className="w-2 h-2 rounded-full bg-[#86efac]"></span>
              </span>
              Record Tool
            </div>
          </FadeUp>
          
          <BlurReveal delay={0.2}>
            <h1 className="font-heading text-4xl sm:text-5xl tracking-tight font-medium text-white mb-4">
              Submit an <span className="text-[#86efac]">Achievement</span>
            </h1>
          </BlurReveal>
          
          <FadeUp delay={0.3}>
            <p className="max-w-2xl text-base text-[#8B9D96]">
              Stop guessing. Instantly record your technical and community contributions.
              Core members verify every submission. Get clarity and optimise your impact.
            </p>
          </FadeUp>
        </div>

        <StaggerContainer delayChildren={0.4} staggerDelay={0.15} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column - Form Sections */}
          <StaggerItem className="lg:col-span-8 flex flex-col gap-6">
            <AchievementForm
              defaultName={user.name}
              defaultDepartment={user.department}
              activities={activities}
            />
          </StaggerItem>

          {/* Right Column - Results/Instructions Panel */}
          <StaggerItem className="lg:col-span-4 sticky top-8 flex flex-col gap-6">
            <div className="bg-[#111915] border border-[#1a2620] rounded-2xl p-6">
              <h2 className="text-xl font-medium text-white mb-6 border-b border-[#1a2620] pb-4">
                Verification Guidelines
              </h2>
              <div className="flex flex-col gap-8">
                <div className="flex flex-col items-center justify-center py-8 text-center border border-dashed border-[#1a2620] rounded-xl bg-[#0a0f0d]">
                  <TrendUp className="w-12 h-12 text-[#1a2620] mb-4" weight="bold" />
                  <p className="text-sm text-[#8B9D96] max-w-[200px]">
                    Fill in the required fields and click "Submit" to record your progress.
                  </p>
                </div>

                <div className="bg-[#0a0f0d] border border-[#1a2620] rounded-xl p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 rounded-full bg-[#86efac]"></div>
                    <h3 className="text-sm font-medium text-white">AI Analysis</h3>
                  </div>
                  <p className="text-xs text-[#8B9D96] leading-relaxed">
                    Nexus solves fragmented tracking with a unified progress platform. Core members will review your proof.
                  </p>
                </div>
              </div>
            </div>
          </StaggerItem>
        </StaggerContainer>
      </div>
    </div>
  );
}
