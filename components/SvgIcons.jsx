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

const MessageCircleQuestionIcon = ({
    size,
    height,
    width,
    ...props
}) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size || width || 18}
        height={size || height || 18}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="lucide lucide-message-circle-question"
        {...props}
    >
        <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
        <path d="M12 17h.01" />
    </svg>
);

export { CheckMarkIcon, MessageCircleQuestionIcon }