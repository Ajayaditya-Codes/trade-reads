import ListingSection from "@/components/global/library/listing/listing-sections";
import RequestsSection from "@/components/global/library/requests-section";
import { Separator } from "@/components/ui/separator";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

export default async function Library() {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  return (
    <div className="mt-24 p-10">
      <h3 className="text-xl/7 font-semibold">
        Hey, {(user.given_name || "") + " " + (user.family_name || "")}!
      </h3>
      <p className="text-base">
        Track your trades, manage your listings, and keep your bookshelf
        organized—all in one place.
      </p>
      <Separator className="my-5" />
      <RequestsSection />
      <Separator className="my-5" />
      <ListingSection />
      <Separator className="my-5" />
    </div>
  );
}
