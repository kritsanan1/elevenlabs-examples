"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ConfigurationPopup } from "./ConfigurationPopup";
import { useConfigurationPopup } from "@/hooks/useConfigurationPopup";

/**
 * Demo component to showcase different ConfigurationPopup variations
 */
export function ConfigurationPopupDemo() {
  const [showBasic, setShowBasic] = useState(false);
  const [showCustom, setShowCustom] = useState(false);
  const autoPopup = useConfigurationPopup(true); // Auto-show when not configured

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          ⚙️ Configuration Popup Demo
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Basic Setup Popup */}
          <div className="space-y-3">
            <h3 className="font-medium text-gray-800">Basic Setup Popup</h3>
            <p className="text-sm text-gray-600">
              Standard configuration popup with amber theme matching the existing design.
            </p>
            <Button
              onClick={() => setShowBasic(true)}
              className="w-full bg-amber-600 text-white hover:bg-amber-700"
            >
              Show Setup Required
            </Button>
          </div>

          {/* Custom Configuration Popup */}
          <div className="space-y-3">
            <h3 className="font-medium text-gray-800">Custom Configuration</h3>
            <p className="text-sm text-gray-600">
              Customized popup with different title and description text.
            </p>
            <Button
              onClick={() => setShowCustom(true)}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700"
            >
              Show Configuration Required
            </Button>
          </div>

          {/* Auto-Show Popup */}
          <div className="space-y-3">
            <h3 className="font-medium text-gray-800">Auto-Show Popup</h3>
            <p className="text-sm text-gray-600">
              Automatically shows when configuration is missing. Status: {autoPopup.isConfigured ? "✅ Configured" : "❌ Missing"}
            </p>
            <Button
              onClick={autoPopup.showPopup}
              variant="outline"
              className="w-full"
              disabled={autoPopup.isConfigured}
            >
              {autoPopup.isConfigured ? "Configuration Complete" : "Check Auto-Show"}
            </Button>
          </div>

          {/* Status Information */}
          <div className="space-y-3">
            <h3 className="font-medium text-gray-800">Configuration Status</h3>
            <div className="p-3 bg-gray-50 rounded-lg text-sm space-y-1">
              <div className="flex items-center gap-2">
                <span className={autoPopup.isConfigured ? "text-green-600" : "text-red-500"}>
                  {autoPopup.isConfigured ? "✅" : "❌"}
                </span>
                <span>Configuration Status</span>
              </div>
              <div className="text-xs text-gray-600">
                {autoPopup.hasChecked ? 
                  (autoPopup.isConfigured ? "Ready to use" : "Setup required") :
                  "Checking..."
                }
              </div>
            </div>
            <Button
              onClick={autoPopup.refreshConfiguration}
              variant="outline"
              size="sm"
              className="w-full"
            >
              🔄 Refresh Status
            </Button>
          </div>
        </div>

        {/* Integration Examples */}
        <div className="border-t pt-6">
          <h3 className="font-medium text-gray-800 mb-3">Integration Examples</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="bg-blue-50 p-3 rounded-lg">
              <h4 className="font-medium text-blue-800 mb-2">ConvAI Component</h4>
              <p className="text-blue-700 text-xs">
                Basic conversation component with setup popup triggered when configuration is missing.
              </p>
            </div>
            <div className="bg-purple-50 p-3 rounded-lg">
              <h4 className="font-medium text-purple-800 mb-2">Advanced Component</h4>
              <p className="text-purple-700 text-xs">
                Advanced conversation features with configuration popup for enhanced setup guidance.
              </p>
            </div>
          </div>
        </div>

        {/* Theme Information */}
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <h4 className="font-medium text-amber-800 mb-2 flex items-center gap-2">
            🎨 Theme Design
          </h4>
          <div className="text-sm text-amber-700 space-y-1">
            <p>• <strong>Primary:</strong> Amber colors matching existing configuration warnings</p>
            <p>• <strong>Actions:</strong> Gradient buttons for guided setup, amber for quick setup</p>
            <p>• <strong>Status:</strong> Green for success, red for errors, amber for warnings</p>
            <p>• <strong>Layout:</strong> Responsive modal with backdrop, matching shadcn/ui design</p>
          </div>
        </div>
      </CardContent>

      {/* Popup Components */}
      <ConfigurationPopup
        isVisible={showBasic}
        onClose={() => setShowBasic(false)}
        title="Setup Required"
        description="Basic setup configuration needed"
      />

      <ConfigurationPopup
        isVisible={showCustom}
        onClose={() => setShowCustom(false)}
        title="Configuration Required"
        description="Custom setup message for advanced features"
      />
    </Card>
  );
}
