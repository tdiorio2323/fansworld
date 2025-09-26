import { ImageResponse } from 'next/og'

export const size = {
  width: 1200,
  height: 630,
}

export const contentType = 'image/png'

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background:
            'linear-gradient(135deg, rgba(11,14,19,0.95) 0%, rgba(23,31,45,0.85) 50%, rgba(11,14,19,0.95) 100%)',
          color: '#f7f7f7',
          textAlign: 'center',
          padding: '60px',
          gap: '24px',
        }}
      >
        <div
          style={{
            fontSize: 72,
            letterSpacing: '0.4rem',
            fontWeight: 600,
          }}
        >
          CABANA
        </div>
        <div style={{ fontSize: 36, maxWidth: 720, lineHeight: 1.3 }}>
          Luxury creator subscriptions · UI demo build
        </div>
      </div>
    ),
    size,
  )
}
