import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

const borderDefault = 'var(--border-subtle)';
const borderFocus   = 'var(--color-primary-600)';

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
  const [focused, setFocused] = useState(false);

  const isPassword = type === 'password';
  const inputType  = isPassword ? (showPassword ? 'text' : 'password') : type;

  const borderColor = error ? 'var(--color-danger-500)' : focused ? borderFocus : borderDefault;
  const focusShadow = error
    ? '0 0 0 3px rgba(192,57,43,0.1)'
    : '0 0 0 3px rgba(27,58,45,0.08)';

  const baseInput = [
    'h-13 flex-1 min-w-0 bg-white text-sm outline-none',
    'placeholder:text-neutral-400',
    'disabled:opacity-50 disabled:cursor-not-allowed',
    prefix ? 'px-4 border-none rounded-none' : 'w-full px-4',
    isPassword || rightSlot ? 'pr-12' : '',
  ].join(' ');

  return (
    <div className={`flex flex-col gap-2 ${className}`}>

      {(label || rightLabel) && (
        <div className="flex items-center justify-between">
          {label && (
            <label htmlFor={id} className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
              {label}
            </label>
          )}
          {rightLabel && (
            <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              {rightLabel}
            </span>
          )}
        </div>
      )}

      <div
        className="relative flex items-center rounded-lg overflow-hidden border-[1.5px] transition-[border-color,box-shadow] duration-150"
        style={{ borderColor, boxShadow: focused ? focusShadow : 'none' }}
      >
        {prefix && (
          <span
            className="px-3 h-13 flex items-center shrink-0 text-sm font-semibold border-r-[1.5px]"
            style={{ color: 'var(--text-secondary)', background: 'var(--bg-surface-2)', borderColor: borderDefault }}
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
          style={{ color: 'var(--text-primary)', fontFamily: 'Poppins, sans-serif' }}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        />

        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(v => !v)}
            className="absolute right-4 flex items-center justify-center p-0"
            style={{ color: 'var(--color-neutral-400)' }}
            tabIndex={-1}
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
        <p className="m-0 text-compact-xs" style={{ color: 'var(--text-danger)' }}>
          {error}
        </p>
      )}
      {!error && hint && (
        <p className="m-0 text-compact-xs" style={{ color: 'var(--text-muted)' }}>
          {hint}
        </p>
      )}

    </div>
  );
}