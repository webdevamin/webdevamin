import Link from "next/link";

const Header = () => {
    return (
        <header>
            <h1 className="logo">
                <Link href='/'>
                    <a>AI</a>
                </Link>
            </h1>
            <Link href='/'>
                <a className="right_a">NL</a>
            </Link>
        </header>
    );
};

export default Header;