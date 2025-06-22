'use client';

import { Eye, Lock, Mail, Shield, Users } from 'lucide-react';
import { useEffect } from 'react';

import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/button';

const useFadeInAnimation = () => {
  useEffect(() => {
    const elements = document.querySelectorAll('.fade-in-section');
    elements.forEach((el, index) => {
      el.classList.add('animate-fade-in');
      (el as HTMLElement).style.animationDelay = `${index * 0.2}s`;
    });
  }, []);
};

interface PrivacySection {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  content: string[];
}

export default function PrivacyPage() {
  useFadeInAnimation();

  const privacySections: PrivacySection[] = [
    {
      icon: Shield,
      title: 'data collection',
      content: [
        'we collect information you provide when creating an account (email, name, and password).',
        'chat conversations and switch preferences to provide personalized recommendations.',
        'usage analytics to improve our service (anonymized and aggregated).',
        'technical information like IP address, browser type, and device information for security and optimization.'
      ]
    },
    {
      icon: Eye,
      title: 'how we use your data',
      content: [
        'provide personalized mechanical keyboard switch recommendations based on your preferences.',
        'maintain and improve our AI-powered chat functionality and recommendation engine.',
        'send important account updates and service announcements (you can opt out of marketing).',
        'ensure platform security and prevent abuse or unauthorized access.'
      ]
    },
    {
      icon: Lock,
      title: 'data protection',
      content: [
        'all data is encrypted in transit using industry-standard TLS encryption.',
        'passwords are securely hashed using bcrypt with salt for maximum security.',
        'we implement strict access controls and regular security audits.',
        'your chat data is stored securely and never shared with third parties without consent.'
      ]
    },
    {
      icon: Users,
      title: 'data sharing',
      content: [
        'we do not sell, rent, or trade your personal information to third parties.',
        'anonymous, aggregated analytics may be shared with switch manufacturers to improve products.',
        "we may share data if required by law or to protect our users' safety.",
        'third-party integrations (like Google OAuth) follow their respective privacy policies.'
      ]
    }
  ];

  const userRights = [
    'access and download your personal data',
    'correct or update your account information',
    'delete your account and associated data',
    'opt out of marketing communications',
    'request data portability',
    'file a complaint with data protection authorities'
  ];

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 md:px-6 lg:px-8 py-12 md:py-16">
        <div className="max-w-4xl mx-auto">
          <section className="mb-12 md:mb-16 fade-in-section opacity-0 text-center">
            <div className="flex justify-center mb-6">
              <Shield className="h-16 w-16 text-primary" />
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
              privacy policy
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto mb-4">
              your privacy matters to us. learn how we collect, use, and protect your data on
              switch.ai.
            </p>
            <p className="text-sm text-muted-foreground">
              last updated: {new Date().toLocaleDateString()}
            </p>
          </section>

          <section className="mb-12 md:mb-16 fade-in-section opacity-0">
            <h2 className="text-2xl md:text-3xl font-semibold text-foreground mb-6">overview</h2>
            <p className="text-muted-foreground leading-relaxed">
              switch.ai is committed to protecting your privacy and being transparent about how we
              handle your data. this policy explains what information we collect, how we use it, and
              your rights regarding your personal data. by using switch.ai, you agree to the
              practices described in this policy.
            </p>
          </section>

          {privacySections.map((section) => (
            <section key={section.title} className="mb-12 md:mb-16 fade-in-section opacity-0">
              <h2 className="text-2xl md:text-3xl font-semibold text-foreground mb-6 flex items-center gap-3">
                <section.icon className="h-8 w-8 text-primary" />
                {section.title}
              </h2>
              <ul className="space-y-4">
                {section.content.map((item, itemIndex) => (
                  <li key={itemIndex} className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2.5 flex-shrink-0" />
                    <span className="text-muted-foreground leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </section>
          ))}

          <section className="mb-12 md:mb-16 fade-in-section opacity-0">
            <h2 className="text-2xl md:text-3xl font-semibold text-foreground mb-6 flex items-center gap-3">
              <Users className="h-8 w-8 text-primary" />
              your rights
            </h2>
            <p className="text-muted-foreground mb-6">
              you have control over your personal data. here's what you can do:
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              {userRights.map((right, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2.5 flex-shrink-0" />
                  <span className="text-muted-foreground leading-relaxed">{right}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="mb-12 md:mb-16 fade-in-section opacity-0">
            <h2 className="text-2xl md:text-3xl font-semibold text-foreground mb-6 flex items-center gap-3">
              <Mail className="h-8 w-8 text-primary" />
              contact us
            </h2>
            <div className="space-y-6">
              <p className="text-muted-foreground leading-relaxed">
                if you have any questions about this privacy policy or want to exercise your rights,
                please don't hesitate to contact us:
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button variant="outline" className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  privacy@switchai.com
                </Button>
                <Button variant="outline">data protection officer</Button>
              </div>
              <p className="text-sm text-muted-foreground">
                we aim to respond to all privacy-related inquiries within 30 days.
              </p>
            </div>
          </section>

          <section className="text-center fade-in-section opacity-0 bg-muted/30 rounded-lg p-8">
            <h3 className="text-xl font-semibold text-foreground mb-4">policy updates</h3>
            <p className="text-muted-foreground leading-relaxed max-w-2xl mx-auto">
              we may update this privacy policy from time to time. when we do, we'll notify you via
              email and update the "last updated" date above. continued use of switch.ai after
              changes constitutes acceptance of the updated policy.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
