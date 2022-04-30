import Lottie from 'react-lottie-player';
import lottieJson from '../public/assets/developer.json';
import Typewriter from 'typewriter-effect';
import { useTranslations } from "next-intl";

const Hero = () => {
    const t = useTranslations('hero');

    return (
        <section className='hero'>
            <div>
                <h1>
                    <Typewriter
                        onInit={(typewriter) => {
                            typewriter.typeString('Amin Intichev')
                                .changeDelay(50)
                                .start();
                        }}
                    />
                </h1>
                <span className='notice'>a.k.a. webdevamin</span>
            </div>
            <Lottie
                loop
                animationData={lottieJson}
                play
                style={{ maxWidth: '275px', maxHeight: '275px', marginLeft: 'auto', marginRight: 'auto' }}
            />
            <p className='highlight squada_one_font'>
                {t('summary')}
            </p>
        </section>
    )
}

export default Hero;