"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dropdown } from "@/components/ui/dropdown";
import { Copy, Check, Ticket, ArrowRight, CurrencyDollar, Percent, Clock, Infinity as InfinityIcon, ArrowsClockwise } from "@phosphor-icons/react";
import { api } from "@/lib/api";

export default function CouponCreator() {
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        code: "",
        type: "fixed",
        amount: "",
        duration: "once",
        durationInMonths: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            // Force uppercase for code
            [name]: name === "code" ? value.toUpperCase().replace(/[^A-Z0-9_-]/g, "") : value,
        }));
    };

    const handleDropdownChange = (name: string, value: string) => {
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(null);

        try {
            const data = await api.post("/coupons", {
                code: formData.code,
                type: formData.type,
                amount: Number(formData.amount),
                duration: formData.duration,
                duration_in_months: formData.duration === "repeating" ? Number(formData.durationInMonths) : null,
            });

            setSuccess(`https://heyaxle.click/${formData.code}`);
            setFormData({
                code: "",
                type: "fixed",
                amount: "",
                duration: "once",
                durationInMonths: "",
            });
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const copyToClipboard = () => {
        if (success) {
            navigator.clipboard.writeText(success);
        }
    };

    const typeOptions = [
        { id: "fixed", value: "fixed", label: "Fixed Amount ($)", icon: <CurrencyDollar size={18} /> },
        { id: "percentage", value: "percentage", label: "Percentage (%)", icon: <Percent size={18} /> },
    ];

    const durationOptions = [
        { id: "once", value: "once", label: "Once", icon: <Clock size={18} /> },
        { id: "forever", value: "forever", label: "Forever", icon: <InfinityIcon size={18} /> },
        { id: "repeating", value: "repeating", label: "Repeating", icon: <ArrowsClockwise size={18} /> },
    ];

    return (
        <div className="min-h-screen bg-gray-50/50 dark:bg-[#111] p-8 flex items-center justify-center relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-accent/5 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-accent/5 rounded-full blur-[100px] pointer-events-none" />

            <div className="w-full max-w-lg relative bg-white/80 dark:bg-[#1a1a1a]/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-200/50 dark:border-white/5 p-8 transition-all duration-300">

                <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 rounded-2xl bg-transparent flex items-center justify-center shadow-lg shadow-accent/20">
                        <Ticket weight="fill" className="text-accent w-6 h-6" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">Create Coupon</h1>
                        <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Generate specific discounts for customers</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Coupon Code */}
                    <Input
                        label="COUPON CODE"
                        id="code"
                        name="code"
                        placeholder="NEXIA_AXLE10"
                        value={formData.code}
                        onChange={handleChange}
                        required
                        className="font-mono uppercase text-gray-900 dark:text-white bg-white/50 dark:bg-black/10"
                        helperText="Auto-formatted to uppercase. Alphanumeric only."
                    />

                    <div className="grid grid-cols-2 gap-5">
                        {/* Discount Type */}
                        <Dropdown
                            label="TYPE"
                            value={formData.type}
                            onChange={(val) => handleDropdownChange("type", val)}
                            options={typeOptions}
                        />

                        {/* Amount */}
                        <div className="relative">
                            <Input
                                label={formData.type === "fixed" ? "AMOUNT ($)" : "PERCENTAGE (%)"}
                                id="amount"
                                name="amount"
                                type="number"
                                placeholder={formData.type === "fixed" ? "10" : "20"}
                                value={formData.amount}
                                onChange={handleChange}
                                required
                                min="1"
                                className="text-gray-900 dark:text-white bg-white/50 dark:bg-black/10"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-5">
                        {/* Duration */}
                        <Dropdown
                            label="DURATION"
                            value={formData.duration}
                            onChange={(val) => handleDropdownChange("duration", val)}
                            options={durationOptions}
                        />

                        {/* Duration Months (Conditional) */}
                        {formData.duration === "repeating" && (
                            <div className="animate-in fade-in slide-in-from-left-2 duration-300">
                                <Input
                                    label="MONTHS"
                                    id="durationInMonths"
                                    name="durationInMonths"
                                    type="number"
                                    placeholder="3"
                                    value={formData.durationInMonths}
                                    onChange={handleChange}
                                    required
                                    min="1"
                                    className="text-gray-900 dark:text-white bg-white/50 dark:bg-black/20"
                                />
                            </div>
                        )}
                    </div>

                    {error && (
                        <div className="bg-red-50 dark:bg-red-900/10 text-red-600 dark:text-red-400 p-4 rounded-xl text-sm border border-red-100 dark:border-red-900/20 font-medium flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
                            {error}
                        </div>
                    )}

                    <Button
                        type="submit"
                        className="w-full bg-accent hover:bg-accent/90 text-white rounded-xl py-3 font-semibold shadow-lg shadow-accent/20 transition-all active:scale-[0.98]"
                        loading={loading}
                        disabled={!formData.code || !formData.amount}
                    >
                        Create Coupon <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                </form>

                {/* Success / Result */}
                {success && (
                    <div className="mt-8 pt-8 border-t border-gray-100 dark:border-white/5 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <label className="block text-xs font-bold text-accent mb-3 uppercase tracking-wider flex items-center gap-2">
                            <Check weight="bold" className="w-4 h-4" />
                            Coupon Live
                        </label>
                        <div className="flex items-center gap-2 p-1.5 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl">
                            <div className="flex-1 px-3 py-2 text-sm font-mono text-gray-800 dark:text-gray-200 break-all">
                                {success}
                            </div>
                            <Button
                                variant="secondary"
                                size="sm"
                                onClick={copyToClipboard}
                                className="shrink-0 rounded-lg h-9 w-9 p-0 flex items-center justify-center bg-white dark:bg-white/10 shadow-sm"
                            >
                                <Copy className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
}
