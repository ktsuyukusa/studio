import AppLayout from '@/components/layout/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, UserSquare, PenSquare, MessageSquarePlus, Users, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

const features = [
  {
    title: 'AI Profile Creation',
    description: 'Craft a compelling LinkedIn profile in Japanese and English with AI assistance.',
    icon: UserSquare,
    href: '/profile',
    image: 'https://placehold.co/600x400.png',
    aiHint: 'professional portrait',
  },
  {
    title: 'AI Post Forge',
    description: 'Generate engaging long-form LinkedIn posts in Japanese and English.',
    icon: PenSquare,
    href: '/posts',
    image: 'https://placehold.co/600x400.png',
    aiHint: 'writing content',
  },
  {
    title: 'AI Comment Assist',
    description: 'Get AI-suggested comments for LinkedIn posts in Japanese and English.',
    icon: MessageSquarePlus,
    href: '/comments',
    image: 'https://placehold.co/600x400.png',
    aiHint: 'social media interaction',
  },
  {
    title: 'Lead Finder',
    description: 'Discover relevant leads based on your criteria and access contact information.',
    icon: Users,
    href: '/leads',
    image: 'https://placehold.co/600x400.png',
    aiHint: 'networking business',
  },
  {
    title: 'Trend Watcher',
    description: 'Stay updated with the latest relevant posts and comments for Japanese CEOs.',
    icon: TrendingUp,
    href: '/trends',
    image: 'https://placehold.co/600x400.png',
    aiHint: 'market trends',
  },
];

export default function DashboardPage() {
  return (
    <AppLayout>
      <div className="flex flex-col gap-8">
        <header className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight font-headline">Welcome to Globalink CEO</h1>
          <p className="text-muted-foreground">
            Your AI-powered assistant for mastering LinkedIn and expanding your global reach.
          </p>
        </header>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <Card key={feature.title} className="flex flex-col overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="relative h-48 w-full">
                <Image 
                  src={feature.image} 
                  alt={feature.title} 
                  layout="fill" 
                  objectFit="cover" 
                  data-ai-hint={feature.aiHint}
                />
              </div>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <feature.icon className="h-8 w-8 text-primary" />
                  <CardTitle className="font-headline text-xl">{feature.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="flex-grow">
                <CardDescription>{feature.description}</CardDescription>
              </CardContent>
              <div className="p-6 pt-0">
                <Button asChild variant="default" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                  <Link href={feature.href}>
                    Go to {feature.title.replace("AI ", "")} <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
