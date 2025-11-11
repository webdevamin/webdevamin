import { Link } from '../../src/i18n/navigation'

const CtaButton = ({
    href = '#',
    text = '',
    variant = 'primary',
    fullWidth = true,
    className = '',
    target,
    rel,
    ariaLabel,
    title,
}) => {
    const isExternal = href?.startsWith('http') || href?.startsWith('tel:') || href?.startsWith('mailto:');

    const base = 'inline-flex justify-center rounded-lg px-5 py-2.5 text-center text-sm font-medium focus:outline-none focus:ring-4 transition-colors';
    const width = fullWidth ? 'w-full' : 'w-fit';

    const variants = {
        primary: 'bg-theme text-white hover:bg-theme_darker focus:ring-theme/20',
        outline: 'border border-theme text-theme hover:bg-theme hover:text-white focus:ring-theme/20',
        neutral: 'border border-gray-300 text-gray-700 hover:bg-gray-100 focus:ring-gray-200',
    };

    const classes = `${base} ${width} ${variants[variant] || variants.primary} ${className}`.trim();

    if (isExternal) {
        return (
            <a
                href={href}
                className={classes}
                target={target}
                rel={rel}
                aria-label={ariaLabel}
                title={title}
            >
                {text}
            </a>
        );
    }

    return (
        <Link href={href} className={classes} aria-label={ariaLabel} title={title}>
            {text}
        </Link>
    );
};

export default CtaButton;
