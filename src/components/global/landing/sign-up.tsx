"use client";

import { twMerge } from "tailwind-merge";
import { RegisterLink } from "@kinde-oss/kinde-auth-nextjs";

interface SignUpProps {
  classname?: string;
}

const SignUp: React.FC<SignUpProps> = ({ classname }) => {
  return (
    <RegisterLink>
      <button
        className={twMerge(
          "rounded-xl bg-pink-500 px-3 py-2 font-semibold text-white sm:px-5 text-xl md:rounded-2xl md:py-3",
          classname
        )}
      >
        Join Now
      </button>
    </RegisterLink>
  );
};

export default SignUp;
