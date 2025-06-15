'use client';

import Image from 'next/image';
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function ImageExample() {
  // Example of using both local and remote images
  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Local Images Example</CardTitle>
          <CardDescription>
            Images stored in your project's public/images directory
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col items-center space-y-4">
            <p className="text-sm text-muted-foreground">
              To use local images, place them in the public/images folder and reference them like this:
            </p>
            <div className="bg-muted p-4 rounded-md w-full overflow-x-auto">
              <pre className="text-sm">
                {`<Image
  src="/images/your-image.jpg"
  alt="Description of image"
  width={300}
  height={200}
/>`}
              </pre>
            </div>
            <p className="text-sm text-muted-foreground mt-4">
              Once you add an image to public/images, it will appear here:
            </p>
            <div className="border border-dashed border-gray-300 rounded-md p-8 flex flex-col items-center justify-center space-y-4">
              <p className="text-muted-foreground">We've created a README.txt file in your public/images directory with instructions:</p>
              <div className="bg-muted p-4 rounded-md w-full">
                <pre className="text-xs overflow-auto whitespace-pre-wrap">
                  {`Place your image files in this directory.

For example:
- logo.png
- profile.jpg
- banner.webp

Then reference them in your components using the Next.js Image component:

import Image from 'next/image';

function MyComponent() {
  return (
    <Image
      src="/images/logo.png"
      alt="Logo"
      width={300}
      height={200}
    />
  );
}`}
                </pre>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Remote Images Example</CardTitle>
          <CardDescription>
            Images from external sources like Unsplash or Cloudinary
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col items-center space-y-4">
            <p className="text-sm text-muted-foreground">
              Remote images from approved domains (configured in next.config.ts):
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col items-center">
                <Image
                  src="https://images.unsplash.com/photo-1551434678-e076c223a692"
                  alt="CEO working at desk"
                  width={400}
                  height={300}
                  className="rounded-md"
                />
                <p className="text-sm text-muted-foreground mt-2">Example from Unsplash</p>
              </div>
              <div className="flex flex-col items-center">
                <Image
                  src="https://placehold.co/400x300/3b82f6/ffffff?text=Your+Logo+Here"
                  alt="Placeholder for your image"
                  width={400}
                  height={300}
                  className="rounded-md"
                />
                <p className="text-sm text-muted-foreground mt-2">Placeholder example</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>How to Add Your Own Images</CardTitle>
          <CardDescription>
            Step-by-step instructions for adding images to your project
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <ol className="list-decimal pl-5 space-y-2">
            <li>
              <strong>For local images:</strong> Upload your images to the <code>public/images</code> directory in your project
            </li>
            <li>
              <strong>For remote images:</strong> Make sure the domain is added to <code>next.config.ts</code> under <code>images.remotePatterns</code>
            </li>
            <li>
              Import the <code>Image</code> component from <code>next/image</code> in your component
            </li>
            <li>
              Use the component with the appropriate <code>src</code>, <code>alt</code>, <code>width</code>, and <code>height</code> props
            </li>
            <li>
              Deploy your changes to Vercel by pushing to your GitHub repository
            </li>
          </ol>
        </CardContent>
      </Card>
    </div>
  );
}
