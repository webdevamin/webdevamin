import React from 'react'
import { destructureCollectionTypeObject } from '../../utils/app'
import CardOne from '../Cards/CardOne'
import BlockLayoutOne from '../Layouts/BlockLayoutOne'
import Heading from '../Heading';

const Testimonials = ({ content, data }) => {
    const { title, text } = content;
    return (
        <BlockLayoutOne title={`testimonials`}>
            <div className={`xl:flex-1`}>
                <Heading title={title} noSubtitle />
                <div dangerouslySetInnerHTML={{ __html: text }} />
            </div>
            <div className={`mt-16 xl:mt-0 flex flex-col gap-12 
                lg:flex-row lg:gap-5`}>
                {
                    data.map((testimonial, index) => {
                        const { letter, name, backgroundColor, review, stars } =
                            destructureCollectionTypeObject(testimonial);

                        return (
                            <CardOne initial={letter} title={name} bgColor={backgroundColor}
                                text={review} key={index} count={stars} />
                        )
                    })
                }
            </div>
        </BlockLayoutOne>
    )
}

export default Testimonials