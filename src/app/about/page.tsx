'use client';

import { Linkedin } from 'lucide-react';
import { useEffect } from 'react';

import { Footer } from '@/components/layout/Footer.js';
import { Header } from '@/components/layout/Header.js';
import { Button } from '@/components/ui/button.js';

const useFadeInAnimation = () => {
  useEffect(() => {
    const elements = document.querySelectorAll('.fade-in-section');
    elements.forEach((el, index) => {
      el.classList.add('animate-fade-in');
      (el as HTMLElement).style.animationDelay = `${index * 0.2}s`;
    });
  }, []);
};

export default function AboutPage() {
  useFadeInAnimation();

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 md:px-6 lg:px-8 py-12 md:py-16">
        <div className="max-w-3xl mx-auto">
          <section className="mb-12 md:mb-16 fade-in-section opacity-0">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-8 text-center">
              about switch.ai
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed text-center">
              your intelligent companion in the world of mechanical keyboard switches.
            </p>
          </section>

          <section className="mb-12 md:mb-16 fade-in-section opacity-0">
            <h2 className="text-2xl md:text-3xl font-semibold text-foreground mb-6">
              born from a passion for keyboards
            </h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                i created switch.ai because i love custom mechanical keyboards and wanted to make it
                easier for everyone – from beginners to seasoned enthusiasts – to discover switches
                that perfectly match their preferences and typing style. the world of mechanical
                switches is vast and can be overwhelming, but finding that perfect switch can
                genuinely transform your typing experience.
              </p>
              <p>
                my goal with switch.ai is to simplify that journey of discovery. by leveraging ai, i
                hope to provide a more intuitive and personalized way to navigate the complexities
                of switch characteristics, materials, and brands. whether you're hunting for the
                quietest switch for the office, the fastest switch for gaming, or the most tactile
                switch for satisfying keystrokes, switch.ai is here to assist.
              </p>
            </div>
          </section>

          <section className="mb-12 md:mb-16 fade-in-section opacity-0">
            <h2 className="text-2xl md:text-3xl font-semibold text-foreground mb-6">my mission</h2>
            <p className="text-muted-foreground leading-relaxed">
              to empower keyboard enthusiasts of all levels to find their ideal mechanical keyboard
              switches through intelligent, data-driven, and user-friendly tools. we aim to
              demystify the selection process and foster a more informed and enjoyable keyboard
              customization experience.
            </p>
          </section>

          <section className="text-center fade-in-section opacity-0">
            <h2 className="text-2xl md:text-3xl font-semibold text-foreground mb-6">
              connect with me
            </h2>
            <p className="text-muted-foreground mb-4">
              have questions, feedback, or just want to chat about keyboards?
            </p>
            <Button variant="link" asChild className="text-lg text-primary hover:underline">
              <a
                href="https://www.linkedin.com/in/freddysong/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Linkedin className="mr-2 h-5 w-5" />
                linkedin
              </a>
            </Button>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
