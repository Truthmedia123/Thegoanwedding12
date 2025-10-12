import React from 'react';
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";

const TestImports: React.FC = () => {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Test Imports</h1>
      <p className="mb-4">If you can see this page, the imports are working correctly.</p>
      <Button>Test Button</Button>
      <Toaster />
    </div>
  );
};

export default TestImports;