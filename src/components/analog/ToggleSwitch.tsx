'use client';

import React from 'react';

export interface ToggleSwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  label?: string;
  className?: string;
}

export const ToggleSwitch: React.FC<ToggleSwitchProps> = ({
  checked,
  onChange,
  disabled = false,
  size = 'md',
  label,
  className = '',
}) => {
  // Dimension definitions for pixel-perfect thumb sliding with 2px inner padding
  const sizeConfig = {
    sm: {
      track: 'w-7 h-4 p-0.5',
      thumb: 'w-3 h-3',
      translateActive: 'translate-x-3',
      translateInactive: 'translate-x-0',
    },
    md: {
      track: 'w-9 h-5 p-0.5',
      thumb: 'w-4 h-4',
      translateActive: 'translate-x-4',
      translateInactive: 'translate-x-0',
    },
    lg: {
      track: 'w-11 h-6 p-0.5',
      thumb: 'w-5 h-5',
      translateActive: 'translate-x-5',
      translateInactive: 'translate-x-0',
    },
  }[size];

  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (disabled) return;
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      onChange(!checked);
    }
  };

  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label || (checked ? 'Enabled' : 'Disabled')}
      disabled={disabled}
      tabIndex={disabled ? -1 : 0}
      onClick={(e) => {
        e.stopPropagation();
        if (!disabled) onChange(!checked);
      }}
      onKeyDown={handleKeyDown}
      className={`relative inline-flex items-center shrink-0 rounded-full transition-all duration-200 select-none outline-none focus-visible:ring-2 focus-visible:ring-analog-accent focus-visible:ring-offset-1 ${
        disabled
          ? 'opacity-40 cursor-not-allowed'
          : 'cursor-pointer active:scale-95 hover:brightness-105'
      } ${sizeConfig.track} ${
        checked
          ? 'bg-analog-accent shadow-inner'
          : 'bg-analog-border/80 dark:bg-analog-elevated border border-analog-border shadow-inner'
      } ${className}`}
      title={label || (checked ? 'Enabled - Click to toggle' : 'Disabled - Click to toggle')}
    >
      <span
        aria-hidden="true"
        className={`inline-block rounded-full bg-white transition-transform duration-200 ease-out shadow-[0_1px_3px_rgba(0,0,0,0.28),0_0.5px_1px_rgba(0,0,0,0.12)] ${
          sizeConfig.thumb
        } ${checked ? sizeConfig.translateActive : sizeConfig.translateInactive}`}
      />
    </button>
  );
};
