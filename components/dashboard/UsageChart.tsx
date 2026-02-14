"use client";

import React, { useMemo, useState } from "react";
import { CaretDown, CaretUp, Check, X } from "@phosphor-icons/react";
import { motion, AnimatePresence } from "framer-motion";

interface Agent {
    _id: string;
    name: string;
}

interface UsageChartProps {
    items?: { createdAt?: string; updatedAt?: string; agentId?: string }[];
    /** Account creation date string */
    accountCreatedAt?: string;
    agents?: Agent[];
}

const MONTH_LABELS = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

const DAY_LABELS = ["", "Mon", "", "Wed", "", "Fri", ""];

export const UsageChart: React.FC<UsageChartProps> = ({
    items = [],
    accountCreatedAt,
    agents = []
}) => {
    const [yearDropdownOpen, setYearDropdownOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState<string | null>(null);

    // 1. Determine available years range
    const { years, startYear } = useMemo(() => {
        const nowYr = new Date().getFullYear();
        const startYr = accountCreatedAt
            ? new Date(accountCreatedAt).getFullYear()
            : nowYr;

        const yrs: number[] = [];
        for (let y = startYr; y <= nowYr; y++) {
            yrs.push(y);
        }
        return { years: yrs.reverse(), startYear: startYr };
    }, [accountCreatedAt]);

    const [selectedYear, setSelectedYear] = useState<number>(startYear);

    // 2. Filter items for selected year
    // Also keep full item objects for the standard "count" map
    const { countMap, yearItems } = useMemo(() => {
        const map: Record<string, number> = {};
        const yrItems: typeof items = [];

        items.forEach((item) => {
            const ts = item.createdAt || item.updatedAt;
            if (!ts) return;
            const d = new Date(ts);
            if (d.getFullYear() !== selectedYear) return;

            const key = d.toISOString().slice(0, 10);
            map[key] = (map[key] || 0) + 1;
            yrItems.push(item);
        });
        return { countMap: map, yearItems: yrItems };
    }, [items, selectedYear]);

    // 3. Generate grid for the selected year
    const { grid, weeks } = useMemo(() => {
        const cells: { date: string; count: number; col: number; row: number; inYear: boolean }[] = [];

        const yearStart = new Date(selectedYear, 0, 1);
        const dayOffset = yearStart.getDay();
        const cursor = new Date(yearStart);
        cursor.setDate(cursor.getDate() - dayOffset);

        let col = 0;
        while (true) {
            if (cursor.getFullYear() > selectedYear) break;

            for (let row = 0; row < 7; row++) {
                const key = cursor.toISOString().slice(0, 10);
                const inYear = cursor.getFullYear() === selectedYear;

                cells.push({
                    date: key,
                    count: countMap[key] || 0,
                    col,
                    row,
                    inYear
                });

                cursor.setDate(cursor.getDate() + 1);
            }
            col++;
        }

        return { grid: cells, weeks: col };
    }, [selectedYear, countMap]);

    // Stats
    const totalRuns = useMemo(() => grid.reduce((s, c) => s + (c.inYear ? c.count : 0), 0), [grid]);
    const maxCount = useMemo(() => Math.max(...grid.map(c => c.count), 1), [grid]);

    // Month Labels
    const monthLabels = useMemo(() => {
        const labels: { label: string; col: number }[] = [];
        let lastMonth = -1;
        grid.forEach(cell => {
            const d = new Date(cell.date);
            if (d.getFullYear() === selectedYear) {
                const m = d.getMonth();
                if (m !== lastMonth && cell.row === 0) {
                    labels.push({ label: MONTH_LABELS[m], col: cell.col });
                    lastMonth = m;
                }
            }
        });
        return labels;
    }, [grid, selectedYear]);

    // Dimensions
    const CELL = 11; // Slightly smaller to fit layout
    const GAP = 3;
    const STEP = CELL + GAP;
    const WIDTH = weeks * STEP + 28;
    const HEIGHT = 7 * STEP + 24;

    const getLevel = (count: number) => {
        if (count === 0) return 0;
        const r = count / maxCount;
        if (r <= 0.25) return 1;
        if (r <= 0.5) return 2;
        if (r <= 0.75) return 3;
        return 4;
    };

    const getCellColor = (count: number, inYear: boolean) => {
        if (!inYear) return "transparent";
        const level = getLevel(count);
        if (level === 0) return "var(--activity-empty, rgba(0,0,0,0.25))";

        switch (level) {
            case 1: return "color-mix(in srgb, var(--color-accent, #6C5CE7) 30%, transparent)";
            case 2: return "color-mix(in srgb, var(--color-accent, #6C5CE7) 50%, transparent)";
            case 3: return "color-mix(in srgb, var(--color-accent, #6C5CE7) 70%, transparent)";
            case 4: return "var(--color-accent, #6C5CE7)";
            default: return "var(--activity-empty, rgba(0,0,0,0.25))";
        }
    };

    // Details Panel Logic
    const detailsData = useMemo(() => {
        if (!selectedDate) return null;

        // Find all runs for this date
        const dateRuns = yearItems.filter(item => {
            const ts = item.createdAt || item.updatedAt;
            if (!ts) return false;
            return new Date(ts).toISOString().slice(0, 10) === selectedDate;
        });

        if (dateRuns.length === 0) return [];

        // Group by agent
        const grouped: Record<string, { name: string; times: string[]; count: number }> = {};

        dateRuns.forEach(run => {
            const agentId = run.agentId || "unknown";
            const agentName = agents.find(a => a._id === agentId)?.name || "Unknown Agent";

            if (!grouped[agentId]) {
                grouped[agentId] = { name: agentName, times: [], count: 0 };
            }

            const timeStr = new Date(run.createdAt || run.updatedAt || "").toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            grouped[agentId].times.push(timeStr);
            grouped[agentId].count++;
        });

        return Object.values(grouped).sort((a, b) => b.count - a.count);
    }, [selectedDate, yearItems, agents]);

    return (
        <div className="bg-dark/3 dark:bg-white/1.5 w-full rounded-4xl p-5 shadow-lg shadow-dark/4 dark:shadow-black/10 flex flex-col xl:flex-row gap-8">

            {/* LEFT: Chart Section */}
            <div className="flex-1 min-w-0">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
                    <div className="flex items-center gap-3 relative z-20">
                        <h3 className="text-dark dark:text-white font-semibold text-lg">Activity</h3>

                        <div className="relative">
                            <button
                                onClick={() => setYearDropdownOpen(!yearDropdownOpen)}
                                className="flex items-center gap-2 px-3 py-1.5 bg-dark/5 dark:bg-white/10 rounded-xl hover:bg-dark/10 dark:hover:bg-white/20 transition-colors text-sm font-semibold text-dark dark:text-white"
                            >
                                {selectedYear}
                                {yearDropdownOpen ? <CaretUp weight="bold" /> : <CaretDown weight="bold" />}
                            </button>

                            <AnimatePresence>
                                {yearDropdownOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 4, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 2, scale: 0.95 }}
                                        transition={{ duration: 0.15 }}
                                        className="absolute top-full left-0 mt-2 w-32 bg-white dark:bg-[#1a1a1a] rounded-xl shadow-xl border border-dark/5 dark:border-white/5 p-1 overflow-hidden"
                                    >
                                        <div className="max-h-56 overflow-y-auto flex flex-col">
                                            {years.map(year => (
                                                <button
                                                    key={year}
                                                    onClick={() => {
                                                        setSelectedYear(year);
                                                        setYearDropdownOpen(false);
                                                    }}
                                                    className={`text-left px-3 py-2 text-sm font-medium rounded-lg flex items-center justify-between
                            ${selectedYear === year
                                                            ? "bg-dark/5 dark:bg-white/10 text-dark dark:text-white"
                                                            : "text-dark/60 dark:text-white/60 hover:bg-dark/5 dark:hover:bg-white/5 hover:text-dark dark:hover:text-white"}
                          `}
                                                >
                                                    {year}
                                                    {selectedYear === year && <Check weight="bold" className="text-accent" size={12} />}
                                                </button>
                                            ))}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row md:items-center gap-4 text-sm">
                        <div className="flex items-center gap-1.5 order-2 md:order-1">
                            <span className="text-dark/40 dark:text-white/40 text-[10px] font-medium">Less</span>
                            {[0, 1, 2, 3, 4].map((lvl) => (
                                <div
                                    key={lvl}
                                    className="rounded-[2px]"
                                    style={{
                                        width: 10,
                                        height: 10,
                                        backgroundColor: lvl === 0
                                            ? "var(--activity-empty, rgba(0,0,0,0.1))"
                                            : `color-mix(in srgb, var(--color-accent, #6C5CE7) ${25 + lvl * 20}%, transparent)`
                                    }}
                                />
                            ))}
                            <span className="text-dark/40 dark:text-white/40 text-[10px] font-medium">More</span>
                        </div>
                    </div>
                </div>

                {/* Grid Container */}
                <div className="w-full overflow-x-auto relative pb-2">
                    <div className="min-w-[600px]">
                        <svg
                            viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
                            className="w-full h-auto max-h-[180px]"
                            preserveAspectRatio="xMinYMin meet"
                        >
                            {monthLabels.map((m, i) => (
                                <text
                                    key={i}
                                    x={m.col * STEP + 28}
                                    y={10}
                                    className="fill-dark/40 dark:fill-white/40 text-[10px] font-medium"
                                    fontSize="10"
                                >
                                    {m.label}
                                </text>
                            ))}

                            {DAY_LABELS.map((d, i) => (
                                <text
                                    key={i}
                                    x={0}
                                    y={32 + i * STEP}
                                    className="fill-dark/30 dark:fill-white/30 text-[9px] font-medium"
                                    fontSize="9"
                                >
                                    {d}
                                </text>
                            ))}

                            <g transform="translate(26, 24)">
                                {grid.map((cell, i) => {
                                    const x = cell.col * STEP;
                                    const y = cell.row * STEP;
                                    const isSelected = selectedDate === cell.date;

                                    return (
                                        <rect
                                            key={i}
                                            x={x}
                                            y={y}
                                            width={CELL}
                                            height={CELL}
                                            rx={2}
                                            ry={2}
                                            className={`transition-all duration-100 ${cell.inYear ? 'cursor-pointer hover:opacity-80' : ''}`}
                                            fill={getCellColor(cell.count, cell.inYear)}
                                            stroke={isSelected ? "var(--color-accent, #6C5CE7)" : "none"}
                                            strokeWidth={isSelected ? 1.5 : 0}
                                            onClick={() => {
                                                if (cell.inYear) setSelectedDate(cell.date);
                                            }}
                                        >
                                            <title>{cell.count} runs on {cell.date}</title>
                                        </rect>
                                    );
                                })}
                            </g>
                        </svg>
                    </div>
                </div>
            </div>

            {/* RIGHT: Details Panel */}
            <div className="w-full xl:w-80 bg-dark/5 dark:bg-white/5 rounded-3xl p-4 flex flex-col h-full min-h-[250px] xl:min-h-0">
                <div className="flex items-center justify-between mb-4">
                    <h4 className="font-semibold text-dark/80 dark:text-white/80">
                        {selectedDate
                            ? new Date(selectedDate).toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })
                            : "Activity Details"
                        }
                    </h4>
                    {selectedDate && (
                        <button onClick={() => setSelectedDate(null)} className="p-1 hover:bg-dark/5 dark:hover:bg-white/10 rounded-full transition-colors">
                            <X className="text-dark/50 dark:text-white/50" />
                        </button>
                    )}
                </div>

                <div className="flex-1 overflow-y-auto pr-1">
                    {!selectedDate ? (
                        <div className="h-full flex flex-col items-center justify-center text-center p-12">
                            <div className="w-12 h-12 rounded-full bg-dark/5 dark:bg-white/5 flex items-center justify-center mb-3">
                                <Check weight="bold" className="text-dark/20 dark:text-white/20 w-6 h-6" />
                            </div>
                            <p className="text-sm text-dark/40 dark:text-white/40">
                                Select a day on the grid to view detailed agent timestamp activity.
                            </p>
                        </div>
                    ) : (!detailsData || detailsData.length === 0) ? (
                        <div className="h-full flex flex-col items-center justify-center text-center p-4">
                            <p className="text-sm text-dark/40 dark:text-white/40">
                                No activity recorded on this day.
                            </p>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-3">
                            {detailsData.map((agent, i) => (
                                <div key={i} className="bg-surface dark:bg-white/5 p-3 rounded-2xl border border-dark/5 dark:border-white/5">
                                    <div className="flex justify-between items-start mb-2">
                                        <span className="font-medium text-sm text-dark dark:text-white truncate pr-2">
                                            {agent.name}
                                        </span>
                                        <span className="text-xs font-bold px-2 py-0.5 bg-accent/10 text-accent rounded-full whitespace-nowrap">
                                            {agent.count} runs
                                        </span>
                                    </div>
                                    <div className="flex flex-wrap gap-1.5">
                                        {agent.times.slice(0, 8).map((t, idx) => (
                                            <span key={idx} className="text-[10px] bg-dark/5 dark:bg-white/10 px-1.5 py-0.5 rounded text-dark/60 dark:text-white/60 font-mono">
                                                {t}
                                            </span>
                                        ))}
                                        {agent.times.length > 8 && (
                                            <span className="text-[10px] text-dark/40 dark:text-white/40 px-1">
                                                +{agent.times.length - 8} more
                                            </span>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

        </div>
    );
};

export default UsageChart;
