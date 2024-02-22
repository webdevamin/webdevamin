import BlockLayoutTwo from '../Layouts/BlockLayoutTwo'
import { Carousel } from "flowbite-react";
import Slide from '../Slide';
import ButtonOne from '../Buttons/ButtonOne';
import Heading from '../Heading';

const Projects = ({ content, data }) => {
    const { title, text, button, slug } = content;
    const { href, text: buttonText } = button[0];

    const projects = data.filter((project) => {
        return project.showcase;
    });

    return (
        <BlockLayoutTwo title={title} slug={slug}>
            <div className={`md:basis-5/12`}>
                <Heading noSubtitle title={title} />
                <div dangerouslySetInnerHTML={{ __html: text }} />
                <ButtonOne href={href} text={buttonText} wFit />
            </div>
            <div className={`mt-10 md:mt-0 md:basis-7/12`}>
                <Carousel indicators={false}>
                    {
                        projects.map((project, i) => {
                            const { img: { src, alt } } = project;

                            return <Slide key={i} src={src} alt={alt} />
                        })
                    }
                </Carousel>
            </div>
        </BlockLayoutTwo>
    )
}

export default Projects