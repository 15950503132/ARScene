import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Upload, Box, Palette, BoxSelect, RotateCw, Layers, Eye, Info, Camera } from 'lucide-react';

interface SidebarProps {
  settings: {
    color: string;
    wireframe: boolean;
    opacity: number;
    autoRotate: boolean;
    environment: string;
    cameraBackground: boolean;
  };
  setSettings: React.Dispatch<React.SetStateAction<any>>;
  onFileUpload: (file: File) => void;
  fileName: string | null;
}

export function Sidebar({ settings, setSettings, onFileUpload, fileName }: SidebarProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.name.toLowerCase().endsWith('.stl')) {
      onFileUpload(file);
    }
  };

  const environments = [
    { id: 'city', name: 'City' },
    { id: 'sunset', name: 'Sunset' },
    { id: 'warehouse', name: 'Warehouse' },
    { id: 'forest', name: 'Forest' },
    { id: 'apartment', name: 'Apartment' },
    { id: 'studio', name: 'Studio' },
  ];

  const colors = [
    { name: 'Silver', value: '#C0C0C0' },
    { name: 'Gold', value: '#FFD700' },
    { name: 'Steel', value: '#71797E' },
    { name: 'Blue', value: '#3B82F6' },
    { name: 'Red', value: '#EF4444' },
    { name: 'Green', value: '#10B981' },
  ];

  return (
    <div className="w-full h-full flex flex-col overflow-hidden bg-zinc-950">
      <div className="p-6 border-b border-zinc-800">
        <div className="flex items-center gap-2 mb-2">
          <Box className="w-6 h-6 text-blue-500" />
          <h1 className="text-xl font-bold tracking-tight text-zinc-100">STL VR VIS</h1>
        </div>
        <p className="text-xs text-zinc-500 font-mono uppercase tracking-widest">v1.1.0 // AR Enhanced</p>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-6 space-y-8">
          {/* File Upload Section */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-mono uppercase text-zinc-500 tracking-wider">Source</Label>
              {fileName && <Badge variant="outline" className="text-[10px] border-zinc-700 text-zinc-400 max-w-[120px] truncate">{fileName}</Badge>}
            </div>
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              accept=".stl" 
              className="hidden" 
            />
            <Button 
              variant="outline" 
              className="w-full border-dashed border-zinc-700 hover:border-zinc-500 bg-zinc-900/50 h-24 flex flex-col gap-2"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="w-5 h-5 text-zinc-400" />
              <span className="text-xs font-medium text-zinc-300">Upload STL Model</span>
            </Button>
          </section>

          <Separator className="bg-zinc-800" />

          {/* Controls Section */}
          <Tabs defaultValue="visual" className="w-full">
            <TabsList className="w-full bg-zinc-900 border border-zinc-800 p-1">
              <TabsTrigger value="visual" className="flex-1 text-xs uppercase font-mono">Visual</TabsTrigger>
              <TabsTrigger value="scene" className="flex-1 text-xs uppercase font-mono">Scene</TabsTrigger>
            </TabsList>

            <TabsContent value="visual" className="pt-6 space-y-6">
              <div className="space-y-4">
                <Label className="text-xs font-mono uppercase text-zinc-500 tracking-wider flex items-center gap-2">
                  <Palette className="w-3 h-3" /> Material Color
                </Label>
                <div className="grid grid-cols-3 gap-2">
                  {colors.map((c) => (
                    <button
                      key={c.value}
                      className={`h-8 rounded-sm border transition-all ${settings.color === c.value ? 'border-white scale-105 ring-1 ring-white/20' : 'border-transparent hover:border-zinc-600'}`}
                      style={{ backgroundColor: c.value }}
                      onClick={() => setSettings({ ...settings, color: c.value })}
                      title={c.name}
                    />
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-xs font-mono uppercase text-zinc-500 tracking-wider flex items-center gap-2">
                    <Layers className="w-3 h-3" /> Opacity
                  </Label>
                  <span className="text-xs font-mono text-zinc-400">{Math.round(settings.opacity * 100)}%</span>
                </div>
                <Slider 
                  value={[settings.opacity]} 
                  min={0.1} 
                  max={1} 
                  step={0.01} 
                  onValueChange={(val: number[]) => setSettings({ ...settings, opacity: val[0] })}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label className="text-xs font-mono uppercase text-zinc-500 tracking-wider flex items-center gap-2">
                  <BoxSelect className="w-3 h-3" /> Wireframe
                </Label>
                <Switch 
                  checked={settings.wireframe} 
                  onCheckedChange={(v) => setSettings({ ...settings, wireframe: v })} 
                />
              </div>
            </TabsContent>

            <TabsContent value="scene" className="pt-6 space-y-6">
              <div className="flex items-center justify-between">
                <Label className="text-xs font-mono uppercase text-zinc-500 tracking-wider flex items-center gap-2">
                  <Camera className="w-3 h-3" /> Camera Background
                </Label>
                <Switch 
                  checked={settings.cameraBackground} 
                  onCheckedChange={(v) => setSettings({ ...settings, cameraBackground: v })} 
                />
              </div>

              {!settings.cameraBackground && (
                <div className="space-y-4">
                  <Label className="text-xs font-mono uppercase text-zinc-500 tracking-wider flex items-center gap-2">
                    <Eye className="w-3 h-3" /> Environment
                  </Label>
                  <div className="grid grid-cols-2 gap-2">
                    {environments.map((env) => (
                      <Button
                        key={env.id}
                        variant={settings.environment === env.id ? 'default' : 'outline'}
                        size="sm"
                        className="text-[10px] uppercase font-mono h-8"
                        onClick={() => setSettings({ ...settings, environment: env.id })}
                      >
                        {env.name}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between">
                <Label className="text-xs font-mono uppercase text-zinc-500 tracking-wider flex items-center gap-2">
                  <RotateCw className="w-3 h-3" /> Auto Rotate
                </Label>
                <Switch 
                  checked={settings.autoRotate} 
                  onCheckedChange={(v) => setSettings({ ...settings, autoRotate: v })} 
                />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </ScrollArea>

      <div className="p-6 border-t border-zinc-800 bg-zinc-900/30">
        <div className="flex items-start gap-3">
          <Info className="w-4 h-4 text-zinc-500 mt-0.5" />
          <p className="text-[10px] text-zinc-500 leading-relaxed">
            Enable "Camera Background" to use your phone's camera as the scene background. Use "AR Mode" for true augmented reality.
          </p>
        </div>
      </div>
    </div>
  );
}
