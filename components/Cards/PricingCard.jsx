'use client'

import { Card } from "flowbite-react";
import CtaButton from "../Buttons/CtaButton";
import { useLocale } from 'next-intl';

/*
 * Toont een pricing card met optionele positioneringsteksten zoals badge,
 * tagline, microcopy en groeilabels zodat elk pakket duidelijk zijn rol krijgt.
 */
export function PricingCard({
    title,
    price,
    currency = "€",
    period = "/maand",
    tagline,
    microcopy,
    badge,
    limitLabel,
    description,
    features = [],
    excludedFeatures = [],
    buttonText = "Kies pakket",
    buttonHref = "/contact",
    popular = false,
    className = "",
    phoneHref = "tel:+32470930916",
    phoneLabel = "Of Bel Nu!"
}) {
    const locale = useLocale();
    const isDutch = locale === 'nl';

    return (
        <Card
            className={`flex flex-col h-full rounded-3xl border transition-all duration-300 ${popular
                ? 'border-2 border-theme bg-white shadow-2xl lg:-translate-y-3'
                : 'border-gray-200 bg-white shadow-md hover:shadow-xl'
                } ${className}`}
        >
            <div className="flex-grow">
                <div className="mb-6 flex min-h-[2rem] items-center justify-between gap-3">
                    <h5 className="text-xl font-semibold text-slate-900">
                        {title}
                    </h5>
                    {badge && (
                        <span className="rounded-full bg-theme px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-white">
                            {badge}
                        </span>
                    )}
                </div>
                {tagline && (
                    <p className="mb-5 min-h-[3rem] text-sm leading-6 text-slate-600">
                        {tagline}
                    </p>
                )}
                <div className="mb-5 flex items-end gap-1 text-slate-900">
                    <span className="text-2xl font-semibold">{currency}</span>
                    <span className="text-5xl font-extrabold tracking-tight">{price}</span>
                    <span className="mb-1 ml-1 text-sm font-medium text-slate-500 sm:text-base">
                        {period}
                    </span>
                </div>
                {microcopy && (
                    <p className="mb-5 rounded-2xl border border-theme/20 bg-theme/5 px-4 py-3 text-sm font-medium leading-6 text-theme_darker">
                        {microcopy}
                    </p>
                )}
                {limitLabel && (
                    <div className="mb-5">
                        <span className="inline-flex rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-emerald-700">
                            {limitLabel}
                        </span>
                    </div>
                )}
                {description && (
                    <p className="mb-5 text-sm leading-6 text-slate-600">
                        {description}
                    </p>
                )}
                <ul className="my-7 space-y-3">
                    {features.map((feature, index) => (
                        <li key={index} className="flex items-start space-x-3">
                            <svg className="h-5 w-5 shrink-0 text-theme mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                <path
                                    fillRule="evenodd"
                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                    clipRule="evenodd"
                                />
                            </svg>
                            <span className="text-left text-sm leading-6 text-slate-700" dangerouslySetInnerHTML={{ __html: feature }}></span>
                        </li>
                    ))}
                    {excludedFeatures.map((feature, index) => (
                        <li key={`excluded-${index}`} className="flex items-start space-x-3 line-through decoration-gray-500">
                            <svg className="h-5 w-5 shrink-0 text-gray-400 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                <path
                                    fillRule="evenodd"
                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                    clipRule="evenodd"
                                />
                            </svg>
                            <span className="text-sm text-gray-500" dangerouslySetInnerHTML={{ __html: feature }}></span>
                        </li>
                    ))}
                </ul>
            </div>
            <CtaButton
                href={buttonHref}
                text={buttonText}
                variant={popular ? 'primary' : 'outline'}
                fullWidth
            />
            {isDutch && (
                <CtaButton
                    href={phoneHref}
                    text={phoneLabel}
                    variant="neutral"
                    fullWidth
                    ariaLabel={phoneLabel}
                />
            )}
        </Card>
    );
}
