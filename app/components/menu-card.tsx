import { NavLink } from "@remix-run/react";
import type { ReactNode } from "react";

interface MenuCardProps {
  children?: ReactNode;
  title: string;
  href: string;
}

export default function MenuCard({ title, children, href }: MenuCardProps) {
  return (
    <NavLink
      unstable_viewTransition
      to={href}
      className="active:scale-90 transition-all cursor-pointer shadow-2xl rounded-xl text-slate-700 font-semibold p-2 bg-slate-50 w-80 h-44 text-center flex flex-col items-center justify-center"
    >
      {({ isTransitioning }) => (
        <>
          {children}
          <span
            className="mt-2"
            style={
              isTransitioning ? { viewTransitionName: "card-title" } : undefined
            }
          >
            {title}
          </span>
        </>
      )}
    </NavLink>
  );
}
