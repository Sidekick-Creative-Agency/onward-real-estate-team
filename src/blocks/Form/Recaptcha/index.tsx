"use client";
import { usePathname } from "next/navigation";
import Script from "next/script";
import { useEffect, useId, useRef } from "react";
import { UseFormRegister } from "react-hook-form";

declare global {
    const grecaptcha: {
        enterprise: {
            ready: (cb: () => void) => void;
            execute: (
                siteKey: string,
                options: { action: string }
            ) => Promise<string>;
        };
    };
}
interface Props {
    action: string;
    setToken: (token: string) => void;
    register: UseFormRegister<Record<string, any>>;
}

export function Recaptcha({ action, setToken, register }: Props) {
    const id = useId()
    const pathname = usePathname()
    const executeRecaptcha = () => {
        if (typeof grecaptcha !== "undefined") {
            grecaptcha.enterprise.ready(async () => {
                try {
                    const token = await grecaptcha.enterprise.execute(
                        process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || '',
                        { action }
                    );
                    setToken(token)
                } catch (e) {
                    console.error("Recaptcha error", e);
                }
            });
        }
    };

    useEffect(() => {
        executeRecaptcha()
    }, [typeof grecaptcha, pathname])

    return (
        <>
            <Script
                src={`https://www.google.com/recaptcha/enterprise.js?render=${process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}&badge=bottomleft`}
                strategy="afterInteractive"
            />
            <input type="hidden" id={`recaptcha-token_${id}`} {...register('recaptchaToken')} />
        </>
    );
}