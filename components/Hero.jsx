import Lottie from 'react-lottie-player';
import lottieJson from '../public/assets/developer.json';
import Typewriter from 'typewriter-effect';
import { useTranslations } from "next-intl";

const Hero = ({ title, titleTwo, intro }) => {
    const h = useTranslations('hero');

    const TitleTwo = () => {
        if (intro) {
            return (
                <div className="grand_title mt-0_5 title_underline">
                    <Typewriter
                        options={{
                            strings: [h('role_one'), h('role_two'), h('role_three')],
                            autoStart: true,
                            loop: true,
                            delay: 30,
                            deleteSpeed: 30,
                        }}
                    />
                </div>
            )
        }

        return (
            <h1 className='large_title theme_color mt-0_5 title_underline'>{titleTwo}</h1>
        )
    }

    return (
        <section className='hero'>
            <Lottie
                loop
                animationData={lottieJson}
                className="lottie"
                play
            />
            <div className='hero_bottom'>
                <h1 className="subtitle">{h('welcome')}</h1>
                <div className='titles'>
                    <p className="grand_title mb-0">{title ?? h('iam')}</p>
                    <TitleTwo />
                </div>
            </div>
        </section>
    )
}

export default Hero;