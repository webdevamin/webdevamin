import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import {
    faGithub,
    faInstagram,
    faLinkedin,
} from '@fortawesome/free-brands-svg-icons';

import { faEnvelope } from '@fortawesome/free-solid-svg-icons';

const Footer = () => {
    return (
        <footer>
            <section>
                <Link href={'https://docs.google.com/document/d/e/2PACX-1vS9acAxKVHg0eN2LPo5EhQgrXGnL4XaucyoHbnFFiNYgQfGtczrHixNxVtLgU0vI1ILS9J6zflBfvZ4/pub'}>
                    <a className="button button_theme" rel="noreferrer" target='_blank'>
                        My resume
                    </a>
                </Link>
            </section>
            <section className="social_links">
                <Link href={'mailto:amin.m.intichev@gmail.com'}>
                    <a rel="noreferrer" target='_blank'>
                        <FontAwesomeIcon icon={faEnvelope} size={'2xl'} />
                    </a>
                </Link>
                <Link href={'https://www.instagram.com/webdevamin/'}>
                    <a rel="noreferrer" target='_blank'>
                        <FontAwesomeIcon icon={faInstagram} size={'2xl'} />
                    </a>
                </Link>
                <Link href={'https://www.linkedin.com/in/amin-i-1072391b0/'}>
                    <a rel="noreferrer" target='_blank'>
                        <FontAwesomeIcon icon={faLinkedin} size={'2xl'} />
                    </a>
                </Link>
                <Link href={'https://github.com/1chbinamin'}>
                    <a rel="noreferrer" target='_blank'>
                        <FontAwesomeIcon icon={faGithub} size={'2xl'} />
                    </a>
                </Link>
            </section>
        </footer>
    );
};

export default Footer;