import { Hero } from '../sections/Hero/Hero';
import { Services } from '../sections/Services/Services';
import { Process } from '../sections/Process/Process';
import { Contacts } from '../sections/Contacts/Contacts';
import { About } from '../sections/About/About';
import { Faq } from '../sections/Faq/Faq';
import { Sessions } from '../sections/Sessions/Sessions';
import { ReviewPreview } from '../sections/ReviewPreview/ReviewPreview';

export default function HomePage() {
  return (
    <main>
      <Hero />
      <Services />
      <About />
      <Process />
      <Sessions />
      <ReviewPreview />
      <Faq />
      <Contacts />
    </main>
  );
}
