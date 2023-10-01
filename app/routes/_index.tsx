import type { MetaFunction } from "@remix-run/node";
import MenuCard from "~/components/menu-card";

export const meta: MetaFunction = () => {
  return [
    { title: "Financial Calculator" },
    { name: "description", content: "List of useful financial calculator" },
  ];
};

export default function Index() {
  return (
    <div className="py-8 px-6 max-w-[390px] m-auto">
      <h1 className="text-2xl text-slate-100 font-semibold tracking-wider">
        Financial Calculator
      </h1>
      <p className="text-slate-300 font-light tracking-wide">
        List of useful financial calculator
      </p>

      <ul className="flex flex-col justify-center items-center gap-8 h-full mt-10">
        <li>
          <MenuCard title="Compound Interest" href="compound-interest">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-10 h-10"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </MenuCard>
        </li>
        <li>
          <MenuCard title="Amortization" href="amortization">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-10 h-10"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8.25 21v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21m0 0h4.5V3.545M12.75 21h7.5V10.75M2.25 21h1.5m18 0h-18M2.25 9l4.5-1.636M18.75 3l-1.5.545m0 6.205l3 1m1.5.5l-1.5-.5M6.75 7.364V3h-3v18m3-13.636l10.5-3.819"
              />
            </svg>
          </MenuCard>
        </li>
      </ul>
    </div>
  );
}
