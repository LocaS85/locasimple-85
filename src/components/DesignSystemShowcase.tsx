
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import ColorPaletteShowcase from './ColorPaletteShowcase';
import TypographyShowcase from './TypographyShowcase';
import { MapPin, Calendar, Settings, Home, Menu, Bell, ChevronRight } from 'lucide-react';
import { getCategoryIcon } from '@/utils/categoryIcons';

const DesignSystemShowcase = () => {
  return (
    <div className="container mx-auto py-8 px-4 space-y-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-heading font-bold mb-2">Design System Showcase</h1>
        <p className="text-lg font-worksans text-muted-foreground">
          Based on the Figma mockup specifications
        </p>
      </div>

      <Tabs defaultValue="colors" className="w-full">
        <TabsList className="grid grid-cols-5 mb-8">
          <TabsTrigger value="colors">Colors</TabsTrigger>
          <TabsTrigger value="typography">Typography</TabsTrigger>
          <TabsTrigger value="buttons">Buttons</TabsTrigger>
          <TabsTrigger value="cards">Cards</TabsTrigger>
          <TabsTrigger value="components">Components</TabsTrigger>
        </TabsList>
        
        <TabsContent value="colors">
          <ColorPaletteShowcase />
        </TabsContent>
        
        <TabsContent value="typography">
          <TypographyShowcase />
        </TabsContent>
        
        <TabsContent value="buttons">
          <Card className="w-full">
            <CardHeader>
              <CardTitle>Buttons</CardTitle>
              <CardDescription>Button styles based on the new color palette</CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              <div>
                <h3 className="font-medium mb-3">Button Variants</h3>
                <div className="flex flex-wrap gap-4">
                  <Button variant="default">Default</Button>
                  <Button variant="destructive">Destructive</Button>
                  <Button variant="outline">Outline</Button>
                  <Button variant="secondary">Secondary</Button>
                  <Button variant="ghost">Ghost</Button>
                  <Button variant="link">Link</Button>
                </div>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="font-medium mb-3">Button Sizes</h3>
                <div className="flex flex-wrap items-center gap-4">
                  <Button size="default">Default</Button>
                  <Button size="sm">Small</Button>
                  <Button size="lg">Large</Button>
                  <Button size="icon"><MapPin className="h-4 w-4" /></Button>
                </div>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="font-medium mb-3">Button with Icons</h3>
                <div className="flex flex-wrap gap-4">
                  <Button>
                    <MapPin className="mr-2 h-4 w-4" /> Location
                  </Button>
                  <Button variant="outline">
                    <Calendar className="mr-2 h-4 w-4" /> Schedule
                  </Button>
                  <Button variant="secondary">
                    Settings <Settings className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="font-medium mb-3">Custom Colored Buttons</h3>
                <div className="flex flex-wrap gap-4">
                  <Button className="bg-slateblue hover:bg-slateblue-dark">
                    Slate Blue
                  </Button>
                  <Button className="bg-sagegreen hover:bg-sagegreen-dark text-slateblue">
                    Sage Green
                  </Button>
                  <Button className="bg-copper hover:bg-copper-dark">
                    Copper
                  </Button>
                  <Button className="bg-electricblue hover:bg-electricblue-dark">
                    Electric Blue
                  </Button>
                </div>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="font-medium mb-3">Neumorphic Buttons</h3>
                <div className="flex flex-wrap gap-4">
                  <button className="px-4 py-2 rounded-xl bg-offwhite shadow-neu-light hover:shadow-neu-dark transition-shadow duration-200 text-slateblue">
                    Neumorphic Light
                  </button>
                  <button className="px-4 py-2 rounded-xl bg-slateblue shadow-neu-dark text-white hover:bg-slateblue-light transition-colors duration-200">
                    Neumorphic Dark
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="cards">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Standard Card</CardTitle>
                <CardDescription>A basic card component with header and content</CardDescription>
              </CardHeader>
              <CardContent>
                <p>This is a standard card component showing the basic structure with header, description and content.</p>
              </CardContent>
              <CardFooter>
                <Button>Action</Button>
              </CardFooter>
            </Card>
            
            <Card className="bg-slateblue text-white">
              <CardHeader>
                <CardTitle>Slate Blue Card</CardTitle>
                <CardDescription className="text-offwhite/80">Card with slate blue background</CardDescription>
              </CardHeader>
              <CardContent>
                <p>This card uses the slate blue background color with white text for high contrast.</p>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="border-white text-white hover:bg-white/20">Action</Button>
              </CardFooter>
            </Card>
            
            <Card className="bg-gradient-to-br from-electricblue/30 to-offwhite border-electricblue/20">
              <CardHeader>
                <CardTitle className="text-slateblue">Gradient Card</CardTitle>
                <CardDescription>Card with a subtle gradient background</CardDescription>
              </CardHeader>
              <CardContent>
                <p>This card uses a subtle gradient from electric blue to off-white for a modern look.</p>
              </CardContent>
              <CardFooter>
                <Button className="bg-electricblue hover:bg-electricblue-dark">Action</Button>
              </CardFooter>
            </Card>
            
            <Card className="neu-card">
              <CardHeader>
                <CardTitle>Neumorphic Card</CardTitle>
                <CardDescription>Card with neumorphic shadow effects</CardDescription>
              </CardHeader>
              <CardContent>
                <p>This card uses neumorphic shadow effects for a subtle 3D appearance that's modern and clean.</p>
              </CardContent>
              <CardFooter>
                <Button className="neu-button">Action</Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="components">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Badges</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-3">
                <Badge>Default</Badge>
                <Badge variant="secondary">Secondary</Badge>
                <Badge variant="outline">Outline</Badge>
                <Badge variant="destructive">Destructive</Badge>
                <Badge className="bg-slateblue">Slate Blue</Badge>
                <Badge className="bg-copper">Copper</Badge>
                <Badge className="bg-sagegreen">Sage Green</Badge>
                <Badge className="bg-electricblue">Electric Blue</Badge>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Category Icons</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
                  <div className="flex flex-col items-center gap-2">
                    {getCategoryIcon('home', 'h-8 w-8 text-slateblue')}
                    <span className="text-xs">Home</span>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    {getCategoryIcon('travail', 'h-8 w-8 text-copper')}
                    <span className="text-xs">Work</span>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    {getCategoryIcon('famille', 'h-8 w-8 text-sagegreen')}
                    <span className="text-xs">Family</span>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    {getCategoryIcon('shopping', 'h-8 w-8 text-electricblue')}
                    <span className="text-xs">Shopping</span>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    {getCategoryIcon('education', 'h-8 w-8 text-slateblue')}
                    <span className="text-xs">Education</span>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    {getCategoryIcon('alimentation', 'h-8 w-8 text-copper')}
                    <span className="text-xs">Food</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="col-span-1 md:col-span-2">
              <CardHeader>
                <CardTitle>Navigation Elements</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-slateblue text-white rounded-lg p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Menu className="h-5 w-5" />
                    <h2 className="text-lg font-medium">App Header</h2>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button size="icon" variant="ghost" className="text-white hover:bg-white/20">
                      <Bell className="h-5 w-5" />
                    </Button>
                    <Button size="icon" variant="ghost" className="text-white hover:bg-white/20">
                      <Settings className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
                
                <div className="flex flex-col space-y-1">
                  <div className="flex items-center justify-between px-4 py-3 bg-offwhite hover:bg-velvetgray rounded-lg cursor-pointer">
                    <div className="flex items-center gap-3">
                      <Home className="h-5 w-5 text-slateblue" />
                      <span>Home</span>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </div>
                  
                  <div className="flex items-center justify-between px-4 py-3 bg-electricblue text-white rounded-lg cursor-pointer">
                    <div className="flex items-center gap-3">
                      <MapPin className="h-5 w-5" />
                      <span>Location</span>
                    </div>
                    <ChevronRight className="h-4 w-4 text-white/70" />
                  </div>
                  
                  <div className="flex items-center justify-between px-4 py-3 bg-offwhite hover:bg-velvetgray rounded-lg cursor-pointer">
                    <div className="flex items-center gap-3">
                      <Calendar className="h-5 w-5 text-copper" />
                      <span>Calendar</span>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Animations</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex flex-wrap gap-4">
                  <div className="p-4 bg-offwhite rounded-lg animate-fade-in">
                    Fade In
                  </div>
                  <div className="p-4 bg-offwhite rounded-lg animate-float">
                    Float
                  </div>
                  <div className="relative p-4 bg-offwhite rounded-lg overflow-hidden">
                    <div className="absolute top-0 left-0 right-0 bottom-0 -inset-x-full z-10 animate-shimmer bg-gradient-to-r from-transparent via-white/20 to-transparent"/>
                    Shimmer
                  </div>
                  <div className="p-4 bg-offwhite rounded-lg hover:scale-105 transition-transform">
                    Hover Scale
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DesignSystemShowcase;
