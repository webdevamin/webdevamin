
import { Card } from "flowbite-react";

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
    className = ""
}) {
    return (
        <Card className={`max-w-sm ${popular ? 'border-2 border-theme shadow-lg relative transform scale-105' : ''} ${className}`}>
            {popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-theme text-white px-4 py-2 rounded-full text-sm font-semibold">
                        Meest Populair
                    </span>
                </div>
            )}
            <h5 className="mb-4 text-xl font-medium text-gray-500 dark:text-gray-400">
                {title}
            </h5>
            <div className="flex items-baseline text-gray-900 dark:text-white">
                <span className="text-3xl font-semibold">{currency}</span>
                <span className="text-5xl font-extrabold tracking-tight">{price}</span>
                <span className="ml-1 text-xl font-normal text-gray-500 
                dark:text-gray-400">{period}</span>
            </div>
            <ul className="my-7 space-y-3">
                {features.map((feature, index) => (
                    <li key={index} className="flex items-start space-x-3">
                        <svg className="h-5 w-5 shrink-0 text-theme mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span className="text-sm text-gray-700">{feature}</span>
                    </li>
                ))}
                {excludedFeatures.map((feature, index) => (
                    <li key={`excluded-${index}`} className="flex items-start space-x-3 line-through decoration-gray-500">
                        <svg className="h-5 w-5 shrink-0 text-gray-400 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span className="text-sm text-gray-500">{feature}</span>
                    </li>
                ))}
            </ul>
            <a
                href={buttonHref}
                className={`inline-flex w-full justify-center rounded-lg px-5 py-2.5 text-center text-sm font-medium focus:outline-none focus:ring-4 ${popular
                    ? 'bg-theme text-white hover:bg-theme_darker focus:ring-theme/20'
                    : 'border border-theme text-theme hover:bg-theme hover:text-white focus:ring-theme/20'
                    }`}
            >{buttonText}</a>
        </Card>
    );
}
