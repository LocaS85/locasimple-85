
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export const TypographyShowcase = () => {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Typography</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <h3 className="font-medium mb-3">Headings (Inter)</h3>
          <div className="space-y-4">
            <div>
              <h1 className="text-4xl font-heading font-bold">Heading 1</h1>
              <p className="text-sm text-muted-foreground mt-1">text-4xl font-heading font-bold</p>
            </div>
            <div>
              <h2 className="text-3xl font-heading font-semibold">Heading 2</h2>
              <p className="text-sm text-muted-foreground mt-1">text-3xl font-heading font-semibold</p>
            </div>
            <div>
              <h3 className="text-2xl font-heading font-medium">Heading 3</h3>
              <p className="text-sm text-muted-foreground mt-1">text-2xl font-heading font-medium</p>
            </div>
            <div>
              <h4 className="text-xl font-heading font-medium">Heading 4</h4>
              <p className="text-sm text-muted-foreground mt-1">text-xl font-heading font-medium</p>
            </div>
            <div>
              <h5 className="text-lg font-heading font-medium">Heading 5</h5>
              <p className="text-sm text-muted-foreground mt-1">text-lg font-heading font-medium</p>
            </div>
          </div>
        </div>

        <Separator className="my-6" />

        <div className="mb-6">
          <h3 className="font-medium mb-3">Body Text (Work Sans)</h3>
          <div className="space-y-4">
            <div>
              <p className="text-base font-worksans">Default body text using Work Sans font. This font provides excellent readability for body text while complementing the Inter heading font.</p>
              <p className="text-sm text-muted-foreground mt-1">text-base font-worksans</p>
            </div>
            <div>
              <p className="text-sm font-worksans">Small text using Work Sans font. Ideal for captions, labels, or secondary information.</p>
              <p className="text-sm text-muted-foreground mt-1">text-sm font-worksans</p>
            </div>
            <div>
              <p className="text-lg font-worksans">Larger text using Work Sans font. Useful for emphasized paragraphs or lead text.</p>
              <p className="text-sm text-muted-foreground mt-1">text-lg font-worksans</p>
            </div>
          </div>
        </div>

        <Separator className="my-6" />

        <div>
          <h3 className="font-medium mb-3">Styles</h3>
          <div className="space-y-4">
            <div>
              <p className="font-bold">Bold text</p>
              <p className="text-sm text-muted-foreground mt-1">font-bold</p>
            </div>
            <div>
              <p className="font-semibold">Semibold text</p>
              <p className="text-sm text-muted-foreground mt-1">font-semibold</p>
            </div>
            <div>
              <p className="font-medium">Medium text</p>
              <p className="text-sm text-muted-foreground mt-1">font-medium</p>
            </div>
            <div>
              <p className="font-normal">Normal text</p>
              <p className="text-sm text-muted-foreground mt-1">font-normal</p>
            </div>
            <div>
              <p className="italic">Italic text</p>
              <p className="text-sm text-muted-foreground mt-1">italic</p>
            </div>
            <div>
              <p className="underline">Underlined text</p>
              <p className="text-sm text-muted-foreground mt-1">underline</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TypographyShowcase;
