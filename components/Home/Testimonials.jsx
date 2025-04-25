import Heading from '../Heading'
import CardOne from '../Cards/CardOne'

const Testimonials = ({ content }) => {
    const { title, text, testimonials, subtitle } = content;

    return (
        <section className={`4xl:pr-5 4xl:pl-12`} aria-labelledby="testimonials-title">
            <div className="max-w-6xl mr-auto">
                <div className="flex flex-col">
                    <Heading title={title} subtitle={subtitle} />
                    <div
                        dangerouslySetInnerHTML={{ __html: text }}
                        className={`p`}
                    />
                </div>

                <div className="mt-8 lg:mt-12 flex flex-col gap-10 lg:gap-14">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-8">
                        {testimonials.slice(0, 2).map((testimonial, i) => {
                            const { letter, name, backgroundColor, review, stars, icon = {} } = testimonial;

                            return (
                                <article
                                    key={i}
                                    className="transform transition-all duration-500 hover:-translate-y-1.5 h-full flex"
                                >
                                    <div className="flex-1 flex flex-col">
                                        <CardOne
                                            initial={letter}
                                            title={name}
                                            bgColor={backgroundColor || "#FF4654"}
                                            text={review}
                                            count={stars}
                                            icon={icon}
                                        />
                                    </div>
                                </article>
                            );
                        })}
                    </div>

                    {/* Second row */}
                    {testimonials.length > 2 && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-8">
                            {testimonials.slice(2, 4).map((testimonial, i) => {
                                const { letter, name, backgroundColor, review, stars, icon = {} } = testimonial;

                                return (
                                    <article
                                        key={i + 2}
                                        className="transform transition-all duration-500 hover:-translate-y-1.5 h-full flex"
                                    >
                                        <div className="flex-1 flex flex-col">
                                            <CardOne
                                                initial={letter}
                                                title={name}
                                                bgColor={backgroundColor || "#FF4654"}
                                                text={review}
                                                count={stars}
                                                icon={icon}
                                            />
                                        </div>
                                    </article>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </section>
    )
}

export default Testimonials