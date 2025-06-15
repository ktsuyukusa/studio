'use client';

import ImageExample from '@/components/examples/image-example';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function ImagesExamplePage() {
  return (
    <div className="container mx-auto py-8">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-2xl">Images in Next.js</CardTitle>
          <CardDescription>
            Learn how to add and optimize images in your Next.js application
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>
            This page demonstrates how to use the Next.js Image component to display both local and remote images.
            The Image component automatically optimizes your images and provides a better user experience.
          </p>
        </CardContent>
      </Card>
      
      <ImageExample />
    </div>
  );
}
