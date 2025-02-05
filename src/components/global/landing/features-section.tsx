import { ArrowLeftRightIcon, BookOpenIcon, SearchIcon } from "lucide-react";
import Image from "next/image";

const features = [
  {
    name: "List your books.",
    description:
      "Add books to your collection and make them available for trade with other readers in the community.",
    icon: BookOpenIcon,
  },
  {
    name: "Browse and request.",
    description:
      "Explore a variety of books listed by other users and request a trade for the ones you love.",
    icon: SearchIcon,
  },
  {
    name: "Seamless exchanges.",
    description:
      "Easily connect with book owners, arrange trades, and swap books effortlessly.",
    icon: ArrowLeftRightIcon,
  },
];

export default function FeaturesSection() {
  return (
    <div className="overflow-hidden py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-2">
          <div className="lg:pt-4 lg:pr-8">
            <div className="lg:max-w-lg">
              <h2 className="text-base/7 font-semibold text-pink-500">
                Trade and Read
              </h2>
              <p className="mt-2 text-4xl font-semibold tracking-tight text-pretty sm:text-5xl">
                A smarter way to exchange books
              </p>
              <p className="mt-6 text-lg">
                Discover, trade, and connect with book lovers in your community.
                Easily swap books, explore new reads, and keep the stories
                flowing.
              </p>
              <dl className="mt-10 max-w-xl space-y-8 text-lg  lg:max-w-none">
                {features.map((feature) => (
                  <div key={feature.name} className="relative pl-9">
                    <dt className="inline font-semibold">
                      <feature.icon
                        aria-hidden="true"
                        className="absolute top-1 left-1 size-5 text-pink-500"
                      />
                      {feature.name}
                    </dt>{" "}
                    <dd className="inline">{feature.description}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
          <Image
            alt="Product screenshot"
            src="https://tailwindui.com/plus/img/component-images/dark-project-app-screenshot.png"
            width={2432}
            height={1442}
            className="w-[48rem] max-w-none rounded-xl ring-1 shadow-xl ring-gray-400/10 sm:w-[57rem] md:-ml-4 lg:-ml-0"
          />
        </div>
      </div>
    </div>
  );
}
