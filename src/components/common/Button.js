'use client';

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  icon: Icon,
  className = '',
  loading = false,
  style = {},
  onClick,
  ...props
}) {
  let variantStyle = {
    background: 'linear-gradient(135deg, #8b5cf6 0%, #d946ef 50%, #ec4899 100%)',
    color: '#ffffff',
    border: 'none',
    boxShadow: '0 4px 15px rgba(139, 92, 246, 0.35)',
  };

  if (variant === 'secondary') {
    variantStyle = {
      background: 'rgba(255, 255, 255, 0.06)',
      color: '#e2e8f0',
      border: '1px solid rgba(255, 255, 255, 0.12)',
    };
  } else if (variant === 'outline') {
    variantStyle = {
      background: 'transparent',
      color: '#c4b5fd',
      border: '1px solid rgba(139, 92, 246, 0.4)',
    };
  } else if (variant === 'danger') {
    variantStyle = {
      background: 'rgba(239, 68, 68, 0.15)',
      color: '#f87171',
      border: '1px solid rgba(239, 68, 68, 0.3)',
    };
  }

  let sizeStyle = {
    padding: '0.625rem 1.25rem',
    fontSize: '0.875rem',
    borderRadius: '0.5rem',
  };

  if (size === 'sm') {
    sizeStyle = {
      padding: '0.375rem 0.75rem',
      fontSize: '0.75rem',
      borderRadius: '0.375rem',
    };
  } else if (size === 'lg') {
    sizeStyle = {
      padding: '0.875rem 1.75rem',
      fontSize: '1rem',
      borderRadius: '0.625rem',
    };
  }

  return (
    <button
      className={`interactive-ripple ${className}`}
      disabled={loading}
      onClick={onClick}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.5rem',
        fontWeight: 600,
        fontFamily: 'inherit',
        cursor: loading ? 'not-allowed' : 'pointer',
        opacity: loading ? 0.7 : 1,
        transition: 'all 0.15s cubic-bezier(0.34, 1.56, 0.64, 1)',
        ...variantStyle,
        ...sizeStyle,
        ...style,
      }}
      {...props}
    >
      {loading ? (
        <>
          <span style={{
            display: 'inline-block',
            width: '14px',
            height: '14px',
            border: '2px solid rgba(255,255,255,0.3)',
            borderTopColor: '#fff',
            borderRadius: '50%',
            animation: 'spin 0.7s linear infinite'
          }} />
          <span>Processing...</span>
        </>
      ) : (
        <>
          {Icon && <Icon size={size === 'sm' ? 14 : size === 'lg' ? 18 : 16} />}
          {children}
        </>
      )}
    </button>
  );
}
