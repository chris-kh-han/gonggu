# Button Components

## Liquid Glass Button

We use a "Liquid Glass" style for premium actions. It features a transparent, blurred backdrop with subtle gradients and borders.

### Component Code

```tsx
import React from 'react';

// Liquid Glass Button Component
// Usage: <LiquidGlassButton onClick={...} icon={<Icon />}>Label</LiquidGlassButton>
const LiquidGlassButton = ({ children = "Button", icon, onClick }: { children?: React.ReactNode; icon?: React.ReactNode; onClick?: () => void }) => {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full text-white font-semibold text-[15px] transition-all duration-200 hover:scale-105 active:scale-95"
      style={{
        background: `
          linear-gradient(180deg, rgba(255, 255, 255, 0.25) 0%, rgba(255, 255, 255, 0) 50%),
          linear-gradient(180deg, rgba(255, 255, 255, 0) 50%, rgba(255, 255, 255, 0.1) 100%),
          rgba(255, 255, 255, 0.1)
        `,
        boxShadow: `
          inset 0 1px 1px rgba(255, 255, 255, 0.4),
          inset 0 -1px 1px rgba(255, 255, 255, 0.1),
          0 4px 24px rgba(0, 0, 0, 0.1)
        `,
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        border: '1px solid rgba(255, 255, 255, 0.3)',
      }}
    >
      {icon && <span className="w-6 h-6">{icon}</span>}
      {children}
    </button>
  );
};

export default LiquidGlassButton;
```
