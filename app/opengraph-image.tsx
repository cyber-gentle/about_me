import { ImageResponse } from 'next/og';
import { site } from '@/lib/site';

export const alt = `${site.name} — ${site.title}`;
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '80px',
          backgroundColor: '#050505',
          backgroundImage:
            'radial-gradient(circle at 20% 10%, rgba(79,139,255,0.35), transparent 50%), radial-gradient(circle at 90% 100%, rgba(138,92,255,0.3), transparent 50%)',
          color: '#fff',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ fontSize: 28, color: '#7FE7FF', letterSpacing: 6, textTransform: 'uppercase' }}>
          Backend Developer · Go · APIs · Cloud
        </div>
        <div style={{ fontSize: 96, fontWeight: 700, marginTop: 24 }}>{site.name}</div>
        <div style={{ fontSize: 40, color: 'rgba(255,255,255,0.7)', marginTop: 16 }}>
          Building fast, scalable &amp; beautiful software.
        </div>
      </div>
    ),
    size
  );
}
