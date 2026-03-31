"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogFooter,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { getLoyaltySettings, LoyaltySettings } from "@/services/queries/refer-and-earn/get/get-loyalty-settings";
import { updateLoyaltySettings } from "@/services/queries/refer-and-earn/put/put-update-loyality-settings";
import { updateSignupDiscount } from "@/services/queries/refer-and-earn/patch/patch-update-signup-discount";
import EditIcon from "@/public/edit-icon";

export function LoyaltySettingsCards() {
  const [settings, setSettings] = useState<LoyaltySettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isEditingDiscount, setIsEditingDiscount] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    pointsPerReferral: 0,
    signupDiscountPercent: 0,
    isReferralEnabled: false,
    isRedemptionEnabled: false,
  });

  const fetchSettings = async () => {
    setIsLoading(true);
    const res = await getLoyaltySettings();
    if (res.success && res.data) {
      setSettings(res.data);
      setFormData({
        pointsPerReferral: res.data.pointsPerReferral,
        signupDiscountPercent: res.data.signupDiscountPercent,
        isReferralEnabled: res.data.isReferralEnabled,
        isRedemptionEnabled: res.data.isRedemptionEnabled,
      });
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleSave = async () => {
    const resLoyalty = await updateLoyaltySettings({
      pointsPerReferral: formData.pointsPerReferral,
      signupDiscountPercent: formData.signupDiscountPercent,
      isReferralEnabled: formData.isReferralEnabled,
      isRedemptionEnabled: formData.isRedemptionEnabled
    });

    if (resLoyalty.success) {
      toast.success("Settings updated successfully");
      fetchSettings();
      setIsEditing(false);
    } else {
      toast.error(resLoyalty.message);
    }
  };

  const handleDiscountSave = async () => {
    const resDiscount = await updateSignupDiscount({
      signupDiscountPercent: formData.signupDiscountPercent
    });

    if (resDiscount.success) {
      toast.success("Signup discount updated successfully");
      fetchSettings();
      setIsEditingDiscount(false);
    } else {
      toast.error(resDiscount.message);
    }
  };

  return (
    <div className="flex flex-col gap-4 mt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-medium">Loyalty Settings</h2>
        <Button onClick={() => setIsEditing(true)} className="bg-primary-blue hover:bg-primary-blue-hover px-4 py-5">
          <EditIcon className="w-5! h-5!" />
          Edit Settings
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <Card>
          <CardHeader className="pb-0">
            <CardTitle className="text-lg text-natural-text font-normal">Points Per Referral</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold">
              {isLoading ? "..." : settings?.pointsPerReferral}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-0 flex flex-row items-center justify-between">
            <CardTitle className="text-lg text-natural-text font-normal">Signup Discount</CardTitle>
            <Button variant="ghost" className="h-8 w-8 p-0 text-primary-blue hover:text-primary-blue-hover hover:bg-primary-blue/10" onClick={() => setIsEditingDiscount(true)}>
              <EditIcon className="w-5! h-5!" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold">
              {isLoading ? "..." : `${settings?.signupDiscountPercent}%`}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-0">
            <CardTitle className="text-lg text-natural-text font-normal">Referral System</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-semibold ${settings?.isReferralEnabled ? "text-success" : "text-danger"}`}>
              {isLoading ? "..." : (settings?.isReferralEnabled ? "Active" : "Inactive")}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-0">
            <CardTitle className="text-lg text-natural-text font-normal">Redemption</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-semibold ${settings?.isRedemptionEnabled ? "text-success" : "text-danger"}`}>
              {isLoading ? "..." : (settings?.isRedemptionEnabled ? "Active" : "Inactive")}
            </div>
          </CardContent>
        </Card>
      </div>

      <AlertDialog open={isEditing} onOpenChange={setIsEditing}>
        <AlertDialogContent className="sm:max-w-[425px]">
          <AlertDialogHeader>
            <AlertDialogTitle>Edit Loyalty Settings</AlertDialogTitle>
          </AlertDialogHeader>
          <div className="grid gap-6 py-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 items-center gap-4">
              <Label htmlFor="points" className="col-span-2 text-natural-text">
                Points Per Referral
              </Label>
              <Input
                id="points"
                type="number"
                value={formData.pointsPerReferral}
                onChange={(e) => setFormData({ ...formData, pointsPerReferral: Number(e.target.value) })}
                className="col-span-2"
                min={0}
              />
            </div>


            <div className="flex items-center justify-between pt-4">
              <Label htmlFor="referral" className="cursor-pointer text-natural-text">Enable Referral System</Label>
              <Checkbox
                id="referral"
                checked={formData.isReferralEnabled}
                onCheckedChange={(checked) => setFormData({ ...formData, isReferralEnabled: !!checked })}
                className="w-5 h-5 rounded"
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="redemption" className="cursor-pointer text-natural-text">Enable Point Redemption</Label>
              <Checkbox
                id="redemption"
                checked={formData.isRedemptionEnabled}
                onCheckedChange={(checked) => setFormData({ ...formData, isRedemptionEnabled: !!checked })}
                className="w-5 h-5 rounded"
              />
            </div>
          </div>
          <AlertDialogFooter className="flex flex-row gap-3">
            <Button onClick={handleSave} className="w-full bg-primary-blue hover:bg-primary-blue-hover text-white rounded-lg px-6">
              Save
            </Button>
            <Button variant="ghost" onClick={() => setIsEditing(false)} className="w-full rounded-lg">
              Cancel
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={isEditingDiscount} onOpenChange={setIsEditingDiscount}>
        <AlertDialogContent className="sm:max-w-[425px]">
          <AlertDialogHeader>
            <AlertDialogTitle>Edit Signup Discount</AlertDialogTitle>
          </AlertDialogHeader>
          <div className="grid gap-6 py-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 items-center gap-4">
              <Label htmlFor="discount" className="col-span-2 text-natural-text">
                Signup Discount (%)
              </Label>
              <Input
                id="discount"
                type="number"
                value={formData.signupDiscountPercent}
                onChange={(e) => setFormData({ ...formData, signupDiscountPercent: Number(e.target.value) })}
                className="col-span-2"
                min={0}
                max={100}
              />
            </div>
          </div>
          <AlertDialogFooter className="flex flex-row gap-3">
            <Button onClick={handleDiscountSave} className="w-full bg-primary-blue hover:bg-primary-blue-hover text-white rounded-lg px-6">
              Save
            </Button>
            <Button variant="ghost" onClick={() => setIsEditingDiscount(false)} className="w-full rounded-lg">
              Cancel
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
