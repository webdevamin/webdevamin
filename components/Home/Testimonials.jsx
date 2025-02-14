import CardOne from '../Cards/CardOne'
import BlockLayoutOne from '../Layouts/BlockLayoutOne'
import Heading from '../Heading';

const Testimonials = ({ content }) => {
    const { title, text, testimonials } = content;

    return (
        <BlockLayoutOne slug={`testimonials`}>
            <div className={`xl:flex-1`}>
                <Heading title={title} noSubtitle />
                <div dangerouslySetInnerHTML={{ __html: text }} />
            </div>
            <div className={`mt-16 xl:mt-0 flex flex-col gap-12 
                lg:flex-row lg:gap-5`}>
                {
                    testimonials.map((testimonial, i) => {
                        const { letter, name, backgroundColor, review, stars } = testimonial;

                        return (
                            <CardOne initial={letter} title={name} bgColor={backgroundColor} text={review} key={i} count={stars} />
                        )
                    })
                }
            </div>
        </BlockLayoutOne>
    )
}

export default Testimonials