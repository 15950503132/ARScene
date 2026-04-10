import React, { useState, useEffect } from 'react';
import { ModelViewer } from './components/ModelViewer';
import { Sidebar } from './components/Sidebar';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';

export default function App() {
  const [modelUrl, setModelUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [settings, setSettings] = useState({
    color: '#C0C0C0',
    wireframe: false,
    opacity: 1,
    autoRotate: true,
    environment: 'city',
    cameraBackground: false,
  });

  const handleFileUpload = (file: File) => {
    if (modelUrl) {
      URL.revokeObjectURL(modelUrl);
    }
    
    const url = URL.createObjectURL(file);
    setModelUrl(url);
    setFileName(file.name);
  };

  useEffect(() => {
    return () => {
      if (modelUrl) {
        URL.revokeObjectURL(modelUrl);
      }
    };
  }, [modelUrl]);

  return (
    <TooltipProvider>
      <div className="flex h-screen w-screen bg-zinc-950 text-zinc-100 overflow-hidden relative">
        {/* Desktop Sidebar */}
        <div className="hidden md:block w-80 border-r border-zinc-800">
          <Sidebar 
            settings={settings} 
            setSettings={setSettings} 
            onFileUpload={handleFileUpload}
            fileName={fileName}
          />
        </div>

        {/* Mobile Sidebar (Sheet) */}
        <div className="md:hidden absolute top-4 left-4 z-50">
          <Sheet>
            <SheetTrigger>
              <Button variant="outline" size="icon" className="bg-zinc-900/50 border-zinc-800 backdrop-blur-sm">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-80 bg-zinc-950 border-zinc-800">
              <Sidebar 
                settings={settings} 
                setSettings={setSettings} 
                onFileUpload={handleFileUpload}
                fileName={fileName}
              />
            </SheetContent>
          </Sheet>
        </div>

        <main className="flex-1 relative">
          <ModelViewer modelUrl={modelUrl} settings={settings} />
        </main>
      </div>
    </TooltipProvider>
  );
}
