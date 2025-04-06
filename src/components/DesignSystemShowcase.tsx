
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Checkbox } from '@/components/ui/checkbox';
import { defaultThemeColors } from '@/utils/themeColors';
import { ColorPicker } from '@/components/ColorPicker';
import {
  Home,
  CircleHelp,
  CreditCard,
  Settings,
  AlertCircle,
  ChevronDown,
  Info,
  Check,
  Map,
  Plane,
  Train,
  Car,
  Bike,
  Bus,
  Ship
} from 'lucide-react';

const ColorSwatch = ({ color, name, hex }: { color: string, name: string, hex: string }) => {
  return (
    <div className="flex flex-col items-center">
      <div 
        className="w-16 h-16 rounded-lg shadow-md mb-2" 
        style={{ backgroundColor: hex }}
      />
      <span className="font-medium text-sm">{name}</span>
      <span className="text-xs text-muted-foreground">{hex}</span>
    </div>
  );
};

const DesignSystemShowcase = () => {
  const [demoColor, setDemoColor] = React.useState('#5B9CF6');

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="max-w-4xl mx-auto space-y-12">
        <section>
          <h1 className="text-3xl font-bold tracking-tight mb-2">LocaSimple Design System</h1>
          <p className="text-muted-foreground text-lg mb-6">
            Modern premium flat design with a subtle neumorphic touch
          </p>
          <Separator className="my-6" />
        </section>

        <section className="space-y-6">
          <h2 className="text-2xl font-semibold tracking-tight">Color Palette</h2>
          <p className="text-muted-foreground">
            Our premium palette combines elegance with functionality
          </p>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 mt-4">
            <ColorSwatch color="offwhite" name="Off-White" hex="#F9F9F9" />
            <ColorSwatch color="velvetgray" name="Velvet Gray" hex="#EAEAEA" />
            <ColorSwatch color="slateblue" name="Slate Blue" hex="#273647" />
            <ColorSwatch color="sagegreen" name="Sage Green" hex="#A9B7AC" />
            <ColorSwatch color="copper" name="Copper" hex="#C7956D" />
            <ColorSwatch color="electricblue" name="Electric Blue" hex="#5B9CF6" />
          </div>

          <div className="mt-8 space-y-4">
            <h3 className="text-xl font-medium">Functional Colors</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
              <ColorSwatch color="success" name="Success" hex={defaultThemeColors.success} />
              <ColorSwatch color="error" name="Error" hex={defaultThemeColors.error} />
              <ColorSwatch color="warning" name="Warning" hex={defaultThemeColors.warning} />
              <ColorSwatch color="info" name="Info" hex={defaultThemeColors.info} />
            </div>
          </div>
          
          <div className="mt-8 space-y-4">
            <h3 className="text-xl font-medium">Transportation Mode Colors</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
              <ColorSwatch color="bus" name="Bus" hex={defaultThemeColors.bus} />
              <ColorSwatch color="car" name="Car" hex={defaultThemeColors.car} />
              <ColorSwatch color="bike" name="Bike" hex={defaultThemeColors.bike} />
              <ColorSwatch color="train" name="Train" hex={defaultThemeColors.train} />
              <ColorSwatch color="plane" name="Plane" hex={defaultThemeColors.plane} />
              <ColorSwatch color="ship" name="Ship" hex={defaultThemeColors.ship} />
            </div>
          </div>
        </section>

        <Separator />

        <section className="space-y-6">
          <h2 className="text-2xl font-semibold tracking-tight">Typography</h2>
          <p className="text-muted-foreground">
            Clean, modern sans-serif typography using Inter, SF Pro Text, and Manrope
          </p>

          <div className="space-y-4 mt-4">
            <div>
              <h1 className="text-4xl font-bold">Heading 1</h1>
              <p className="text-sm text-muted-foreground">Font family: Inter, SF Pro Display, Manrope</p>
            </div>
            <div>
              <h2 className="text-3xl font-bold">Heading 2</h2>
              <p className="text-sm text-muted-foreground">Font family: Inter, SF Pro Display, Manrope</p>
            </div>
            <div>
              <h3 className="text-2xl font-bold">Heading 3</h3>
              <p className="text-sm text-muted-foreground">Font family: Inter, SF Pro Display, Manrope</p>
            </div>
            <div>
              <h4 className="text-xl font-medium">Heading 4</h4>
              <p className="text-sm text-muted-foreground">Font family: Inter, SF Pro Display, Manrope</p>
            </div>
            <div>
              <p className="text-base">Body text - This is our standard body text used throughout the application.</p>
              <p className="text-sm text-muted-foreground">Font family: Inter, SF Pro Text, Manrope</p>
            </div>
            <div>
              <p className="text-sm">Small text - Used for captions, notes and smaller UI elements.</p>
              <p className="text-sm text-muted-foreground">Font family: Inter, SF Pro Text, Manrope</p>
            </div>
          </div>
        </section>

        <Separator />

        <section className="space-y-6">
          <h2 className="text-2xl font-semibold tracking-tight">Buttons</h2>
          <p className="text-muted-foreground">
            Clean button styles with subtle hover effects
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
            <div className="space-y-2">
              <Button>Default</Button>
              <p className="text-xs text-muted-foreground">Primary action</p>
            </div>
            <div className="space-y-2">
              <Button variant="secondary">Secondary</Button>
              <p className="text-xs text-muted-foreground">Secondary action</p>
            </div>
            <div className="space-y-2">
              <Button variant="outline">Outline</Button>
              <p className="text-xs text-muted-foreground">Alternative action</p>
            </div>
            <div className="space-y-2">
              <Button variant="ghost">Ghost</Button>
              <p className="text-xs text-muted-foreground">Subtle action</p>
            </div>
            <div className="space-y-2">
              <Button variant="destructive">Destructive</Button>
              <p className="text-xs text-muted-foreground">Dangerous action</p>
            </div>
            <div className="space-y-2">
              <Button size="sm">Small</Button>
              <p className="text-xs text-muted-foreground">Compact size</p>
            </div>
            <div className="space-y-2">
              <Button size="lg">Large</Button>
              <p className="text-xs text-muted-foreground">Larger size</p>
            </div>
            <div className="space-y-2">
              <Button size="icon"><Settings className="h-4 w-4" /></Button>
              <p className="text-xs text-muted-foreground">Icon button</p>
            </div>
          </div>

          <div className="mt-6">
            <h3 className="text-lg font-medium mb-2">Premium Styled Button</h3>
            <div className="p-4 rounded-xl bg-gradient-to-r from-background to-muted/50 border border-border shadow-sm">
              <Button className="bg-gradient-to-br from-electricblue to-electricblue/80 hover:from-electricblue/90 hover:to-electricblue/70 transition-all duration-300 hover:shadow-md hover:-translate-y-0.5">
                Premium Button
              </Button>
            </div>
          </div>
        </section>

        <Separator />

        <section className="space-y-6">
          <h2 className="text-2xl font-semibold tracking-tight">Cards</h2>
          <p className="text-muted-foreground">
            Elegant card components with subtle neumorphic styling
          </p>

          <div className="grid md:grid-cols-2 gap-6 mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Standard Card</CardTitle>
                <CardDescription>Basic card with header, content and footer</CardDescription>
              </CardHeader>
              <CardContent>
                <p>This is the standard card component used throughout the application for content containers.</p>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="ghost">Cancel</Button>
                <Button>Save</Button>
              </CardFooter>
            </Card>

            <div className="neu-card">
              <div className="p-6 border-b border-border">
                <h3 className="text-xl font-medium">Neumorphic Card</h3>
                <p className="text-muted-foreground text-sm">Premium card with soft shadows</p>
              </div>
              <div className="p-6">
                <p>This neumorphic card design adds subtle depth with soft shadows while maintaining a premium flat aesthetic.</p>
              </div>
              <div className="p-6 flex justify-end">
                <Button className="bg-copper text-white hover:bg-copper/90">Action</Button>
              </div>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="rounded-xl overflow-hidden card-gradient border border-border/50 p-4 space-y-3 hover-lift">
              <div className="bg-gradient-to-br from-electricblue/20 to-electricblue/10 p-3 rounded-lg w-10 h-10 flex items-center justify-center">
                <Map className="text-electricblue" />
              </div>
              <h3 className="font-medium">Location Finding</h3>
              <p className="text-sm text-muted-foreground">Find locations easily with our advanced mapping system</p>
            </div>
            
            <div className="rounded-xl overflow-hidden card-gradient border border-border/50 p-4 space-y-3 hover-lift">
              <div className="bg-gradient-to-br from-copper/20 to-copper/10 p-3 rounded-lg w-10 h-10 flex items-center justify-center">
                <CreditCard className="text-copper" />
              </div>
              <h3 className="font-medium">Easy Payments</h3>
              <p className="text-sm text-muted-foreground">Seamlessly manage your transactions and payments</p>
            </div>
            
            <div className="rounded-xl overflow-hidden card-gradient border border-border/50 p-4 space-y-3 hover-lift">
              <div className="bg-gradient-to-br from-sagegreen/20 to-sagegreen/10 p-3 rounded-lg w-10 h-10 flex items-center justify-center">
                <Settings className="text-sagegreen" />
              </div>
              <h3 className="font-medium">Customization</h3>
              <p className="text-sm text-muted-foreground">Personalize your experience with powerful settings</p>
            </div>
          </div>
        </section>

        <Separator />

        <section className="space-y-6">
          <h2 className="text-2xl font-semibold tracking-tight">Badges & Tags</h2>
          <p className="text-muted-foreground">Compact indicators for status and categories</p>

          <div className="flex flex-wrap gap-2 mt-4">
            <Badge>Default</Badge>
            <Badge variant="secondary">Secondary</Badge>
            <Badge variant="destructive">Destructive</Badge>
            <Badge variant="outline">Outline</Badge>
            <Badge className="bg-copper text-white hover:bg-copper/90">Custom</Badge>
            <Badge className="bg-electricblue text-white hover:bg-electricblue/90">Electric Blue</Badge>
            <Badge className="bg-sagegreen text-white hover:bg-sagegreen/90">Sage Green</Badge>
            <Badge className="bg-slateblue text-white hover:bg-slateblue/90">Slate Blue</Badge>
          </div>
        </section>

        <Separator />

        <section className="space-y-6">
          <h2 className="text-2xl font-semibold tracking-tight">Icons</h2>
          <p className="text-muted-foreground">Clean, consistent iconography using Lucide icons</p>

          <div className="flex flex-wrap gap-6 mt-4">
            <div className="flex flex-col items-center gap-1">
              <div className="bg-background p-3 rounded-lg border border-border">
                <Home className="h-6 w-6 text-electricblue" />
              </div>
              <span className="text-xs text-muted-foreground">Home</span>
            </div>
            
            <div className="flex flex-col items-center gap-1">
              <div className="bg-background p-3 rounded-lg border border-border">
                <Settings className="h-6 w-6 text-slateblue" />
              </div>
              <span className="text-xs text-muted-foreground">Settings</span>
            </div>
            
            <div className="flex flex-col items-center gap-1">
              <div className="bg-background p-3 rounded-lg border border-border">
                <CircleHelp className="h-6 w-6 text-copper" />
              </div>
              <span className="text-xs text-muted-foreground">Help</span>
            </div>
            
            <div className="flex flex-col items-center gap-1">
              <div className="bg-background p-3 rounded-lg border border-border">
                <Map className="h-6 w-6 text-sagegreen" />
              </div>
              <span className="text-xs text-muted-foreground">Map</span>
            </div>
          </div>

          <div className="mt-6">
            <h3 className="text-lg font-medium mb-3">Transport Mode Icons</h3>
            <div className="flex flex-wrap gap-6">
              <div className="flex flex-col items-center gap-1">
                <div className="bg-background p-3 rounded-lg border border-border">
                  <Car className="h-6 w-6" style={{ color: defaultThemeColors.car }} />
                </div>
                <span className="text-xs text-muted-foreground">Car</span>
              </div>
              
              <div className="flex flex-col items-center gap-1">
                <div className="bg-background p-3 rounded-lg border border-border">
                  <Bus className="h-6 w-6" style={{ color: defaultThemeColors.bus }} />
                </div>
                <span className="text-xs text-muted-foreground">Bus</span>
              </div>
              
              <div className="flex flex-col items-center gap-1">
                <div className="bg-background p-3 rounded-lg border border-border">
                  <Train className="h-6 w-6" style={{ color: defaultThemeColors.train }} />
                </div>
                <span className="text-xs text-muted-foreground">Train</span>
              </div>
              
              <div className="flex flex-col items-center gap-1">
                <div className="bg-background p-3 rounded-lg border border-border">
                  <Bike className="h-6 w-6" style={{ color: defaultThemeColors.bike }} />
                </div>
                <span className="text-xs text-muted-foreground">Bike</span>
              </div>
              
              <div className="flex flex-col items-center gap-1">
                <div className="bg-background p-3 rounded-lg border border-border">
                  <Plane className="h-6 w-6" style={{ color: defaultThemeColors.plane }} />
                </div>
                <span className="text-xs text-muted-foreground">Plane</span>
              </div>
              
              <div className="flex flex-col items-center gap-1">
                <div className="bg-background p-3 rounded-lg border border-border">
                  <Ship className="h-6 w-6" style={{ color: defaultThemeColors.ship }} />
                </div>
                <span className="text-xs text-muted-foreground">Ship</span>
              </div>
            </div>
          </div>
        </section>

        <Separator />

        <section className="space-y-6">
          <h2 className="text-2xl font-semibold tracking-tight">UI Components</h2>
          <p className="text-muted-foreground">
            Collection of UI components styled with our premium design system
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Accordion</CardTitle>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="item-1">
                    <AccordionTrigger>What is LocaSimple?</AccordionTrigger>
                    <AccordionContent>
                      LocaSimple is a premium location discovery and navigation platform with a modern, elegant interface.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-2">
                    <AccordionTrigger>How do I use it?</AccordionTrigger>
                    <AccordionContent>
                      Simply enter your location and search for places of interest around you. Our intuitive interface makes discovery easy.
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Alerts</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertTitle>Information</AlertTitle>
                  <AlertDescription>
                    This is an informational alert for the user.
                  </AlertDescription>
                </Alert>
                
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>
                    Something went wrong. Please try again later.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Collapsible</CardTitle>
              </CardHeader>
              <CardContent>
                <Collapsible className="w-full">
                  <div className="flex items-center justify-between space-x-4 px-4 py-2 rounded-lg border border-border">
                    <h4 className="text-sm font-semibold">Advanced Settings</h4>
                    <CollapsibleTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <ChevronDown className="h-4 w-4" />
                        <span className="sr-only">Toggle</span>
                      </Button>
                    </CollapsibleTrigger>
                  </div>
                  <CollapsibleContent className="p-4 border border-t-0 rounded-b-lg border-border">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox id="terms" />
                        <label
                          htmlFor="terms"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          Enable notifications
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="privacy" />
                        <label
                          htmlFor="privacy"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          Share location data
                        </label>
                      </div>
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Color Picker</CardTitle>
                <CardDescription>Customizable color selection component</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center space-y-4">
                <div 
                  className="w-24 h-24 rounded-full" 
                  style={{ backgroundColor: demoColor }}
                />
                <div className="flex items-center gap-2">
                  <span className="font-medium">Customize:</span>
                  <ColorPicker
                    currentColor={demoColor}
                    onColorChange={setDemoColor}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <Separator />

        <section className="space-y-6 mb-10">
          <h2 className="text-2xl font-semibold tracking-tight">Animations & Effects</h2>
          <p className="text-muted-foreground">
            Subtle animations and hover effects for an interactive experience
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-4">
            <div className="p-4 rounded-xl border border-border transition-all duration-300 hover:shadow-md hover:-translate-y-1 hover:bg-muted/50">
              <h3 className="font-medium">Hover Lift</h3>
              <p className="text-sm text-muted-foreground mt-1">Subtle elevation on hover</p>
            </div>
            
            <div className="p-4 rounded-xl border border-border bg-gradient-to-r from-background to-muted/50 transition-all duration-300">
              <h3 className="font-medium">Gradient Background</h3>
              <p className="text-sm text-muted-foreground mt-1">Subtle gradient effect</p>
            </div>
            
            <div className="p-4 rounded-xl border border-border overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-background/20 to-transparent animate-[shimmer_2s_infinite] -translate-x-full"></div>
              <h3 className="font-medium">Shimmer Effect</h3>
              <p className="text-sm text-muted-foreground mt-1">Loading state animation</p>
            </div>
            
            <div className="neu-card transition-all duration-300 p-4">
              <h3 className="font-medium">Neumorphic</h3>
              <p className="text-sm text-muted-foreground mt-1">Soft shadows for depth</p>
            </div>
            
            <div className="btn-3d p-4 rounded-xl border border-border bg-gradient-to-br from-electricblue/10 to-transparent">
              <h3 className="font-medium">3D Button Effect</h3>
              <p className="text-sm text-muted-foreground mt-1">Press effect for buttons</p>
            </div>
            
            <div className="glass-effect p-4 rounded-xl">
              <h3 className="font-medium">Glass Morphism</h3>
              <p className="text-sm text-muted-foreground mt-1">Transparent glass effect</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default DesignSystemShowcase;
