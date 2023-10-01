import { Link } from "@remix-run/react";
import { ArrowLeft } from "lucide-react";
import type { ReactNode } from "react";

interface PageContainer {
  title: string;
  children: ReactNode;
}

export default function PageContainer({ title, children }: PageContainer) {
  return (
    <div className="py-8 px-6 max-w-[390px] m-auto">
      <Link to=".." replace className="inline-block">
        <ArrowLeft className="cursor-pointer" color="white" />
      </Link>

      <h1 className="text-2xl text-white font-semibold mt-4">{title}</h1>
      {children}
    </div>
  );
}
