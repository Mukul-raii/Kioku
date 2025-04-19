import { SparklesCore } from "@/components/ui/sparkles";

export default function Home() {

  return (
    <div>
      <div className="h-[40rem] relative w-full bg-slate-950 flex flex-col items-center justify-center overflow-hidden rounded-md">
        <div className="w-full absolute inset-0 h-screen">
          <SparklesCore
            id="tsparticlesfullpage"
            background="transparent"
            minSize={0.6}
            maxSize={1.4}
            particleDensity={100}
            className="w-full h-full"
            particleColor="#FFFFFF"
            speed={1}
          />
        </div>
        <h1 className="text-4xl font-bold ">Relearn Less. Retain More.</h1>
        <p>Master anything with AI-powered spaced repetition.</p>
      </div>
    </div>
  );
}
