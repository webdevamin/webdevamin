'use client'

import { Card } from "flowbite-react";
import CtaButton from "../Buttons/CtaButton";
import { useLocale } from 'next-intl';

export function PricingCard({
    title,
    price,
    currency = "€",
    period = "/maand",
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
        <Card className={`flex flex-col h-full ${popular ? 'border-2 border-theme shadow-lg transform lg:scale-105' : ''} ${className}`}>
            <div className="flex-grow">
                <div className={`flex items-center ${popular ? 'justify-between' : 'justify-end'} mb-4`}>
                    {popular && (
                        <span className="bg-theme text-white px-3 py-1 rounded-full text-xs font-semibold mr-3">
                            Meest Populair
                        </span>
                    )}
                    <h5 className="text-xl font-medium text-gray-500 dark:text-gray-400">
                        {title}
                    </h5>
                </div>
                <div className="flex items-baseline text-gray-900 dark:text-white">
                    <span className="text-3xl font-semibold">{currency}</span>
                    <span className="text-5xl font-extrabold tracking-tight">{price}</span>
                    <span className="ml-1 text-xl font-normal text-gray-500 dark:text-gray-400">
                        {period}
                    </span>
                </div>
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
                            <span className="text-sm text-gray-700 text-left" dangerouslySetInnerHTML={{ __html: feature }}></span>
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
