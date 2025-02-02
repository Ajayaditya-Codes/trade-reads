import Link from "next/link";
import { TrendingUp } from "lucide-react";

export default function HeroSection() {
  return (
    <div className="relative isolate px-6 pt-14 lg:px-8">
      <div
        aria-hidden="true"
        className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
      >
        <div
          style={{
            clipPath:
              "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
          }}
          className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
        />
      </div>
      <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56">
        <div className="mb-8 flex justify-center">
          <div className="relative rounded-xl text-center font-bold px-1 sm:px-3 py-2 text-sm/6 text-gray-600 dark:text-gray-300 ring-1 ring-gray-900/10 dark:ring-gray-300/10 hover:ring-gray-900/20 hover:dark:ring-gray-300/20">
            Quirk V2 is Here: Smarter, Faster, Better.
          </div>
        </div>
        <div className="text-center">
          <h1 className="text-balance text-6xl sm:text-7xl lg:text-8xl font-semibold tracking-tight">
            the GitHub Automata
          </h1>
          <p className="mt-8 text-pretty text-2xl sm:text-3xl font-medium text-gray-500 dark:text-gray-100">
            Transform your Project Management across GitHub, Slack and Asana
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6 gap-y-6 md:gap-y-0 flex-col md:flex-row">
            <Link
              href="/pricing"
              prefetch={true}
              className="text-xl hover:underline flex flex-row items-center justify-center gap-x-1 border md:border-0 rounded-xl w-[250px] md:w-fit py-2 border-[#8a00c4]"
            >
              Pricing and Plans <TrendingUp size={15} />
            </Link>
          </div>
        </div>
      </div>
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]"
      >
        <div
          style={{
            clipPath:
              "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
          }}
          className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"
        />
      </div>
    </div>
  );
}
