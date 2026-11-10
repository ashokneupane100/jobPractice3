"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from "@/components/ui/dialog";
import { AlertCircle } from "lucide-react";
import { PricingTable } from "@clerk/nextjs";

const UpgradeModal = ({ open, onOpenChange, reason }) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="border-amber-200/10 min-w-[70vw] max-h-[90vh] overflow-y-scroll">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
            <DialogTitle>Upgrade Your Plan</DialogTitle>
          </div>
          {reason && (
            <DialogDescription className="text-amber-400 mt-1">{reason}</DialogDescription>
          )}
        </DialogHeader>

        <div className="px-2 pb-6">
          <PricingTable
            checkoutProps={{
              appearance: {
                elements: {
                  drawerRoot: {
                    zIndex: 2000,
                  },
                },
              },
            }}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UpgradeModal;