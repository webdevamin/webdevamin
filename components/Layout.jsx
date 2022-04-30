import Header from "./Header";

const Layout = ({ children }) => {
    return (
        <div className='container'>
            <Header />
            {children}
        </div>
    )
}

export default Layout;