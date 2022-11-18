import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const Icon = ({ icon, size, classes }) => {
    return (
        <FontAwesomeIcon icon={icon} size={size}
            className={`transition-all ease-linear duration-300
            hover:opacity-70 ${classes} hover:rotate-[360deg]`} />
    )
}

export default Icon