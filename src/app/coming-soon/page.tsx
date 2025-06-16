import { Clock, Mail, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

import { Footer } from '@/components/layout/Footer.js';
import { Header } from '@/components/layout/Header.js';
import { Button } from '@/components/ui/button.js';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.js';

export function ComingSoonPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <Card className="w-full max-w-2xl text-center">
          <CardHeader className="space-y-6">
            <div className="mx-auto w-16 h-16 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center mb-4">
              <Clock className="w-8 h-8 text-primary" />
            </div>
            <CardTitle className="text-3xl md:text-4xl font-bold">
              something exciting is coming
            </CardTitle>
            <CardDescription className="text-lg text-muted-foreground max-w-md mx-auto">
              we're working on something special that will revolutionize how you discover and
              compare mechanical switches
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-8">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex items-center gap-3 p-4 rounded-lg border bg-muted/30">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Zap className="w-5 h-5 text-primary" />
                </div>
                <div className="text-left">
                  <h3 className="font-semibold text-sm">enhanced features</h3>
                  <p className="text-xs text-muted-foreground">
                    better recommendations and comparisons
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 rounded-lg border bg-muted/30">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Mail className="w-5 h-5 text-primary" />
                </div>
                <div className="text-left">
                  <h3 className="font-semibold text-sm">community driven</h3>
                  <p className="text-xs text-muted-foreground">built based on your feedback</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                asChild
                style={{ backgroundColor: 'var(--sub-color)', color: 'var(--sub-alt-color)' }}
              >
                <Link to="/">back to home</Link>
              </Button>

              <Button variant="outline" asChild>
                <Link to="/about">learn more about us</Link>
              </Button>
            </div>

            <p className="text-sm text-muted-foreground">stay tuned for updates on our journey</p>
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  );
}
