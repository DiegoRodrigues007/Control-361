import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: "primary" | "secondary";
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = "primary",
  className = "",
  ...rest
}) => {
  const base = "px-4 py-2 rounded-lg font-medium focus:outline-none";
  const styles =
    variant === "primary"
      ? "bg-[#0095e4] text-white hover:bg-[#0081c4]"
      : "bg-transparent border border-[#0095e4] text-[#0095e4] hover:bg-[#0095e4]/10";

  return (
    <button className={`${base} ${styles} ${className}`} {...rest}>
      {children}
    </button>
  );
};
