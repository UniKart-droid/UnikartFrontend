import React from 'react'
import Landing from '../component/Landing'
import Footer from '../component/Footer'
import Card from '../component/Card'
import HowItWorks from '../component/HowItWorks'
import WhyChoose from '../component/WhyChoose'
import StartNow from '../component/StartNow'

const Home = () => {
  return (
    <>

      <Landing />
      <Card />
      <WhyChoose/>
      <HowItWorks/>
      <StartNow/>
      <Footer />
    </>
  )
}

export default Home