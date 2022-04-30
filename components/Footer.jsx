import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import {
    faGithub,
    faInstagram,
    faLinkedin,
} from '@fortawesome/free-brands-svg-icons';

import {
    faEnvelope, faArrowRightLong
} from '@fortawesome/free-solid-svg-icons';

const Footer = () => {
    return (
        <footer>
            <section>
                <div className="button button_theme">
                    <Link href={'https://docs.google.com/document/d/e/2PACX-1vS9acAxKVHg0eN2LPo5EhQgrXGnL4XaucyoHbnFFiNYgQfGtczrHixNxVtLgU0vI1ILS9J6zflBfvZ4/pub'}>
                        <a rel="noreferrer" target='_blank'>
                            My resume
                        </a>
                    </Link>
                    <FontAwesomeIcon icon={faArrowRightLong} size={'xs'} />
                </div>
            </section>
            <section className="contact">
                <h2>Contact</h2>
                <div className="social_links">
                    <div>
                        <Link href={'mailto:amin.m.intichev@gmail.com'}>
                            <a rel="noreferrer" target='_blank'>
                                <FontAwesomeIcon icon={faEnvelope} size={'xl'} />
                            </a>
                        </Link>
                        <span>amin.m.intichev@gmail.com</span>
                    </div>
                    <div>
                        <Link href={'https://www.instagram.com/webdevamin/'}>
                            <a rel="noreferrer" target='_blank'>
                                <FontAwesomeIcon icon={faInstagram} size={'xl'} />
                            </a>
                        </Link>
                        <span>webdevamin</span>
                    </div>
                    <div>
                        <Link href={'https://www.linkedin.com/in/amin-i-1072391b0/'}>
                            <a rel="noreferrer" target='_blank'>
                                <FontAwesomeIcon icon={faLinkedin} size={'xl'} />
                            </a>
                        </Link>
                        <span>amin-i-1072391b0</span>
                    </div>
                    <div>
                        <Link href={'https://github.com/1chbinamin'}>
                            <a rel="noreferrer" target='_blank'>
                                <FontAwesomeIcon icon={faGithub} size={'xl'} />
                            </a>
                        </Link>
                        <span>1chbinamin</span>
                    </div>
                </div>
            </section>
        </footer>
    );
};

export default Footer;