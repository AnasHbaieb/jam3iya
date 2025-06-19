import { ImageResponse } from 'next/og';

// Route segment config
export const runtime = 'edge';

// Image metadata
export const size = {
  width: 32,
  height: 32,
};
export const contentType = 'image/png';

// Image generation
export default function Icon() {
  return new ImageResponse(
    (
      // خلفية دائرية بلون أخضر
      <div
        style={{
          fontSize: 24,
          background: 'green',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '50%',
          color: 'white',
        }}
      >
        ك
      </div>
    ),
    // ImageResponse options
    {
      ...size,
    }
  );
} 