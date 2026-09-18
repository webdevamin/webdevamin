import Heading from '../Heading'
import LineGrid from '../Layouts/LineGrid'

const Stars = ({ count }) => (
    <div className="flex gap-0.5 text-yellow-400" role="img" aria-label={`${count}/5`}>
        {[...Array(count)].map((_, i) => (
            <svg key={i} className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
        ))}
    </div>
);

/*
 * Reviews als vakken gescheiden door lijnen: onder elkaar op gsm en twee naast
 * elkaar vanaf tablet. Toont maximaal vier reviews.
 */
const Testimonials = ({ content }) => {
    const { title, text, testimonials, subtitle } = content;

    return (
        <section>
            <div className="max-w-6xl">
                <Heading title={title} subtitle={subtitle} />
                {text && <div dangerouslySetInnerHTML={{ __html: text }} className={`section_content p`} />}
            </div>
            <LineGrid
                className="mt-8 md:mt-10 xl:mt-12"
                items={testimonials.slice(0, 4)}
                columns={{ md: 2 }}
                getKey={(testimonial) => testimonial.name}
                cellClassName="py-10 lg:py-14"
                renderItem={({ letter, name, backgroundColor, review, stars }) => (
                    <figure className="flex h-full flex-col justify-between gap-8 text-left">
                        <blockquote>
                            <svg className="mb-4 h-8 w-8 text-theme" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                <path d="M9.983 3v7.391c0 5.704-3.731 9.57-8.983 10.609l-.995-2.151c2.432-.917 3.995-3.638 3.995-5.849h-4v-10h9.983zm14.017 0v7.391c0 5.704-3.748 9.571-9 10.609l-.996-2.151c2.433-.917 3.996-3.638 3.996-5.849h-3.983v-10h9.983z" />
                            </svg>
                            <div className="p text-left" dangerouslySetInnerHTML={{ __html: review }} />
                        </blockquote>
                        <figcaption className="flex items-center gap-4 text-left">
                            <div
                                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full font-bold text-dark shadow-bold_r_xs"
                                style={{ backgroundColor: backgroundColor || '#FF4654' }}
                                aria-hidden="true"
                            >
                                {letter || name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                                <div className="font-semibold text-gray-800 text-left">{name}</div>
                                <Stars count={parseInt(stars, 10) || 5} />
                            </div>
                        </figcaption>
                    </figure>
                )}
            />
        </section>
    )
}

export default Testimonials
