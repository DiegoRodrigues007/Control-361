// src/components/SearchInput/index.tsx
import React from "react";

interface SearchInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const SearchInput: React.FC<SearchInputProps> = ({
  label,
  className = "",
  ...rest
}) => (
  <div className="flex flex-col">
    {label && <label className="sr-only">{label}</label>}
    <input
      type="search"
      className={
        `min-w-[240px] px-3 py-2 rounded-lg border border-[#0095e4] ` +
        `bg-[#000f17] text-gray-100 placeholder-gray-400 ` +
        `focus:outline-none focus:ring-2 focus:ring-[#0095e4] ` +
        className
      }
      {...rest}
    />
  </div>
);
