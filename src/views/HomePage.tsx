import { Hero } from '../sections/Hero/Hero';
import { Services } from '../sections/Services/Services';
import { Process } from '../sections/Process/Process';
import { Contacts } from '../sections/Contacts/Contacts';
import { About } from '../sections/About/About';

export default function HomePage() {
  return (
    <>
      <Hero />
      <About />
      <Services />
      <Process />
      <Contacts />
    </>
  );
}