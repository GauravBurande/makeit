import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "./input";

const Test = () => {
  return (
    <section
      className="p-8 space-y-8 max-w-3xl mx-auto"
      style={{ backgroundColor: "hsl(var(--background))" }}
    >
      <h1
        className="text-3xl font-bold text-center"
        style={{ color: "hsl(var(--foreground))" }}
      >
        CSS Variables Test
      </h1>

      <div className="space-y-6">
        <h2 className="text-xl font-semibold">Button Variants</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          <div className="space-y-2">
            <p className="font-medium">Default (Primary)</p>
            <Button variant="default">Default Button</Button>
          </div>
          <div className="space-y-2">
            <p className="font-medium">Secondary</p>
            <Button variant="secondary">Secondary Button</Button>
          </div>
          <div className="space-y-2">
            <p className="font-medium">Outline</p>
            <Button variant="outline">Outline Button</Button>
          </div>
          <div className="space-y-2">
            <p className="font-medium">Ghost</p>
            <Button variant="ghost">Ghost Button</Button>
          </div>
          <div className="space-y-2">
            <p className="font-medium">Link</p>
            <Button variant="link">Link Button</Button>
          </div>
          <div className="space-y-2">
            <p className="font-medium">Destructive</p>
            <Button variant="destructive">Destructive Button</Button>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <h2 className="text-xl font-semibold">Text Colors</h2>
        <div className="space-y-2">
          <p className="text-accent">Accent Color Text</p>
          <p className="text-muted-foreground">Muted Foreground Text</p>
        </div>
      </div>

      <div className="space-y-6">
        <h2 className="text-xl font-semibold">Background Colors</h2>
        <div className="space-y-4">
          <div
            className="p-4 rounded"
            style={{
              backgroundColor: "hsl(var(--card))",
              color: "hsl(var(--card-foreground))",
            }}
          >
            <p>Card Background with Card Foreground Text</p>
          </div>
          <div
            className="p-4 rounded"
            style={{
              backgroundColor: "hsl(var(--popover))",
              color: "hsl(var(--popover-foreground))",
            }}
          >
            <p>Popover Background with Popover Foreground Text</p>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <h2 className="text-xl font-semibold">Other Elements</h2>
        <div className="space-y-4">
          <div
            className="p-4 border rounded"
            style={{ borderColor: "hsl(var(--border))" }}
          >
            <p>Border Color Example</p>
          </div>
          <div className="space-y-2">
            <p className="font-medium">Input</p>
            <Input placeholder="Input example" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Test;
