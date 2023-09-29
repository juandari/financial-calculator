import type { MetaFunction } from '@remix-run/node';
import { Link } from '@remix-run/react';

export const meta: MetaFunction = () => {
  return [
    { title: 'Financial Calculator' },
    { name: 'description', content: 'List of useful financial calculator' },
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

      <ul className="flex flex-col justify-center items-center h-full mt-10">
        <li>
          <Link
            to="compound-interest"
            className="hover:scale-110 active:scale-100 transition-all cursor-pointer shadow-2xl rounded-xl text-slate-700 font-semibold p-2 bg-slate-50 w-80 h-44 text-center flex flex-col items-center justify-center"
          >
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
            <span className="mt-2">Compound Interest</span>
          </Link>
        </li>
      </ul>
    </div>
  );
}
