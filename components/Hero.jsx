import Lottie from 'react-lottie-player';
import lottieJson from '../public/assets/developer.json';

const Hero = () => {
    return (
        <section className='hero'>
            <Lottie
                loop
                animationData={lottieJson}
                className="lottie"
                play
            />
        </section>
    )
}

export default Hero;