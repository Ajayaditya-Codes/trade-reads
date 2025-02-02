import SignUp from "./sign-up";

export default function CTASection() {
  return (
    <div className="bg-pink-50 dark:bg-pink-950 rounded-2xl">
      <div className="p-8 md:p-12 lg:px-16 lg:py-24">
        <div className="mx-auto max-w-lg text-center">
          <h2 className="text-3xl font-bold md:text-3xl">
            Start Trading Books Today!{" "}
          </h2>

          <p className="mt-4 text-lg">
            Join a thriving community of book lovers and discover your next
            great read. List your books, browse available trades, and swap
            effortlessly. It’s free, simple, and built for readers like you.{" "}
          </p>
        </div>

        <div className="mx-auto mt-8 max-w-xl flex justify-center">
          <SignUp />
        </div>
      </div>
    </div>
  );
}
