"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Play, X } from "lucide-react";

interface IntroVideoProps {
  title: string;
  description?: string;
  videoUrl: string;
  thumbnailUrl: string;
}

export function IntroVideo({ title, description, videoUrl, thumbnailUrl }: IntroVideoProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [imageError, setImageError] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <div className="relative group cursor-pointer rounded-lg overflow-hidden border border-border">
          <div className="aspect-video w-full bg-muted relative">
            {thumbnailUrl && !imageError ? (
              <img 
                src={thumbnailUrl} 
                alt={title} 
                className="w-full h-full object-cover"
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-r from-blue-600/20 to-indigo-600/20">
                <div className="text-center">
                  <div className="mb-2 flex justify-center">
                    <Play className="h-12 w-12 text-primary" />
                  </div>
                  <span className="text-lg font-medium text-foreground">Portfolio Tutorial</span>
                </div>
              </div>
            )}
            <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="bg-primary text-primary-foreground rounded-full p-3 shadow-lg">
                <Play className="h-8 w-8" />
              </div>
            </div>
          </div>
          <div className="p-4">
            <h3 className="text-lg font-medium">{title}</h3>
            {description && <p className="text-sm text-muted-foreground mt-1">{description}</p>}
            <Button variant="outline" size="sm" className="mt-3">
              <Play className="h-4 w-4 mr-2" /> Watch Video
            </Button>
          </div>
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <Button 
            variant="ghost" 
            size="icon" 
            className="absolute right-4 top-4" 
            onClick={() => setIsOpen(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>
        <div className="aspect-video w-full">
          <iframe
            src={videoUrl}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full rounded-md"
          ></iframe>
        </div>
      </DialogContent>
    </Dialog>
  );
}
