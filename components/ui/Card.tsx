import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface CardProps {
    imageSrc: string;
    title: string;
    subtitle?: string;
    href: string;
    variant?: "default" | "overlay" | "icon";
    children?: React.ReactNode;
}

export function Card({
    imageSrc,
    title,
    subtitle,
    href,
    variant = "default",
    children,
}: CardProps) {
    if (variant === "overlay") {
        return (
            <Link href={href} className="group relative block w-full h-[400px] overflow-hidden">
                <Image
                    src={imageSrc}
                    alt={title}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

                <div className="absolute bottom-0 left-0 p-8 w-full">
                    <h3 className="typ-h3 text-white mb-2">{title}</h3>
                    {subtitle && (
                        <p className="text-neutral-300 text-base mb-4">{subtitle}</p>
                    )}
                    <div className="flex items-center text-white text-sm font-medium uppercase tracking-wide opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                        Discover <ArrowRight className="ml-2 w-4 h-4" />
                    </div>
                </div>
            </Link>
        );
    }

    return (
        <Link href={href} className="group block bg-white border border-neutral-200 hover:border-neutral-300 hover:shadow-sm transition-all">
            <div className="relative w-full aspect-16/10 overflow-hidden">
                <Image
                    src={imageSrc}
                    alt={title}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
            </div>
            <div className="p-6 space-y-3">
                {subtitle && (
                    <p className="typ-label text-neutral-400">{subtitle}</p>
                )}
                <h3 className="typ-h3 text-neutral-900 group-hover:text-primary transition-colors">
                    {title}
                </h3>
                {children && (
                    <div className="text-neutral-500 text-sm leading-relaxed line-clamp-3">
                        {children}
                    </div>
                )}
            </div>
        </Link>
    );
}
