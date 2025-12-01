'use client';
import React, { useEffect, useRef, useState } from 'react';
import { BrowserMultiFormatReader } from '@zxing/browser';

export default function Scanner({ onDetected }: { onDetected: (text: string) => void }) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [active, setActive] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const codeReader = new BrowserMultiFormatReader();
    let stop = false;
    async function start() {
      try {
        const video = document.createElement('video');
        videoRef.current = video;
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
        video.srcObject = stream;
        await video.play();
        setActive(true);
        while (!stop) {
          const result = await codeReader.decodeOnceFromVideoElement(video);
          if (result) {
            onDetected(result.getText());
            break;
          }
        }
      } catch (e: any) {
        setError(e?.message ?? 'Camera error');
      }
    }
    start();
    return () => {
      stop = true;
      setActive(false);
      const tracks = (videoRef.current?.srcObject as MediaStream | null)?.getTracks();
      tracks?.forEach((t) => t.stop());
    };
  }, [onDetected]);

  return (
    <div className="card" style={{ padding: 0 }}>
      <div style={{ padding: 12, borderBottom: '1px solid #1f2a44' }}>
        <strong>Barcode Scanner</strong>
        {active ? <span className="pill info" style={{ marginLeft: 8 }}>Live</span> : null}
      </div>
      {error ? <div style={{ padding: 12 }} className="muted">Error: {error}</div> : null}
      <div style={{ padding: 12 }}>
        <video ref={videoRef} style={{ width: '100%', borderRadius: 8 }} muted playsInline />
      </div>
    </div>
  );
}

