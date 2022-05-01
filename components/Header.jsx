import Link from "next/link";
import { useTranslations } from "next-intl";

const Header = () => {
    const t = useTranslations('header');

    return (
        <header>
            <h1 className="logo">AI</h1>
            <Link href={'/'} locale={t('lang.switchLangLink')}>
                <a className="right_a">{t('lang.switchLangText')}</a>
            </Link>
        </header>
    );
};

export default Header;