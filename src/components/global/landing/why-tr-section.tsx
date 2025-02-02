import {
  ArrowLeftRightIcon,
  BookOpenIcon,
  SearchIcon,
  UsersIcon,
} from "lucide-react";

const features = [
  {
    name: "Huge Book Selection",
    description:
      "Access a vast collection of books from other readers. Discover rare finds, bestsellers, and hidden gems.",
    icon: BookOpenIcon,
  },
  {
    name: "Easy & Secure Trading",
    description:
      "Trade books with confidence. Our platform ensures secure and seamless exchanges between users.",
    icon: ArrowLeftRightIcon,
  },
  {
    name: "Find Your Next Read",
    description:
      "Browse books from like-minded readers and request trades instantly. Never run out of great stories!",
    icon: SearchIcon,
  },
  {
    name: "Community-Driven",
    description:
      "Join a passionate community of book lovers. Connect, discuss, and share your favorite reads.",
    icon: UsersIcon,
  },
];

export default function WhyTRSection() {
  return (
    <div className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-lg/7 font-semibold text-pink-500">
            Trade Smarter
          </h2>
          <p className="mt-2 text-4xl font-semibold tracking-tight text-pretty sm:text-5xl lg:text-balance">
            Everything you Need to Exchange Books Effortlessly
          </p>
          <p className="mt-6 text-xl/8">
            Easily list, browse, and trade books with readers in your community.
            Discover new favorites, swap stories, and keep the joy of reading
            alive.
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-2 lg:gap-y-16">
            {features.map((feature) => (
              <div key={feature.name} className="relative pl-16">
                <dt className="text-lg/7 font-semibold">
                  <div className="absolute top-0 left-0 flex size-10 items-center justify-center rounded-lg bg-pink-500">
                    <feature.icon aria-hidden="true" className="size-6 " />
                  </div>
                  {feature.name}
                </dt>
                <dd className="mt-2 text-lg/7">{feature.description}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
}
