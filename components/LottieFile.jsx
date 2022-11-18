import React, { useEffect, useRef } from 'react'
import Lottie from "lottie-react";

const LottieFile = ({ file, classes }) => {
    const lottieRef = useRef();

    useEffect(() => {
        lottieRef.current.setSpeed(0.5)
    }, []);

    return (
        <Lottie
            lottieRef={lottieRef} loop
            animationData={file}
            className={`w-11/12 md:w-7/12 -mt-12 mb-10 mx-auto 
        md:-mt-28 bg-transparent max-w-2xl ${classes}`}
        />
    )
}

export default LottieFile