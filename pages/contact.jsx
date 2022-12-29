import Header from '../components/Layouts/Header'
import PageLayout from '../components/Layouts/PageLayout'
import { getData } from '../graphql/api';
import { GET_CONTACTPAGE } from '../graphql/queries';
import { destructureSingleType } from '../utils/app';
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

const Contact = ({ pageData }) => {
    const router = useRouter();
    const [form, setForm] = useState(initForm);
    const [afterSubmit, setAfterSubmit] = useState(null);

    const { data, globalData } = pageData;
    const { blogs, services, socials, navigation, regions } = globalData;
    const { contactpage } = data;

    const { seo, alternates, hero, localepages, form: formBlock, successMessage,
        clientErrorMessage, serverErrorMessage }
        = destructureSingleType(contactpage);

    const { title, subtitle, slug, text } = formBlock;

    const formTexts = {
        name: router.locale === `en` ? `Name` : `Naam`,
        email: router.locale === `en` ? `Email address` : `E-mailadres`,
        message: router.locale === `en` ? `Your message` : `Uw bericht`,
        send: router.locale === `en` ? `Submit` : `Verzenden`,
    }

    const initAfterSubmit = (code) => {
        switch (code) {
            case 400:
                setAfterSubmit(clientErrorMessage);
                break;
            case 500:
                setAfterSubmit(serverErrorMessage);
                break;
            default:
                setAfterSubmit(successMessage);
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

        const response = await fetch(`/api/send`, options);
        const result = await response.json();

        initAfterSubmit(result.code);
        setForm(initForm);
    }

    return (
        <>
            <Seo seo={seo} alternates={alternates} />
            <Header nav={navigation} localepages={localepages} />
            <HeroOne content={hero} socialsRaw={socials} />
            <PageLayout>
                <section id={slug} className={`block_container sm:text-center`}>
                    <Heading title={title} subtitle={subtitle} />
                    <div className={`mt-7 sm:mt-10 xl:mt-16 max-w-4xl mx-auto`}>
                        <div dangerouslySetInnerHTML={{ __html: text }} />
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
                            <div>
                                <ButtonOne input={{ value: formTexts.send }}
                                    classes={`w-full mt-10 sm:mt-12`} />
                            </div>
                        </form>
                    </div>
                </section>
                <Footer servicesRaw={services} blogsRaw={blogs}
                    socialsRaw={socials} regionsRaw={regions} />
            </PageLayout>
        </>
    )
}

export default Contact

export async function getStaticProps({ locale }) {
    const pageData = await getData(GET_CONTACTPAGE, { locale: [locale] });

    return {
        props: { pageData },
    }
}