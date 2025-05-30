'use client';

import { ArrowRight, Bot, Search, Sparkles, Target, TrendingUp, Users, Zap } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { useAuth } from '@/hooks/use-auth.js';

import { Footer } from '@/components/layout/Footer.js';
import { Header } from '@/components/layout/Header.js';
import { Button } from '@/components/ui/button.js';
import { Card, CardContent } from '@/components/ui/card.js';
import { Input } from '@/components/ui/input.js';
import { Separator } from '@/components/ui/separator.js';

const useScrollAnimation = () => {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-fade-in', 'animate-slide-in-up');
            entry.target.classList.remove('opacity-0');
          }
        });
      },
      { threshold: 0.1 }
    );

    const elementsToObserve = document.querySelectorAll('.scroll-animate');
    elementsToObserve.forEach((el) => {
      el.classList.add('opacity-0');
      observer.observe(el);
    });

    return () => {
      elementsToObserve.forEach((el) => observer.unobserve(el));
    };
  }, []);
};

export default function LandingPage() {
  useScrollAnimation();
  const [email, setEmail] = useState('');
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const handleGetStartedWithEmail = () => {
    console.log('Email for signup:', email);
    if (currentUser) {
      navigate('/chat');
    } else {
      navigate('/register', { state: { emailFromLanding: email } });
    }
  };

  const handleTryTheApp = () => {
    if (currentUser) {
      navigate('/chat');
    } else {
      navigate('/register');
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Header />

      <main className="flex-grow">
        <section className="py-20 md:py-28 lg:py-32 text-center animate-fade-in">
          <div className="container">
            <div className="max-w-4xl mx-auto space-y-8">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tighter text-foreground">
                find your perfect mechanical keyboard switches
              </h1>
              <p
                className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed animate-fade-in"
                style={{ animationDelay: '0.2s' }}
              >
                get ai-powered recommendations, compare specifications, and discover switches
                tailored to your typing style and preferences.
              </p>
              <div
                className="flex justify-center items-center gap-4 text-sm text-muted-foreground animate-fade-in"
                style={{ animationDelay: '0.4s' }}
              >
                {['for gamers', 'for typists', 'for enthusiasts'].map((tag, i) => (
                  <span
                    key={tag}
                    className="flex items-center gap-2 animate-slide-in-up"
                    style={{ animationDelay: `${0.5 + i * 0.1}s` }}
                  >
                    <span className="w-2 h-2 rounded-full bg-primary"></span>
                    {tag}
                  </span>
                ))}
              </div>
              <div
                className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4 animate-slide-in-up"
                style={{ animationDelay: '0.8s' }}
              >
                <Button size="lg" onClick={handleTryTheApp} className="text-base px-8">
                  try the app
                </Button>
                <Button variant="link" size="lg" asChild className="text-base text-foreground">
                  <a href="#features">
                    learn more <ArrowRight className="ml-2 h-4 w-4" />
                  </a>
                </Button>
              </div>
              <div className="pt-16 animate-fade-in" style={{ animationDelay: '1s' }}>
                <p className="text-sm text-muted-foreground uppercase mb-8">
                  trusted by keyboard enthusiasts worldwide
                </p>
                <div className="flex flex-wrap justify-center items-center gap-8 opacity-70">
                  {['cherry', 'gateron', 'kailh', 'zealios', 'durock'].map((brand, i) => (
                    <div
                      key={brand}
                      className="text-xl font-medium text-muted-foreground transition-transform hover:scale-105"
                      style={{
                        animation: `fade-in 0.5s ease-out ${1.2 + i * 0.1}s forwards`,
                        opacity: 0
                      }}
                    >
                      {brand}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="py-16 md:py-24 bg-muted/30">
          <div className="container">
            <div className="text-center mb-12 md:mb-16 scroll-animate">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
                unlock your perfect switch
              </h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                discover what switch.ai offers and how our simple process guides you to your ideal
                mechanical keyboard switch.
              </p>
            </div>

            <div className="mb-16 md:mb-24">
              <h3 className="text-2xl md:text-3xl font-semibold text-center mb-10 md:mb-12 text-foreground scroll-animate">
                discover what switch.ai offers
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                {[
                  {
                    icon: Bot,
                    title: 'ai recommendations',
                    desc: 'our ai analyzes your preferences to recommend the perfect switches for your needs.',
                    linkText: 'learn more',
                    href: '/chat'
                  },
                  {
                    icon: Search,
                    title: 'switch database',
                    desc: 'access detailed specs and comparisons for hundreds of mechanical keyboard switches.',
                    linkText: 'explore database',
                    href: '/chat'
                  },
                  {
                    icon: Sparkles,
                    title: 'interactive chat',
                    desc: 'chat with our ai to get instant, detailed answers about any switch. no jargon required.',
                    linkText: 'start chatting',
                    href: '/chat'
                  },
                  {
                    icon: TrendingUp,
                    title: 'smart comparisons',
                    desc: 'get detailed comparisons, highlighting key differences and similarities between switches.',
                    linkText: 'see comparisons',
                    href: '/chat'
                  }
                ].map((feature, index) => (
                  <Card
                    key={index}
                    className="bg-card text-card-foreground border-border hover:border-primary/50 transition-all duration-300 transform hover:scale-[1.02] scroll-animate"
                  >
                    <CardContent className="p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="p-2.5 rounded-lg bg-primary/10">
                          <feature.icon className="h-6 w-6 text-primary" />
                        </div>
                        <span className="text-sm font-medium text-primary uppercase tracking-wider">
                          {feature.title}
                        </span>
                      </div>
                      <h4 className="text-xl lg:text-2xl font-semibold mb-2 text-foreground">
                        {feature.title}
                      </h4>
                      <p className="text-muted-foreground text-sm lg:text-base leading-relaxed mb-4">
                        {feature.desc}
                      </p>
                      <Button variant="link" asChild className="p-0 text-primary hover:underline">
                        <Link to={feature.href}>
                          {feature.linkText} <ArrowRight className="ml-1 h-4 w-4" />
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            <div id="how-it-works">
              <h3 className="text-2xl md:text-3xl font-semibold text-center mb-10 md:mb-12 text-foreground scroll-animate">
                simple steps to your ideal switch
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
                {[
                  {
                    icon: Target,
                    title: '1. tell us your needs',
                    desc: 'describe your typing style, preferences, and intended use case in natural language.'
                  },
                  {
                    icon: Zap,
                    title: '2. get ai recommendations',
                    desc: 'our ai analyzes thousands of switches to find the perfect matches for your needs.'
                  },
                  {
                    icon: Users,
                    title: '3. make informed decisions',
                    desc: 'compare options, read detailed specs, and choose with confidence.'
                  }
                ].map((step, index) => (
                  <div key={index} className="text-center p-4 scroll-animate">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 transition-transform hover:scale-110">
                      <step.icon className="h-8 w-8 text-primary" />
                    </div>
                    <h4 className="text-xl font-semibold mb-2 text-foreground">{step.title}</h4>
                    <p className="text-muted-foreground text-sm leading-relaxed">{step.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 md:py-20">
          <div className="container text-center">
            <div className="max-w-2xl mx-auto space-y-8 scroll-animate">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                ready to find your perfect switch?
              </h2>
              <p className="text-lg text-muted-foreground">
                join thousands of keyboard enthusiasts who have discovered their ideal switches with
                switch.ai. start your journey today.
              </p>
              <div className="flex flex-col sm:flex-row gap-2 justify-center items-center max-w-md mx-auto">
                <Input
                  type="email"
                  placeholder="enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 min-w-[200px] text-base"
                  aria-label="email for sign up"
                />
                <Button
                  onClick={handleGetStartedWithEmail}
                  size="lg"
                  className="w-full sm:w-auto text-base"
                >
                  get started
                </Button>
              </div>
            </div>
          </div>
        </section>
        <Separator />
      </main>
      <Footer />
    </div>
  );
}
