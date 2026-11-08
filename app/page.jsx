import { GrayTitle, GoldTitle, SectionLabel } from "@/components/reusables";
import { StarsBackgroundDemo } from "@/components/demo-components-backgrounds-stars";
import {Badge} from "@/components/ui/badge"



export default function Home() {
  return (
    <div className="bg-black overflow-x-hidden">
      {/* Hero */}
      <section className="pt-28 sm:pt-32 relative min-h-screen grid grid-cols-1 lg:grid-cols-5 px-4 sm:px-8 pb-20 overflow-hidden">


        <StarsBackgroundDemo/>
        <div className="col-span-full lg:col-span-3 flex flex-col items-center justify-center text-center lg:rotate-2 ">
          <Badge variant="gold">Powered by AI - Now in Beta</Badge>
          <h1>
            
          </h1>

        </div>


       
      </section>
    </div>
  );
}
