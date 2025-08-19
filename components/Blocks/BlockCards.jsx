import BlockLayoutOne from '../Layouts/BlockLayoutOne';
import Heading from '../Heading';

// Lucide React icons
import {
  CalendarDays,
  MapPin,
  Smartphone,
  Search,
  CreditCard,
  Calculator
} from 'lucide-react';

const BlockCards = ({ content }) => {
    const { title, subtitle, text, services } = content;

    return (
        <div className='max-w-7xl mx-auto'>
            <BlockLayoutOne title={title} slug={`services`} includeMaxWidth={false}>
                <div className='lg:-mb-4'>
                    <Heading title={title} subtitle={subtitle} />
                    {text && <div className="max-w-5xl mx-auto mb-8 lg:mb-0"
                        dangerouslySetInnerHTML={{ __html: text }} />}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
                    {services.map((service, index) => (
                        <div
                            key={index}
                            className="flex flex-col items-center text-center shadow-md border 
                            border-dark xl:border-opacity-10 border-opacity-20 rounded-lg sm:rounded-xl lg:rounded-2xl p-4 sm:p-5 lg:p-6 
                            relative justify-center transform transition-all duration-300 hover:scale-105 overflow-hidden"
                            style={{ transitionDelay: `${index * 100}ms` }}
                        >
                            <div className="rounded-full bg-theme bg-opacity-5 p-3 
                            sm:p-4 lg:p-5 mb-3 lg:mb-4">
                                <div className="text-theme_dark">
                                    {service.icon ? (
                                        (() => {
                                          switch(service.icon) {
                                            case 'CalendarDays':
                                              return <CalendarDays className="h-5 w-5 sm:h-7 sm:w-7" />;
                                            case 'MapPin':
                                              return <MapPin className="h-5 w-5 sm:h-7 sm:w-7" />;
                                            case 'Smartphone':
                                              return <Smartphone className="h-5 w-5 sm:h-7 sm:w-7" />;
                                            case 'Search':
                                              return <Search className="h-5 w-5 sm:h-7 sm:w-7" />;
                                            case 'CreditCard':
                                              return <CreditCard className="h-5 w-5 sm:h-7 sm:w-7" />;
                                            case 'Calculator':
                                              return <Calculator className="h-5 w-5 sm:h-7 sm:w-7" />;
                                            default:
                                              return getServiceIcon(service.type || 'default');
                                          }
                                        })()
                                    ) : (
                                        getServiceIcon(service.type || 'default')
                                    )}
                                </div>
                            </div>
                            <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3 
                            text-gray-800 break-words hyphens-auto w-full px-1">
                                {service.title}
                            </h3>
                            <p className="text-sm sm:text-base text-gray-600 break-words">
                                {service.description}</p>
                        </div>
                    ))}
                </div>
            </BlockLayoutOne>
        </div>
    );
};

export default BlockCards;