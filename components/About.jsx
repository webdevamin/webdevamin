import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRightLong } from '@fortawesome/free-solid-svg-icons';
import { useTranslations } from "next-intl";
import React from "react";

const About = () => {
    const t = useTranslations('about');

    return (
        <section className='about'>
            <div className='content'>
                <h2>{t('title')}</h2>
                <p className='text'>
                    {t('text')} {' '}
                    <span className='highlight_sm'>amin.m.intichev@gmail.com</span>
                </p>
            </div>
            <div>
                <div className="button button_theme_two">
                    <Link href={t('resume.link')}>
                        <a rel="noreferrer" target='_blank'>
                            <span>{t('resume.text')}</span>
                            <FontAwesomeIcon icon={faArrowRightLong} size={'xs'} />
                        </a>
                    </Link>
                </div>
            </div>
        </section>
    )
}

export default About;