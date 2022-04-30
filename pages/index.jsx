import Seo from '../components/Seo'
import Lottie from 'react-lottie-player';
import lottieJson from '../public/assets/developer.json';
import Typewriter from 'typewriter-effect';
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import {
  faGithub,
  faInstagram,
  faLinkedin,
} from '@fortawesome/free-brands-svg-icons';

import { faArrowRightLong, faEnvelope } from '@fortawesome/free-solid-svg-icons';

const Index = () => {
  return (
    <>
      <Seo />
      <main>
        <section className='hero'>
          <div className='hero'>
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
            style={{ width: '275px', height: '275px', marginLeft: 'auto', marginRight: 'auto' }}
          />
          <p className='highlight squada_one_font'>
            I&apos;m a software developer from Bruges.
          </p>
        </section>
        <section className='about'>
          <div className='content'>
            <h2>Who am I</h2>
            <p className='text'>
              I make full fledged, state-of-art websites and apps with focus on
              your needs. Worked in various IT companies, possessing
              advanced development knowledge. Any questions? Contact me on {' '}
              <span className='highlight_sm'>amin.m.intichev@gmail.com</span>
            </p>
          </div>
          <div>
            <div className="button button_theme">
              <Link href={'https://docs.google.com/document/d/e/2PACX-1vS9acAxKVHg0eN2LPo5EhQgrXGnL4XaucyoHbnFFiNYgQfGtczrHixNxVtLgU0vI1ILS9J6zflBfvZ4/pub'}>
                <a rel="noreferrer" target='_blank'>
                  <span>My resume</span>
                  <FontAwesomeIcon icon={faArrowRightLong} size={'xs'} />
                </a>
              </Link>
            </div>
          </div>
        </section>
        <section className="contact">
          <h2>Contact</h2>
          <div className="social_links">
            <div>
              <Link href={'mailto:amin.m.intichev@gmail.com'}>
                <a rel="noreferrer" target='_blank'>
                  <FontAwesomeIcon icon={faEnvelope} size={'xl'} />
                </a>
              </Link>
              <Link href={'mailto:amin.m.intichev@gmail.com'}>
                <a rel="noreferrer" target='_blank'>
                  amin.m.intichev@gmail.com
                </a>
              </Link>
            </div>
            <div>
              <Link href={'https://www.instagram.com/webdevamin/'}>
                <a rel="noreferrer" target='_blank'>
                  <FontAwesomeIcon icon={faInstagram} size={'xl'} />
                </a>
              </Link>
              <Link href={'https://www.instagram.com/webdevamin/'}>
                <a rel="noreferrer" target='_blank'>
                  webdevamin
                </a>
              </Link>
            </div>
            <div>
              <Link href={'https://www.linkedin.com/in/amin-i-1072391b0/'}>
                <a rel="noreferrer" target='_blank'>
                  <FontAwesomeIcon icon={faLinkedin} size={'xl'} />
                </a>
              </Link>
              <Link href={'https://www.linkedin.com/in/amin-i-1072391b0/'}>
                <a rel="noreferrer" target='_blank'>
                  Amin Intichev
                </a>
              </Link>
            </div>
            <div>
              <Link href={'https://github.com/1chbinamin'}>
                <a rel="noreferrer" target='_blank'>
                  <FontAwesomeIcon icon={faGithub} size={'xl'} />
                </a>
              </Link>
              <Link href={'https://github.com/1chbinamin'}>
                <a rel="noreferrer" target='_blank'>
                  1chbinamin
                </a>
              </Link>
            </div>
          </div>
        </section>
      </main>
    </>
  )
}

export default Index;