
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const ColorBox = ({ color, name, hexCode }: { color: string, name: string, hexCode: string }) => (
  <div className="flex flex-col items-center space-y-2">
    <div 
      className={`w-20 h-20 rounded-lg shadow-md`} 
      style={{ backgroundColor: hexCode }}
    />
    <div className="text-center">
      <p className="text-sm font-semibold">{name}</p>
      <p className="text-xs text-muted-foreground">{hexCode}</p>
    </div>
  </div>
);

export const ColorPaletteShowcase = () => {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Color Palette</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <h3 className="font-medium mb-3">Main Colors</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            <ColorBox color="slateblue" name="Slate Blue" hexCode="#273647" />
            <ColorBox color="sagegreen" name="Sage Green" hexCode="#A9B7AC" />
            <ColorBox color="copper" name="Copper" hexCode="#C7956D" />
            <ColorBox color="electricblue" name="Electric Blue" hexCode="#5B9CF6" />
            <ColorBox color="offwhite" name="Off White" hexCode="#F9F9F9" />
            <ColorBox color="velvetgray" name="Velvet Gray" hexCode="#EAEAEA" />
          </div>
        </div>

        <Separator className="my-6" />

        <div className="mb-6">
          <h3 className="font-medium mb-3">Slate Blue Variants</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            <ColorBox color="slateblue-light" name="Light" hexCode="#3A4D61" />
            <ColorBox color="slateblue" name="Default" hexCode="#273647" />
            <ColorBox color="slateblue-dark" name="Dark" hexCode="#1A2430" />
          </div>
        </div>

        <Separator className="my-6" />

        <div className="mb-6">
          <h3 className="font-medium mb-3">Sage Green Variants</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            <ColorBox color="sagegreen-light" name="Light" hexCode="#C5D0C8" />
            <ColorBox color="sagegreen" name="Default" hexCode="#A9B7AC" />
            <ColorBox color="sagegreen-dark" name="Dark" hexCode="#8A9690" />
          </div>
        </div>

        <Separator className="my-6" />

        <div className="mb-6">
          <h3 className="font-medium mb-3">Copper Variants</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            <ColorBox color="copper-light" name="Light" hexCode="#D8B292" />
            <ColorBox color="copper" name="Default" hexCode="#C7956D" />
            <ColorBox color="copper-dark" name="Dark" hexCode="#A77A55" />
          </div>
        </div>

        <Separator className="my-6" />

        <div className="mb-6">
          <h3 className="font-medium mb-3">Electric Blue Variants</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            <ColorBox color="electricblue-light" name="Light" hexCode="#83B5F8" />
            <ColorBox color="electricblue" name="Default" hexCode="#5B9CF6" />
            <ColorBox color="electricblue-dark" name="Dark" hexCode="#3D7FD8" />
          </div>
        </div>

        <Separator className="my-6" />

        <div>
          <h3 className="font-medium mb-3">Neutral Variants</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            <ColorBox color="offwhite-light" name="Off White Light" hexCode="#FFFFFF" />
            <ColorBox color="offwhite" name="Off White Default" hexCode="#F9F9F9" />
            <ColorBox color="offwhite-dark" name="Off White Dark" hexCode="#F0F0F0" />
            <ColorBox color="velvetgray-light" name="Velvet Gray Light" hexCode="#F5F5F5" />
            <ColorBox color="velvetgray" name="Velvet Gray Default" hexCode="#EAEAEA" />
            <ColorBox color="velvetgray-dark" name="Velvet Gray Dark" hexCode="#D0D0D0" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ColorPaletteShowcase;
