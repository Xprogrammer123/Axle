"use client";

import { Fragment } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { CaretDown, Check } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

export interface DropdownOption {
    id: string;
    label: string;
    value: string;
    icon?: React.ReactNode;
    [key: string]: any;
}

interface DropdownProps {
    options: DropdownOption[];
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    className?: string;
    label?: string;
}

export function Dropdown({
    options,
    value,
    onChange,
    placeholder = "Select an option",
    className,
    label,
}: DropdownProps) {
    const selectedOption = options.find((opt) => opt.value === value);

    return (
        <div className={className}>
            {label && (
                <label className="text-dark/60 dark:text-white/60 text-xs font-semibold uppercase mb-1.5 block">
                    {label}
                </label>
            )}
            <Listbox value={value} onChange={onChange}>
                <div className="relative mt-1">
                    <Listbox.Button className="relative w-full cursor-pointer rounded-xl bg-dark/5 dark:bg-white/5 py-3 pl-3 pr-10 text-left text-sm text-dark dark:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
                        <span className="flex items-center gap-2 truncate">
                            {selectedOption ? (
                                <>
                                    {selectedOption.icon && (
                                        <span className="text-lg">{selectedOption.icon}</span>
                                    )}
                                    <span className="block truncate">{selectedOption.label}</span>
                                </>
                            ) : (
                                <span className="block truncate text-dark/40 dark:text-white/40">
                                    {placeholder}
                                </span>
                            )}
                        </span>
                        <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                            <CaretDown
                                className="h-4 w-4 text-dark/40 dark:text-white/40"
                                aria-hidden="true"
                            />
                        </span>
                    </Listbox.Button>
                    <Transition
                        as={Fragment}
                        leave="transition ease-in duration-100"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-xl bg-white dark:bg-[#1a1a1a] py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm z-50">
                            {options.map((option, optionIdx) => (
                                <Listbox.Option
                                    key={optionIdx}
                                    className={({ active }) =>
                                        `relative cursor-default select-none py-2 pl-10 pr-4 ${active
                                            ? "bg-accent/10 text-accent"
                                            : "text-dark dark:text-white"
                                        }`
                                    }
                                    value={option.value}
                                >
                                    {({ selected }) => (
                                        <>
                                            <span
                                                className={`flex items-center gap-2 truncate ${selected ? "font-medium" : "font-normal"
                                                    }`}
                                            >
                                                {option.icon && (
                                                    <span className="text-lg">{option.icon}</span>
                                                )}
                                                {option.label}
                                            </span>
                                            {selected ? (
                                                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-accent">
                                                    <Check className="h-5 w-5" aria-hidden="true" />
                                                </span>
                                            ) : null}
                                        </>
                                    )}
                                </Listbox.Option>
                            ))}
                        </Listbox.Options>
                    </Transition>
                </div>
            </Listbox>
        </div>
    );
}
