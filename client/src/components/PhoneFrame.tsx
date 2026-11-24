import { BatteryFull, Signal, Wifi } from 'lucide-react';
import { useEffect, useState, type ReactNode } from 'react';
import styled from 'styled-components';
import { PHONE_HEIGHT, PHONE_WIDTH, colors, shadow } from '@/theme';

/**
 * На компьютере приложение показывается в «телефоне» по центру экрана (как в Figma),
 * на телефоне — во весь экран.
 */
export function PhoneFrame({ children }: { children: ReactNode }) {
  return (
    <Outer>
      <Device>
        <StatusBar />
        {children}
      </Device>
    </Outer>
  );
}

function StatusBar() {
  const [time, setTime] = useState(() => now());
  useEffect(() => {
    const id = setInterval(() => setTime(now()), 15_000);
    return () => clearInterval(id);
  }, []);
  return (
    <Bar aria-hidden>
      <span>{time}</span>
      <Icons>
        <Signal size={14} strokeWidth={2.5} />
        <Wifi size={14} strokeWidth={2.5} />
        <BatteryFull size={18} strokeWidth={2} />
      </Icons>
    </Bar>
  );
}

const now = () =>
  new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });

const DESKTOP = `@media (min-width: 520px) and (min-height: 640px)`;

const Outer = styled.div`
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${colors.primary};

  ${DESKTOP} {
    background: radial-gradient(circle at 30% 20%, #2a3d3c 0%, ${colors.canvas} 60%);
    padding: 20px;
  }
`;

const Device = styled.div`
  --status-h: 0px;
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: ${colors.primary};
  display: flex;
  flex-direction: column;

  ${DESKTOP} {
    --status-h: 34px;
    width: ${PHONE_WIDTH}px;
    height: min(${PHONE_HEIGHT}px, calc(100vh - 40px));
    border-radius: 44px;
    box-shadow: ${shadow.phone};
    outline: 10px solid #111;
  }
`;

const Bar = styled.div`
  display: none;

  ${DESKTOP} {
    position: absolute;
    inset: 0 0 auto 0;
    height: var(--status-h);
    padding: 10px 30px 0 36px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 13px;
    font-weight: 600;
    color: ${colors.void};
    z-index: 50;
    pointer-events: none;
  }
`;

const Icons = styled.span`
  display: flex;
  gap: 5px;
  align-items: center;
`;
