'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Bot, Search, Sparkles, Target, TrendingUp, Users, Zap } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { useAuth } from '@/contexts/auth-context';

import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';
import { AnimatedTags } from '@/components/ui/animated-tags';
import { BorderTrail } from '@/components/ui/border-trail';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { GlowButton } from '@/components/ui/glow-button';
import { InViewSection } from '@/components/ui/in-view-section';
import { InfiniteSlider } from '@/components/ui/infinite-slider';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { TransitionPanel } from '@/components/ui/transition-panel';

export default function LandingPage() {
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

  const trustedBrands = [
    'cherry',
    'gateron',
    'kailh',
    'zealios',
    'durock',
    'holy panda',
    'novelkeys',
    'jwk',
    'hmx'
  ];

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Header />
      <main className="flex-grow">
        <InViewSection className="py-20 md:py-28 lg:py-32 text-center" animation="fade">
          <div className="container">
            <div className="max-w-4xl mx-auto space-y-8">
              <motion.h1
                className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tighter text-foreground"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                find your perfect mechanical keyboard switches
              </motion.h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                get ai-powered recommendations, compare specifications, and discover switches
                tailored to your typing style and preferences.
              </p>

              <AnimatedTags tags={['for gamers', 'for typists', 'for enthusiasts']} />

              <motion.div
                className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 1.5 }}
              >
                <GlowButton size="lg" onClick={handleTryTheApp} className="text-base px-8">
                  try the app
                </GlowButton>
                <Button variant="link" size="lg" asChild className="text-base text-foreground">
                  <motion.a href="#features" whileHover={{ x: 5 }}>
                    learn more <ArrowRight className="ml-2 h-4 w-4" />
                  </motion.a>
                </Button>
              </motion.div>
              <motion.div
                className="pt-16"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 2 }}
              >
                <InfiniteSlider items={trustedBrands} speed={25} pauseOnHover />
              </motion.div>
            </div>
          </div>
        </InViewSection>

        <InViewSection className="py-16 md:py-24 bg-muted/30" animation="slide-up" id="features">
          <div className="container">
            <div className="text-center mb-12 md:mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
                unlock your perfect switch
              </h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                discover what switch.ai offers and how our simple process guides you to your ideal
                mechanical keyboard switch.
              </p>
            </div>
            <div className="mb-16 md:mb-24">
              <h3 className="text-2xl md:text-3xl font-semibold text-center mb-10 md:mb-12 text-foreground">
                discover what we offer
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                {[
                  {
                    icon: Bot,
                    title: 'ai recommendations',
                    desc: 'switch.ai analyzes your preferences to recommend the perfect switches for your needs.',
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
                    desc: 'chat with switch.ai to get instant, detailed answers about any switch. no jargon required.',
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
                  <TransitionPanel
                    key={index}
                    direction={index % 2 === 0 ? 'left' : 'right'}
                    delay={index * 0.1}
                  >
                    <Card className="bg-card text-card-foreground border-border hover:border-primary/50 transition-all duration-300 h-full">
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
                            {feature.linkText}
                            <ArrowRight className="ml-1 h-4 w-4" id="how-it-works" />
                          </Link>
                        </Button>
                      </CardContent>
                    </Card>
                  </TransitionPanel>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-2xl md:text-3xl font-semibold text-center mb-10 md:mb-12 text-foreground">
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
                    desc: 'switch.ai analyzes thousands of switches to find the perfect matches for your needs.'
                  },
                  {
                    icon: Users,
                    title: '3. make informed decisions',
                    desc: 'compare options, read detailed specs, and choose with confidence.'
                  }
                ].map((step, index) => (
                  <InViewSection
                    key={index}
                    className="text-center p-4"
                    delay={index * 0.15}
                    animation="scale"
                  >
                    <BorderTrail className="w-16 h-16 rounded-full mx-auto mb-6 flex items-center justify-center">
                      <div className="w-full h-full bg-primary/10 rounded-full flex items-center justify-center">
                        <step.icon className="h-8 w-8 text-primary" />
                      </div>
                    </BorderTrail>
                    <h4 className="text-xl font-semibold mb-2 text-foreground">{step.title}</h4>
                    <p className="text-muted-foreground text-sm leading-relaxed">{step.desc}</p>
                  </InViewSection>
                ))}
              </div>
            </div>
          </div>
        </InViewSection>

        <InViewSection className="py-16 md:py-20" animation="fade" id="contact">
          <div className="container text-center">
            <div className="max-w-2xl mx-auto space-y-8">
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
                <GlowButton
                  onClick={handleGetStartedWithEmail}
                  size="lg"
                  className="w-full sm:w-auto text-base"
                  glowIntensity={0.8}
                >
                  get started
                </GlowButton>
              </div>
            </div>
          </div>
        </InViewSection>
        <Separator />
      </main>
      <Footer />
    </div>
  );
}
