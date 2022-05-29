import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRightLong } from '@fortawesome/free-solid-svg-icons';
import { useTranslations } from "next-intl";
import React from "react";
import Typewriter from 'typewriter-effect';

const About = () => {
    const t = useTranslations('about');
    const h = useTranslations('hero');

    return (
        <section className='about'>
            <h1 className="subtitle">{h('welcome')}</h1>
            <p className="grand_title mb-0">{h('iam')}</p>
            <div className="grand_title mt-0">
                <Typewriter
                    options={{
                        strings: [h('role_one'), h('role_two'), h('role_three')],
                        autoStart: true,
                        loop: true,
                        delay: 30,
                        deleteSpeed: 30,
                    }}
                />
            </div>
            <p className='text content'>
                {t('text')} {' '}
                <span className='highlight_sm'>amin.m.intichev@gmail.com</span>
            </p>
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