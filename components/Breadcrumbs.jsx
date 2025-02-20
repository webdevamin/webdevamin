import Link from 'next/link';
import { HiChevronRight } from 'react-icons/hi';

const Breadcrumbs = ({ items }) => {
    return (
        <nav className="flex items-center text-sm md:text-base text-gray-600 mb-6" aria-label="Breadcrumb">
            <ol className="flex items-center flex-wrap gap-2">
                {items.map((item, index) => {
                    const isLast = index === items.length - 1;

                    return (
                        <li key={item.text} className="flex items-center">
                            {isLast ? (
                                <span className="text-theme font-medium flex items-center gap-2">
                                    {item.icon && <span className="text-lg">{item.icon}</span>}
                                    {item.text}
                                </span>
                            ) : (
                                <>
                                    <Link
                                        href={item.link}
                                        className="hover:text-theme transition-colors flex items-center gap-2"
                                    >
                                        {item.icon && <span className="text-lg">{item.icon}</span>}
                                        {item.text}
                                    </Link>
                                    <HiChevronRight className="mx-2 text-gray-400" />
                                </>
                            )}
                        </li>
                    );
                })}
            </ol>
        </nav>
    );
};

export default Breadcrumbs;
