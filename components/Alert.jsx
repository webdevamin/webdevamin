const Alert = ({ title, text, bgColor, classes }) => {
    return (
        <div style={{ backgroundColor: bgColor }}
            className={`p-4 rounded ${classes}`}>
            <div className={`text-white font-bold`}>
                {title}
            </div>
            <p className={`text-white font-semibold 
            drop-shadow-none opacity-100 m-0`}>
                {text}
            </p>
        </div>
    )
}

export default Alert