import Seo from '../../components/Seo'
import Header from "../../components/Header";
import React, { useState } from 'react';
import Hero from '../../components/Hero';
import { gql, GraphQLClient } from 'graphql-request';
import { useTranslations } from "next-intl";

const ListOfFaqs = ({ faqs }) => {
    const [selected, setSelected] = useState(null);

    const handleClick = (index) => {
        if (selected === index) {
            return setSelected(null);
        }

        setSelected(index);
    }

    return (
        <div className='wrapper'>
            <div className="accordion">
                {
                    faqs.map((faq, index) => {
                        const { id, question, answer } = faq;

                        return (
                            <div key={id} className='item' onClick={() => handleClick(index)}>
                                <div className='title'>
                                    <span className='icon'>{selected === index || faqs.length >= 1 ? '-' : '+'}</span>
                                    <h4>{question}</h4>
                                </div>
                                <div className={selected === index || faqs.length >= 1 ? 'content show' : 'content'}
                                    dangerouslySetInnerHTML={{ __html: answer.html }} />
                            </div>
                        )
                    })
                }
            </div>
        </div>
    )
}

const NoFaqs = ({ f }) => {
    return <p className='content'>{f('noFaq')}</p>
}

const Faq = ({ data }) => {
    const f = useTranslations('faq');
    const { faqs } = data;

    return (
        <>
            <Seo title={f('title')} description={f('description')} />
            <Header />
            <Hero title={'FAQ'} titleTwo={f('title')} />
            <main>
                <section>
                    {faqs.length ? <ListOfFaqs faqs={faqs} /> : <NoFaqs f={f} />}
                </section>
            </main>
        </>
    )
}

export default Faq;

export async function getStaticProps({ locale }) {
    const client = new GraphQLClient(process.env.API_URL);

    const query = gql`
    query MyQuery($locale: [Locale!]!) {
      faqs(locales: $locale) {
        id
        answer {
            html
          }
        question
      }
    }
    `

    return {
        props: {
            data: await client.request(query, { locale: [locale] }),
            messages: (await import(`../../lang/${locale}.json`)).default,
        }
    };
}