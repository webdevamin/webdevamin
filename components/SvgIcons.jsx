import React from "react";

const CheckMarkIcon = ({
    size,
    height,
    width,
    ...props
}) => (
    <svg
        className="shrink-0 text-cyan-600 dark:text-cyan-500 fill-green-500" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" {...props} width={size || height || 18} height={size || height || 18}>
        <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
            clipRule="evenodd"
        />
    </svg>
);


export { CheckMarkIcon }