import React from 'react'
import { Card } from "flowbite-react";
import ButtonThree from './Buttons/ButtonThree';
import { CheckMarkIcon } from './SvgIcons';

const Pricing = () => {
    return (
        <Card className='rounded-none text-dark bg-light shadow-bold_r_md md:shadow-bold_r_lg border md:border-2 border-dark pb-3'>
            <h3 className="text-theme_darker mb-1">Gemiddelde prijs</h3>
            <div className="flex items-baseline text-gray-900 dark:text-white">
                <span className="text-xl lg:text-3xl font-semibold">€</span>
                <span className="text-3xl lg:text-5xl font-extrabold tracking-tight">590</span>
                <span className="ml-1 text-xl font-normal text-gray-500 dark:text-gray-400">excl. BTW</span>
            </div>
            <ul className="my-5 lg:my-7 space-y-5">
                <li className="flex space-x-3">
                    <CheckMarkIcon />
                    <span className="text-sm lg:text-base font-normal leading-tight text-gray-500 dark:text-gray-400">Inleiding</span>
                </li>
                <li className="flex space-x-3">
                    <CheckMarkIcon />
                    <span className="text-sm lg:text-base font-normal leading-tight text-gray-500 dark:text-gray-400">
                        Over ons
                    </span>
                </li>
                <li className="flex space-x-3">
                    <CheckMarkIcon />
                    <span className="text-sm lg:text-base font-normal leading-tight text-gray-500 dark:text-gray-400">Diensten</span>
                </li>
                <li className="flex space-x-3 decoration-gray-500">
                    <CheckMarkIcon />
                    <span className="text-sm lg:text-base font-normal leading-tight text-gray-500">Galerij/Projecten</span>
                </li>
                <li className="flex space-x-3 decoration-gray-500">
                    <CheckMarkIcon />
                    <span className="text-sm lg:text-base font-normal leading-tight text-gray-500">Offerte aanvraag formulier en/of contactformulier</span>
                </li>
                <li className="flex space-x-3 decoration-gray-500">
                    <CheckMarkIcon />
                    <span className="text-sm lg:text-base font-normal leading-tight text-gray-500">Links naar je sociale media platformen</span>
                </li>
                <li className="flex space-x-3 decoration-gray-500">
                    <CheckMarkIcon />
                    <span className="text-sm lg:text-base font-normal leading-tight text-gray-500">Footer (slot)</span>
                </li>
                <li className="flex space-x-3 decoration-gray-500">
                    <CheckMarkIcon />
                    <span className="text-sm lg:text-base font-normal leading-tight text-gray-500">Over 1 week zichtbaar op Google resultaten</span>
                </li>
                <li className="flex space-x-3 decoration-gray-500">
                    <CheckMarkIcon />
                    <span className="text-sm lg:text-base font-normal leading-tight text-gray-500">Domeinnaam koppeling</span>
                </li>
                <li className="flex space-x-3 decoration-gray-500">
                    <CheckMarkIcon />
                    <span className="text-sm lg:text-base font-normal leading-tight text-gray-500">Website online plaatsen (hosten)</span>
                </li>
            </ul>
            <ButtonThree href={`/contact`} text={`Gratis offerte aanvragen`} classes={`underline underline-offset-8 decoration-theme_darker`} />
        </Card>
    )
}

export default Pricing