'use client';

import { useEffect, useState } from 'react';

/*
 * Laadt de type-animatie pas in de browser wanneer een hero titel echt
 * een animatiereeks gebruikt. Gewone titels blijven zonder extra bundle.
 */
const HeroTitleAnimation = ({ sequence }) => {
    const [TypeAnimation, setTypeAnimation] = useState(null);
    const fallbackTitle = Array.isArray(sequence)
        ? sequence.find(item => typeof item === 'string') || ''
        : '';

    useEffect(() => {
        let isMounted = true;

        import('react-type-animation').then((module) => {
            if (isMounted) {
                setTypeAnimation(() => module.TypeAnimation);
            }
        });

        return () => {
            isMounted = false;
        };
    }, []);

    if (!TypeAnimation) {
        return <span className="font_mohave">{fallbackTitle}</span>;
    }

    return (
        <TypeAnimation
            sequence={sequence}
            wrapper="div"
            className="font_mohave"
            cursor={true}
            speed={60}
        />
    );
};

export default HeroTitleAnimation;
