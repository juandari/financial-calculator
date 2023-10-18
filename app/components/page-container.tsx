import { NavLink } from "@remix-run/react";
import { ArrowLeft } from "lucide-react";
import type { ReactNode } from "react";

interface PageContainer {
  title: string;
  children: ReactNode;
}

export default function PageContainer({ title, children }: PageContainer) {
  return (
    <div className="py-8 px-6 max-w-[390px] m-auto">
      <div
        className="flex items-center gap-4"
        style={{ viewTransitionName: "card-title" }}
      >
        <NavLink
          unstable_viewTransition
          to=".."
          replace
          className="inline-block"
        >
          <ArrowLeft className="cursor-pointer" color="white" />
        </NavLink>

        <h1 className="text-2xl text-white font-semibold">{title}</h1>
      </div>
      {children}
    </div>
  );
}
