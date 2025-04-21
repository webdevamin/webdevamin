import Header from '../components/Layouts/Header'
import PageLayout from '../components/Layouts/PageLayout'
import Seo from '../components/Seo';
import Heading from '../components/Heading';
import { useRouter } from 'next/router';
import { useState } from 'react';
import Footer from '../components/Layouts/Footer';
import ButtonOne from '../components/Buttons/ButtonOne';
import Alert from '../components/Alert';
import HeroOne from '../components/Heroes/HeroOne';

const initForm = {
    name: ``, email: ``, message: ``
}

const Contact = ({ localesData, socialsData, blogsData, servicesData, regionsData, pagesData, pageData }) => {
    const router = useRouter();

    const [form, setForm] = useState(initForm);
    const [afterSubmit, setAfterSubmit] = useState(null);

    const { seo, alternates, alternateLangs, slug, blocks } = pageData;
    const { title: title4, subtitle, text } = blocks[4];

    const formTexts = {
        name: router.locale === `en` ? `Name` : `Naam`,
        email: router.locale === `en` ? `Email address` : `E-mailadres`,
        message: router.locale === `en` ? `Your message` : `Uw bericht`,
        send: router.locale === `en` ? `Submit` : `Verzenden`,
    }

    const initAfterSubmit = (code) => {
        switch (code) {
            case 400:
                setAfterSubmit(blocks.find(block => block.title === `clienterror`));
                break;
            case 500:
                setAfterSubmit(blocks.find(block => block.title === `servererror`));
                break;
            default:
                setAfterSubmit(blocks.find(block => block.title === `success`));
                break;
        }
    }

    const handleChange = (e) => {
        const { target } = e;
        const { name, value } = target;

        setForm({ ...form, [name]: value });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setAfterSubmit(null);

        const options = {
            method: `POST`,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(form)
        }

        try {
            const res = await fetch(`/api/send`, options);

            if (!res.ok) initAfterSubmit(res.status);
            else await res.json();

            initAfterSubmit(res.status);
        } catch (error) {
            console.error(error)
        }

        setForm(initForm);
    }

    return (
        <>
            <Seo seo={seo} alternates={alternates} includeCompanyName />
            <Header pages={pagesData} alternateLangs={alternateLangs} locales={localesData} />
            <HeroOne content={blocks.find(block => block.slug === `hero`)}
                socials={socialsData} />
            <PageLayout>
                <section id={slug} className={`block_container sm:text-center`}>
                    <Heading title={title4} subtitle={subtitle} />
                    <div className={`mt-7 sm:mt-10 xl:mt-16 max-w-4xl mx-auto`}>
                        <div dangerouslySetInnerHTML={{ __html: text }}
                            className={`${text && `-mt-3 sm:-mt-5 md:-mt-7 lg:-mt-10`}`} />
                        {
                            afterSubmit && (
                                <Alert text={afterSubmit.text} classes={`mt-7 md:mt-10`}
                                    bgColor={afterSubmit.backgroundColor} />
                            )
                        }
                        <form onSubmit={handleSubmit} className={`mt-7 md:mt-10`}>
                            <div className='flex flex-col gap-3 sm:gap-4'>
                                <label>
                                    <input type="text" maxLength="30" required
                                        name='name' placeholder={formTexts.name}
                                        value={form.name} onChange={handleChange}
                                        className={`w-full rounded border-dark 
                                    border-opacity-25 sm:py-3 bg-slate-50`} />
                                </label>
                                <label>
                                    <input type="email" maxLength="90" required
                                        name='email' placeholder={formTexts.email}
                                        value={form.email} onChange={handleChange}
                                        className={`w-full rounded border-dark 
                                    border-opacity-25 sm:py-3 bg-slate-50`} />
                                </label>
                                <label>
                                    <textarea name="message" id="message"
                                        rows="8" value={form.message}
                                        placeholder={formTexts.message}
                                        onChange={handleChange} required
                                        className={`w-full rounded border-dark 
                                    border-opacity-25 sm:py-3 bg-slate-50`} />
                                </label>
                            </div>
                            <ButtonOne input={{ value: formTexts.send }}
                                classes={`w-full sm:w-1/3 md:w-1/4 mt-10 sm:mt-12 
                                sm:flex sm:justify-center`} />
                        </form>
                    </div>
                </section>
                <Footer services={servicesData} blogs={blogsData}
                    socials={socialsData} regions={regionsData} pages={pagesData} />
            </PageLayout>
        </>
    )
}

export default Contact

export async function getStaticProps({ locale }) {
    return {
        props: {
            localesData: (await import(`../lang/${locale}/locales.json`)).default,
            socialsData: (await import(`../lang/${locale}/socials.json`)).default,
            blogsData: (await import(`../lang/${locale}/blogs.json`)).default,
            servicesData: (await import(`../lang/${locale}/services.json`)).default,
            pagesData: (await import(`../lang/${locale}/pages.json`)).default,
            // End global data

            pageData: (await import(`../lang/${locale}/pages/contact.json`)).default,
        },
    }
}