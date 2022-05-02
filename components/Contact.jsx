import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faGithub,
    faInstagram,
    faLinkedin,
    faFacebook
} from '@fortawesome/free-brands-svg-icons';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';

const Contact = () => {
    return (
        <section className="contact">
            <h2>Contact</h2>
            <div className="social_links">
                <div>
                    <Link href={'mailto:amin.m.intichev@gmail.com'}>
                        <a rel="noreferrer" target='_blank'>
                            <FontAwesomeIcon icon={faEnvelope} size={'xl'}
                                aria-label="Contact by email" />
                        </a>
                    </Link>
                    <Link href={'mailto:amin.m.intichev@gmail.com'}>
                        <a rel="noreferrer" target='_blank'>
                            amin.m.intichev@gmail.com
                        </a>
                    </Link>
                </div>
                <div>
                    <Link href={'https://www.instagram.com/webdevamin/'}>
                        <a rel="noreferrer" target='_blank'>
                            <FontAwesomeIcon icon={faInstagram} size={'xl'}
                                aria-label="Contact by using Instagram" />
                        </a>
                    </Link>
                    <Link href={'https://www.instagram.com/webdevamin/'}>
                        <a rel="noreferrer" target='_blank'>
                            webdevamin
                        </a>
                    </Link>
                </div>
                <div>
                    <Link href={'https://www.facebook.com/webdevamin'}>
                        <a rel="noreferrer" target='_blank'>
                            <FontAwesomeIcon icon={faFacebook} size={'xl'}
                                aria-label="Check my GitHub profile" />
                        </a>
                    </Link>
                    <Link href={'https://www.facebook.com/webdevamin'}>
                        <a rel="noreferrer" target='_blank'>
                            webdevamin
                        </a>
                    </Link>
                </div>
                <div>
                    <Link href={'https://www.linkedin.com/in/amin-i-1072391b0/'}>
                        <a rel="noreferrer" target='_blank'>
                            <FontAwesomeIcon icon={faLinkedin} size={'xl'}
                                aria-label="Contact by using LinkedIn" />
                        </a>
                    </Link>
                    <Link href={'https://www.linkedin.com/in/amin-i-1072391b0/'}>
                        <a rel="noreferrer" target='_blank'>
                            Amin Intichev
                        </a>
                    </Link>
                </div>
                <div>
                    <Link href={'https://github.com/1chbinamin'}>
                        <a rel="noreferrer" target='_blank'>
                            <FontAwesomeIcon icon={faGithub} size={'xl'}
                                aria-label="Check my GitHub profile" />
                        </a>
                    </Link>
                    <Link href={'https://github.com/1chbinamin'}>
                        <a rel="noreferrer" target='_blank'>
                            1chbinamin
                        </a>
                    </Link>
                </div>
            </div>
        </section>
    )
}

export default Contact;