import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

export default function AuthInput({
  id,
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  autoComplete,
  prefix,
  rightSlot,
  error,
  hint,
  rightLabel,
  disabled = false,
  className = '',
}) {
  const [showPassword, setShowPassword] = useState(false);
  const [focused, setFocused]           = useState(false);

  const isPassword = type === 'password';
  const inputType  = isPassword ? (showPassword ? 'text' : 'password') : type;

  const borderColor = error
    ? 'var(--color-danger-500)'
    : focused
    ? 'var(--color-forest-900)'
    : 'var(--border-subtle)';

  const focusShadow = focused
    ? error
      ? '0 0 0 3px color-mix(in srgb, var(--color-danger-500) 12%, transparent)'
      : '0 0 0 3px color-mix(in srgb, var(--color-forest-900) 8%, transparent)'
    : 'none';

  const baseInput = [
    'h-13 flex-1 min-w-0 bg-(--bg-input,white) text-sm outline-none',
    'text-(--text-primary)',
    'placeholder:text-neutral-400',
    'disabled:opacity-50 disabled:cursor-not-allowed',
    prefix ? 'px-4 border-none rounded-none' : 'w-full px-4',
    isPassword || rightSlot ? 'pr-12' : '',
  ].filter(Boolean).join(' ');

  return (
    <div className={`flex flex-col gap-2 ${className}`}>

      {(label || rightLabel) && (
        <div className="flex items-center justify-between">
          {label && (
            <label htmlFor={id} className="text-sm font-medium text-(--text-primary)">
              {label}
            </label>
          )}
          {rightLabel && (
            <span className="text-sm text-(--text-secondary)">
              {rightLabel}
            </span>
          )}
        </div>
      )}

      <div
        className="relative flex items-center rounded-xl overflow-hidden border-[1.5px] transition-[border-color,box-shadow] duration-150"
        style={{ borderColor, boxShadow: focusShadow }}
      >
        {prefix && (
          <span
            className="px-3 h-13 flex items-center shrink-0 text-sm font-semibold border-r-[1.5px] text-(--text-secondary) bg-(--bg-surface-2)"
            style={{ borderColor }}
          >
            {prefix}
          </span>
        )}

        <input
          id={id}
          type={inputType}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          autoComplete={autoComplete}
          disabled={disabled}
          className={baseInput}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          aria-invalid={!!error}
          aria-describedby={
            error ? `${id}-error` : hint ? `${id}-hint` : undefined
          }
        />

        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(v => !v)}
            aria-label={showPassword ? 'Sembunyikan password' : 'Tampilkan password'}
            className="absolute right-4 flex items-center justify-center p-1 rounded-md text-neutral-400 hover:text-(--text-primary) transition-colors duration-150"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}

        {!isPassword && rightSlot && (
          <div className="absolute right-4 flex items-center justify-center">
            {rightSlot}
          </div>
        )}
      </div>

      {error && (
        <p id={`${id}-error`} role="alert" className="m-0 text-xs text-(--text-danger)">
          {error}
        </p>
      )}
      {!error && hint && (
        <p id={`${id}-hint`} className="m-0 text-xs text-(--text-muted)">
          {hint}
        </p>
      )}

    </div>
  );
}