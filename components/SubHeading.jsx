const SubHeading = ({ title, smallerMarginB = false, center = false }) => {
    return (
        <div className={`${center ? 'text-center' : ''}`}>
            <h3 className={`${smallerMarginB ? 'lg:mb-5' : ''}`}>{title}</h3>
            <hr className={`block w-40 border-0 h-0.5 lg:h-1 bg-red-500 mb-6 ${center ? 'mx-auto' : ''}`} />
        </div>
    )
}

export default SubHeading