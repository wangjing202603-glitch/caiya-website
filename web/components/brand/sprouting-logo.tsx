/**
 * 财芽发芽 Logo —— 品牌签名动效
 * 加载时：茎从底部生长 → 左叶展开 → 右叶展开 → 芽头 pop
 * 隐喻：新芽破土，与「财芽」品牌核心一致
 */
export function SproutingLogo({
  className,
  size = 48,
}: {
  className?: string;
  size?: number;
}) {
  return (
    <svg
      viewBox="0 0 64 64"
      width={size}
      height={size}
      className={className}
      role="img"
      aria-label="财芽"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="sprout-leaf-l" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#D6820F" />
          <stop offset="100%" stopColor="#FDB56A" />
        </linearGradient>
        <linearGradient id="sprout-leaf-r" x1="100%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" stopColor="#A8650B" />
          <stop offset="100%" stopColor="#F09A1A" />
        </linearGradient>
        <radialGradient id="sprout-bud-g" cx="35%" cy="30%" r="65%">
          <stop offset="0%" stopColor="#FDB56A" />
          <stop offset="100%" stopColor="#F09A1A" />
        </radialGradient>
      </defs>

      {/* 茎 */}
      <line
        className="sprout-stem"
        x1="32" y1="56" x2="32" y2="34"
        stroke="#1C1A18" strokeWidth="2.6" strokeLinecap="round"
      />

      {/* 左叶 */}
      <path
        className="sprout-leaf-left"
        d="M32 56 C 26 50, 18 44, 12 38 C 18 38, 24 42, 30 50 C 31.5 52, 32 54, 32 56 Z"
        fill="url(#sprout-leaf-l)" stroke="#1C1A18" strokeWidth="1.6"
        strokeLinejoin="round"
      />

      {/* 右叶 */}
      <path
        className="sprout-leaf-right"
        d="M32 56 C 38 50, 46 44, 52 38 C 46 38, 40 42, 34 50 C 32.5 52, 32 54, 32 56 Z"
        fill="url(#sprout-leaf-r)" stroke="#1C1A18" strokeWidth="1.6"
        strokeLinejoin="round"
      />

      {/* 芽头 */}
      <circle
        className="sprout-bud"
        cx="32" cy="30" r="5"
        fill="url(#sprout-bud-g)" stroke="#1C1A18" strokeWidth="1.5"
      />
    </svg>
  );
}