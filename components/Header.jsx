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
            {/* <input className="menu-btn" type="checkbox" id="menu-btn" />
            <label className="menu-icon" htmlFor="menu-btn">
                <span className="navicon"></span>
            </label>
            <ul className="menu">
                <li>
                    <Link href='/'>
                        <a>Nederlands</a>
                    </Link>
                </li>
                <li>
                    <Link href='/'>
                        <a>Contact</a>
                    </Link>
                </li>
            </ul> */}
        </header>
    );
};

export default Header;