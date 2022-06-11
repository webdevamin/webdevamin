import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRightLong } from '@fortawesome/free-solid-svg-icons';
import { useTranslations } from "next-intl";
import React from "react";

const About = () => {
    const t = useTranslations('about');

    return (
        <section className='about'>
            <p className='text content'>
                {t('text')} {' '}
            </p>
            <div>
                <div className="button button_theme">
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