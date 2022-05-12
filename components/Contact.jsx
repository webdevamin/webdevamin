import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Contact = ({ socials }) => {
    return (
        <section className="contact">
            <h2>Contact</h2>
            <div className="social_links">
                {
                    socials.map((social) => {
                        const { id, iconPrefix, icon, label, text, url } = social;

                        return (
                            <div key={id}>
                                <Link href={url}>
                                    <a rel="noreferrer" target='_blank'>
                                        <FontAwesomeIcon icon={[iconPrefix, icon]} size={'xl'}
                                            aria-label={label} />
                                    </a>
                                </Link>
                                <Link href={url}>
                                    <a rel="noreferrer" target='_blank'>
                                        {text}
                                    </a>
                                </Link>
                            </div>
                        )
                    })
                }
            </div>
        </section>
    )
}

export default Contact;