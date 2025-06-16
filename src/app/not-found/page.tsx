import { ArrowLeft, Home, Search } from 'lucide-react';
import { Link } from 'react-router-dom';

import { Footer } from '@/components/layout/Footer.js';
import { Header } from '@/components/layout/Header.js';
import { Button } from '@/components/ui/button.js';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.js';

export function NotFoundPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <Card className="w-full max-w-2xl text-center">
          <CardHeader className="space-y-6">
            <div className="mx-auto w-20 h-20 rounded-full bg-gradient-to-br from-destructive/20 to-destructive/5 flex items-center justify-center mb-4">
              <div className="text-4xl font-bold text-destructive">404</div>
            </div>
            <CardTitle className="text-3xl md:text-4xl font-bold">page not found</CardTitle>
            <CardDescription className="text-lg text-muted-foreground max-w-md mx-auto">
              looks like this page doesn't exist or has been moved. let's get you back on track to
              finding the perfect switches
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-8">
            <div className="grid gap-4">
              <div className="flex items-center gap-3 p-4 rounded-lg border bg-muted/30">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Search className="w-5 h-5 text-primary" />
                </div>
                <div className="text-left flex-1">
                  <h3 className="font-semibold text-sm">try searching for switches</h3>
                  <p className="text-xs text-muted-foreground">
                    discover and compare mechanical switches on our main page
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 rounded-lg border bg-muted/30">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Home className="w-5 h-5 text-primary" />
                </div>
                <div className="text-left flex-1">
                  <h3 className="font-semibold text-sm">explore our features</h3>
                  <p className="text-xs text-muted-foreground">
                    check out what switch.ai has to offer
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                asChild
                style={{ backgroundColor: 'var(--sub-color)', color: 'var(--sub-alt-color)' }}
              >
                <Link to="/">
                  <Home className="w-4 h-4 mr-2" />
                  go home
                </Link>
              </Button>

              <Button variant="outline" onClick={() => window.history.back()}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                go back
              </Button>
            </div>

            <p className="text-sm text-muted-foreground">
              if you think this is an error, please contact us through our main page
            </p>
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  );
}
