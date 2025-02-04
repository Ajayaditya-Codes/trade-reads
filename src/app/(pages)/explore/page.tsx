import BookSection from "@/components/global/explore/book-section";
import { Separator } from "@/components/ui/separator";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

export default async function Explore() {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  return (
    <div className="mt-24 p-10 min-h-[100vh]">
      <h3 className="text-xl/7 font-semibold">
        Hey, {(user.given_name || "") + " " + (user.family_name || "")}!
      </h3>
      <p className="text-base">
        Discover, Request, Exchange – Your Next Great Read Awaits!
      </p>
      <Separator className="my-5" />
      <BookSection />
    </div>
  );
}
