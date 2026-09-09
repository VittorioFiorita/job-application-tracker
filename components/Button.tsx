import { ButtonHTMLAttributes } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: "primary" | "ghost" | "danger" | "danger-ghost";
    size?: "sm" | "md"
    fullWidth?: boolean
};

const variantClasses: Record<NonNullable<ButtonProps["variant"]>, string> = {
    primary: "bg-accent text-white font-medium hover:opacity-90",
    ghost: "text-foreground/60 hover:text-foreground",
    danger: "bg-stamp-brick text-white font-medium hover:opacity-90", 
        "danger-ghost": "text-stamp-brick hover:opacity-80",
};

const sizeClasses: Record<NonNullable<ButtonProps["size"]>, string> = {
    sm: "text-xs px-3 py-1.5",
    md: "text-sm px-4 py-2"
};

export default function Button({
    variant = "primary",
    size = "md",
    fullWidth = false,
    className = "",
    ...props
}: ButtonProps) {
    return (
        <button 
            className={`rounded-lg disabled:opacity-50 transition-colors ${variantClasses[variant]} ${sizeClasses[size]} ${fullWidth ? "w-full" : ""} ${className}`}
            {...props}
        />
    );
}