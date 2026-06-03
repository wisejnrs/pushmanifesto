"use client";

import Link from "next/link";
import { forwardRef } from "react";
import { cn } from "@/lib/utils";

interface GradientButtonProps {
    href?: string;
    children: React.ReactNode;
    className?: string;
    size?: "sm" | "md" | "lg";
    variant?: "default" | "ghost";
    external?: boolean;
    onClick?: () => void;
    asChild?: boolean;
    [key: string]: any;
}

const GradientButton = forwardRef<HTMLAnchorElement | HTMLButtonElement, GradientButtonProps>(
    ({ href, children, className, size = "md", variant = "default", external = false, onClick, asChild, ...props }, ref) => {
        const sizeClasses = {
            sm: "h-6 px-2 text-xs",
            md: "h-8 px-3 text-xs",
            lg: "h-9 px-4 text-sm"
        };

        const baseClasses = cn(
            "relative flex items-center gap-2 font-medium transition-all duration-500 group overflow-hidden rounded-md",
            "hover:bg-transparent",
            sizeClasses[size as keyof typeof sizeClasses],
            className
        );

        const contentClasses = "relative z-10 transition-all duration-500 group-hover:scale-110 bg-gradient-to-r from-foreground to-foreground bg-clip-text text-transparent group-hover:from-[#FF6B35] group-hover:via-primary group-hover:to-[#D247BF]";
        const backgroundClasses = "absolute inset-0 bg-gradient-to-r from-[#D247BF]/10 via-primary/10 to-[#FF6B35]/10 opacity-0 group-hover:opacity-100 transition-all duration-500 rounded-md";
        const overlayClasses = "absolute inset-0 bg-white/3 opacity-0 group-hover:opacity-100 transition-all duration-500 rounded-md backdrop-blur-sm";

        if (href) {
            if (external) {
                return (
                    <a
                        ref={ref as React.Ref<HTMLAnchorElement>}
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={baseClasses}
                        onClick={onClick}
                        {...props}
                    >
                        <span className={contentClasses}>
                            {children}
                        </span>
                        <div className={backgroundClasses} />
                        <div className={overlayClasses} />
                    </a>
                );
            }

            return (
                <Link
                    ref={ref as React.Ref<HTMLAnchorElement>}
                    href={href}
                    className={baseClasses}
                    onClick={onClick}
                    {...props}
                >
                    <span className={contentClasses}>
                        {children}
                    </span>
                    <div className={backgroundClasses} />
                    <div className={overlayClasses} />
                </Link>
            );
        }

        return (
            <button
                ref={ref as React.Ref<HTMLButtonElement>}
                className={baseClasses}
                onClick={onClick}
                {...props}
            >
                <span className={contentClasses}>
                    {children}
                </span>
                <div className={backgroundClasses} />
                <div className={overlayClasses} />
            </button>
        );
    }
);

GradientButton.displayName = "GradientButton";

export { GradientButton };