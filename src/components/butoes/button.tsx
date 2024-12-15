import { ReactNode } from "react";

interface ButtonSendInterface {
  children: ReactNode;
  type: "button" | "submit" | "reset" | undefined;
}

export const ButtonSend = ({ children, type }: ButtonSendInterface) => {
  return (
    <button
      className="bg-darkBlue w-full text-white p-5 text-3xl mt-10 rounded-xl hover:bg-white/0 hover:border-2 hover:transition-all transition-all"
      type={type}
    >
      {children}
    </button>
  );
};