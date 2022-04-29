import Seo from '../components/Seo'
import Lottie from 'react-lottie-player';
import lottieJson from '../public/assets/developer.json';
import Typewriter from 'typewriter-effect';

const Index = () => {
  return (
    <main>
      <Seo />
      <section>
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
      <section className='content'>
        <h2>Who am I</h2>
        <p className='text'>
          I make full fledged, state-of-art websites and apps with focus on
          your needs. Worked in various IT companies, possessing
          advanced development knowledge. Any questions? Contact me on {' '}
          <span className='highlight_sm'>amin.m.intichev@gmail.com</span>
        </p>
      </section>
    </main>
  )
}

export default Index;