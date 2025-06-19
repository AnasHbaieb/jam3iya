import { ImageResponse } from 'next/og';

// Route segment config
export const runtime = 'edge';

// Image metadata
export const size = {
  width: 180,
  height: 180,
};
export const contentType = 'image/png';

// Image generation
export default function Icon() {
  return new ImageResponse(
    (
      // خلفية دائرية بلون أخضر
      <div
        style={{
          fontSize: 80,
          background: 'linear-gradient(to bottom right, green, darkgreen)',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '50%',
          color: 'white',
          fontWeight: 'bold',
          padding: '20px',
        }}
      >
        ك ط
      </div>
    ),
    // ImageResponse options
    {
      ...size,
    }
  );
} 