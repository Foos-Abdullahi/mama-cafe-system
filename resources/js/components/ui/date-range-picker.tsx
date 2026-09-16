import React, { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';

interface DateRangePickerProps {
    fromDate?: string | null;
    toDate?: string | null;
    onApply: (from: string, to: string) => void;
    onClear?: () => void;
    className?: string;
    placeholder?: string;
    label?: string;
}

export function DateRangePicker({
    fromDate = '',
    toDate = '',
    onApply,
    onClear,
    className = '',
    placeholder = 'Filter Date Range',
    label,
}: DateRangePickerProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedFrom, setSelectedFrom] = useState(fromDate || '');
    const [selectedTo, setSelectedTo] = useState(toDate || '');

    const [currentViewDate, setCurrentViewDate] = useState(() => {
        if (fromDate) return new Date(fromDate);
        return new Date();
    });

    useEffect(() => {
        setSelectedFrom(fromDate || '');
        setSelectedTo(toDate || '');
    }, [fromDate, toDate]);

    const formatDateDisplay = (dateStr: string) => {
        if (!dateStr) return '';
        const d = new Date(dateStr + 'T00:00:00');
        if (isNaN(d.getTime())) return dateStr;
        return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    const handlePreset = (preset: 'today' | 'yesterday' | 'week' | 'month' | '30days' | 'year') => {
        const today = new Date();
        let from = new Date();
        let to = new Date();

        if (preset === 'today') {
            from = today;
            to = today;
        } else if (preset === 'yesterday') {
            from = new Date(today);
            from.setDate(today.getDate() - 1);
            to = new Date(from);
        } else if (preset === 'week') {
            const dayOfWeek = today.getDay();
            from = new Date(today);
            from.setDate(today.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));
            to = today;
        } else if (preset === 'month') {
            from = new Date(today.getFullYear(), today.getMonth(), 1);
            to = today;
        } else if (preset === '30days') {
            from = new Date(today);
            from.setDate(today.getDate() - 30);
            to = today;
        } else if (preset === 'year') {
            from = new Date(today.getFullYear(), 0, 1);
            to = today;
        }

        const formatIso = (d: Date) => {
            const y = d.getFullYear();
            const m = String(d.getMonth() + 1).padStart(2, '0');
            const day = String(d.getDate()).padStart(2, '0');
            return `${y}-${m}-${day}`;
        };

        const fStr = formatIso(from);
        const tStr = formatIso(to);
        setSelectedFrom(fStr);
        setSelectedTo(tStr);
        setCurrentViewDate(from);
    };

    const handlePrevMonth = () => {
        setCurrentViewDate(new Date(currentViewDate.getFullYear(), currentViewDate.getMonth() - 1, 1));
    };

    const handleNextMonth = () => {
        setCurrentViewDate(new Date(currentViewDate.getFullYear(), currentViewDate.getMonth() + 1, 1));
    };

    const handleDayClick = (yearNum: number, monthNum: number, dayNum: number) => {
        const mStr = String(monthNum + 1).padStart(2, '0');
        const dStr = String(dayNum).padStart(2, '0');
        const clickedStr = `${yearNum}-${mStr}-${dStr}`;

        if (!selectedFrom || (selectedFrom && selectedTo)) {
            setSelectedFrom(clickedStr);
            setSelectedTo('');
        } else if (selectedFrom && !selectedTo) {
            if (clickedStr < selectedFrom) {
                setSelectedTo(selectedFrom);
                setSelectedFrom(clickedStr);
            } else {
                setSelectedTo(clickedStr);
            }
        }
    };

    const yearNum = currentViewDate.getFullYear();
    const monthNum = currentViewDate.getMonth();
    const firstDayOfMonth = new Date(yearNum, monthNum, 1).getDay();
    const daysInMonth = new Date(yearNum, monthNum + 1, 0).getDate();
    const monthName = currentViewDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

    const paddingDays = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;

    const handleApply = () => {
        onApply(selectedFrom, selectedTo);
        setIsOpen(false);
    };

    const handleClear = () => {
        setSelectedFrom('');
        setSelectedTo('');
        if (onClear) onClear();
        else onApply('', '');
        setIsOpen(false);
    };

    const isActive = Boolean(selectedFrom || selectedTo);

    return (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
                <button
                    type="button"
                    className={`inline-flex items-center gap-2 rounded-xl border px-3.5 py-2 text-xs font-semibold shadow-2xs transition-all duration-200 cursor-pointer ${
                        isActive
                            ? 'bg-[#823d21]/10 border-[#823d21]/40 text-[#823d21] shadow-xs'
                            : 'bg-card border-border/80 text-foreground hover:bg-muted/50 hover:border-border'
                    } ${className}`}
                >
                    <CalendarIcon className="h-4 w-4 text-[#823d21] shrink-0" />
                    <span>
                        {selectedFrom ? (
                            selectedTo ? (
                                `${formatDateDisplay(selectedFrom)} — ${formatDateDisplay(selectedTo)}`
                            ) : (
                                `From ${formatDateDisplay(selectedFrom)}`
                            )
                        ) : (
                            label || placeholder
                        )}
                    </span>
                    {isActive && (
                        <span
                            onClick={(e) => {
                                e.stopPropagation();
                                handleClear();
                            }}
                            className="ml-1 rounded-full p-0.5 hover:bg-[#823d21]/20 text-[#823d21] transition-colors"
                        >
                            <X className="h-3.5 w-3.5" />
                        </span>
                    )}
                </button>
            </PopoverTrigger>

            <PopoverContent align="start" className="w-[500px] p-0 overflow-hidden border-border/80 shadow-xl rounded-2xl">
                <div className="flex divide-x divide-border">
                    <div className="w-36 p-3 bg-muted/20 space-y-1 text-xs shrink-0 flex flex-col justify-between">
                        <div>
                            <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground px-2 mb-2">
                                Presets
                            </p>
                            <button
                                type="button"
                                onClick={() => handlePreset('today')}
                                className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-muted font-medium transition-colors"
                            >
                                Today
                            </button>
                            <button
                                type="button"
                                onClick={() => handlePreset('yesterday')}
                                className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-muted font-medium transition-colors"
                            >
                                Yesterday
                            </button>
                            <button
                                type="button"
                                onClick={() => handlePreset('week')}
                                className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-muted font-medium transition-colors"
                            >
                                This Week
                            </button>
                            <button
                                type="button"
                                onClick={() => handlePreset('month')}
                                className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-muted font-medium transition-colors"
                            >
                                This Month
                            </button>
                            <button
                                type="button"
                                onClick={() => handlePreset('30days')}
                                className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-muted font-medium transition-colors"
                            >
                                Last 30 Days
                            </button>
                            <button
                                type="button"
                                onClick={() => handlePreset('year')}
                                className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-muted font-medium transition-colors"
                            >
                                This Year
                            </button>
                        </div>
                    </div>

                    <div className="flex-1 p-4 space-y-3 bg-card">
                        <div className="flex items-center justify-between pb-2 border-b border-border">
                            <span className="text-xs font-bold text-foreground">{monthName}</span>
                            <div className="flex items-center gap-1">
                                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={handlePrevMonth}>
                                    <ChevronLeft className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={handleNextMonth}>
                                    <ChevronRight className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>

                        <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-bold text-muted-foreground uppercase">
                            <span>Mo</span>
                            <span>Tu</span>
                            <span>We</span>
                            <span>Th</span>
                            <span>Fr</span>
                            <span>Sa</span>
                            <span>Su</span>
                        </div>

                        <div className="grid grid-cols-7 gap-1 text-xs">
                            {Array.from({ length: paddingDays }).map((_, idx) => (
                                <div key={`pad-${idx}`} />
                            ))}
                            {Array.from({ length: daysInMonth }).map((_, idx) => {
                                const dayNum = idx + 1;
                                const mStr = String(monthNum + 1).padStart(2, '0');
                                const dStr = String(dayNum).padStart(2, '0');
                                const dayIso = `${yearNum}-${mStr}-${dStr}`;

                                const isFrom = selectedFrom === dayIso;
                                const isTo = selectedTo === dayIso;
                                const isInRange =
                                    selectedFrom &&
                                    selectedTo &&
                                    dayIso >= selectedFrom &&
                                    dayIso <= selectedTo;

                                return (
                                    <button
                                        key={dayIso}
                                        type="button"
                                        onClick={() => handleDayClick(yearNum, monthNum, dayNum)}
                                        className={`h-8 w-8 rounded-lg flex items-center justify-center font-medium transition-all cursor-pointer ${
                                            isFrom || isTo
                                                ? 'bg-[#823d21] text-white font-bold shadow-xs'
                                                : isInRange
                                                ? 'bg-[#823d21]/15 text-[#823d21] font-semibold'
                                                : 'hover:bg-muted text-foreground'
                                        }`}
                                    >
                                        {dayNum}
                                    </button>
                                );
                            })}
                        </div>

                        <div className="pt-2 border-t border-border flex items-center justify-between gap-2">
                            <div className="text-[11px] font-mono text-muted-foreground">
                                {selectedFrom && selectedTo ? (
                                    <span>{selectedFrom} → {selectedTo}</span>
                                ) : selectedFrom ? (
                                    <span>Select End Date</span>
                                ) : (
                                    <span>Pick Start Date</span>
                                )}
                            </div>
                            <div className="flex gap-2">
                                <Button variant="outline" size="sm" className="h-7 text-xs" onClick={handleClear}>
                                    Reset
                                </Button>
                                <Button size="sm" className="h-7 text-xs bg-[#823d21] hover:bg-[#682e18] text-white" onClick={handleApply}>
                                    Apply Range
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    );
}
