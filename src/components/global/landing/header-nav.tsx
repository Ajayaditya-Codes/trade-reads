import Image from "next/image";
import SignUp from "./sign-up";
import Link from "next/link";

export default function HeaderNav() {
  return (
    <div className="z-50 fixed top-0 flex flex-row justify-between items-center bg-transparent p-5 lg:px-10 px-3 md:px-5 w-[100vw] backdrop-blur-md">
      <Link href="/" prefetch={true}>
        <div className="flex flex-row items-center justify-center gap-x-3">
          <Image
            src={"/logo.svg"}
            alt="logo"
            width={50}
            height={50}
            className="rounded-2xl"
          />
          <h3 className="hidden md:flex text-3xl -ml-2 font-semibold">
            Trade Reads
          </h3>
          <h3 className="md:hidden flex text-3xl -ml-2 font-semibold">
            TReads
          </h3>
        </div>
      </Link>
      <SignUp />
    </div>
  );
}
