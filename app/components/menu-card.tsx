import { Link } from "@remix-run/react";
import type { ReactNode } from "react";

interface MenuCardProps {
  children?: ReactNode;
  title: string;
  href: string;
}

export default function MenuCard({ title, children, href }: MenuCardProps) {
  return (
    <Link
      to={href}
      className="hover:scale-110 active:scale-100 transition-all cursor-pointer shadow-2xl rounded-xl text-slate-700 font-semibold p-2 bg-slate-50 w-80 h-44 text-center flex flex-col items-center justify-center"
    >
      {children}
      <span className="mt-2">{title}</span>
    </Link>
  );
}
