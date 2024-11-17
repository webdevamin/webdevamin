import React from 'react'
import { Card } from "flowbite-react";
import ButtonThree from './Buttons/ButtonThree';

const Pricing = () => {
    return (
        <Card className='max-w-sm rounded-none text-dark bg-light shadow-bold_r_md md:shadow-bold_r_lg border md:border-2 border-dark pb-3'>
            <h3 className="text-theme_darker mb-1">Gemiddelde prijs</h3>
            <div className="flex items-baseline text-gray-900 dark:text-white">
                <span className="text-xl lg:text-3xl font-semibold">€</span>
                <span className="text-3xl lg:text-5xl font-extrabold tracking-tight">590</span>
                <span className="ml-1 text-xl font-normal text-gray-500 dark:text-gray-400">excl. BTW</span>
            </div>
            <ul className="my-5 lg:my-7 space-y-5">
                <li className="flex space-x-3">
                    <svg
                        className="h-5 w-5 shrink-0 text-cyan-600 dark:text-cyan-500"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                        />
                    </svg>
                    <span className="text-sm lg:text-base font-normal leading-tight text-gray-500 dark:text-gray-400">Inleiding</span>
                </li>
                <li className="flex space-x-3">
                    <svg
                        className="h-5 w-5 shrink-0 text-cyan-600 dark:text-cyan-500"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                        />
                    </svg>
                    <span className="text-sm lg:text-base font-normal leading-tight text-gray-500 dark:text-gray-400">
                        Over ons
                    </span>
                </li>
                <li className="flex space-x-3">
                    <svg
                        className="h-5 w-5 shrink-0 text-cyan-600 dark:text-cyan-500"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                        />
                    </svg>
                    <span className="text-sm lg:text-base font-normal leading-tight text-gray-500 dark:text-gray-400">Diensten</span>
                </li>
                <li className="flex space-x-3 decoration-gray-500">
                    <svg
                        className="h-5 w-5 shrink-0 text-gray-400 dark:text-gray-500"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                        />
                    </svg>
                    <span className="text-sm lg:text-base font-normal leading-tight text-gray-500">Galerij/Projecten</span>
                </li>
                <li className="flex space-x-3 decoration-gray-500">
                    <svg
                        className="h-5 w-5 shrink-0 text-gray-400 dark:text-gray-500"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                        />
                    </svg>
                    <span className="text-sm lg:text-base font-normal leading-tight text-gray-500">Offerte aanvraag formulier en/of contactformulier</span>
                </li>
                <li className="flex space-x-3 decoration-gray-500">
                    <svg
                        className="h-5 w-5 shrink-0 text-gray-400 dark:text-gray-500"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                        />
                    </svg>
                    <span className="text-sm lg:text-base font-normal leading-tight text-gray-500">Links naar je sociale media platformen</span>
                </li>
                <li className="flex space-x-3 decoration-gray-500">
                    <svg
                        className="h-5 w-5 shrink-0 text-gray-400 dark:text-gray-500"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                        />
                    </svg>
                    <span className="text-sm lg:text-base font-normal leading-tight text-gray-500">Footer (slot)</span>
                </li>
            </ul>
            <ButtonThree href={`/contact`} text={`Gratis offerte aanvragen`} classes={`underline underline-offset-8 decoration-theme_darker`} />
        </Card>
    )
}

export default Pricing