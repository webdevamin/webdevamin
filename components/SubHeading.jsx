import React from 'react'

const SubHeading = ({ title }) => {
    return (
        <>
            <h3>{title}</h3>
            <hr className="hidden lg:block w-40 border-0 h-1 bg-red-500 mb-6" />
        </>
    )
}

export default SubHeading