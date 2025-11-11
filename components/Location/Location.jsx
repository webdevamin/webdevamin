import Heading from '../Heading';
import SubHeading from '../SubHeading';
import CtaButton from '../Buttons/CtaButton';
import LocationMap from './LocationMap';
import { MapPin, Phone, Mail } from 'lucide-react';
import BlockLayoutTwo from '../Layouts/BlockLayoutTwo';

const Location = ({ content }) => {
    const { title, subtitle, text, slug, address, city, phone, email, button } = content;

    return (
        <BlockLayoutTwo title={title} slug={slug} position={`left`}>
            <div className='w-full'>
                <div className="mb-12 lg:mb-16 text-left">
                    <Heading title={title} />
                    <SubHeading title={subtitle} />
                    {text && (
                        <div
                            className="mt-6 max-w-4xl text-base md:text-lg leading-relaxed"
                            dangerouslySetInnerHTML={{ __html: text }}
                        />
                    )}
                </div>

                <div className="lg:flex lg:gap-12 xl:gap-16 lg:items-stretch">
                    {/* Map Section */}
                    <div className="lg:w-3/5 xl:w-2/3 h-full">
                        <LocationMap />
                    </div>

                    {/* Contact Info Section */}
                    <div className="mt-8 lg:mt-0 lg:w-2/5 xl:w-1/3">
                        <div className="bg-light rounded-2xl p-6 shadow-md border border-dark xl:border-opacity-10 border-opacity-20">
                            <h4 className="text-lg md:text-2xl font-bold mb-5 font_mohave">
                                Contactgegevens
                            </h4>

                            <div className="space-y-6">
                                {/* Address */}
                                <div className="flex items-start gap-4">
                                    <div className="mt-1 flex-shrink-0">
                                        <MapPin className="h-6 w-6 text-theme" />
                                    </div>
                                    <div>
                                        <h5 className="text-xs md:text-sm font-semibold tracking-wide uppercase text-dark/70 mb-1">Adres</h5>
                                        <p className="text-dark/90 mb-0">{address}</p>
                                        <p className="text-dark/90 mb-0">{city}</p>
                                    </div>
                                </div>

                                {/* Phone */}
                                <div className="flex items-start gap-4">
                                    <div className="mt-1 flex-shrink-0">
                                        <Phone className="h-6 w-6 text-theme" />
                                    </div>
                                    <div>
                                        <h5 className="text-xs md:text-sm font-semibold tracking-wide uppercase text-dark/70 mb-1">Telefoon</h5>
                                        <a
                                            href={`tel:${phone.replace(/\s/g, '')}`}
                                            className="text-dark/90 hover:text-theme transition-colors"
                                        >
                                            {phone}
                                        </a>
                                    </div>
                                </div>

                                {/* Email */}
                                <div className="flex items-start gap-4">
                                    <div className="mt-1 flex-shrink-0">
                                        <Mail className="h-6 w-6 text-theme" />
                                    </div>
                                    <div>
                                        <h5 className="text-xs md:text-sm font-semibold tracking-wide uppercase text-dark/70 mb-1">Email</h5>
                                        <a
                                            href={`mailto:${email}`}
                                            className="text-dark/90 hover:text-theme transition-colors break-all"
                                        >
                                            {email}
                                        </a>
                                    </div>
                                </div>
                            </div>

                            {/* CTA Button */}
                            {button && button.length > 0 && (
                                <div className="mt-7">
                                    {button.map((btn, index) => {
                                        const { href, text } = btn;
                                        return (
                                            <CtaButton
                                                key={index}
                                                href={href}
                                                text={text}
                                                variant="primary"
                                                fullWidth
                                            />
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </BlockLayoutTwo>
    );
};

export default Location;
