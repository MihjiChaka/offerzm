import React, { useEffect, useRef, useState } from 'react';

interface DocumentPreviewWrapperProps {
  children: React.ReactNode;
  width?: number; // Target width in mm (default 210 for A4)
}

export default function DocumentPreviewWrapper({ children, width = 210 }: DocumentPreviewWrapperProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [contentHeight, setContentHeight] = useState(0);

  useEffect(() => {
    const updateScale = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
        const targetWidthPx = (width * 96) / 25.4;
        const newScale = containerWidth / targetWidthPx;
        setScale(newScale);
      }
    };

    const updateHeight = () => {
      if (contentRef.current) {
        setContentHeight(contentRef.current.offsetHeight);
      }
    };

    updateScale();
    updateHeight();
    
    window.addEventListener('resize', () => {
      updateScale();
      updateHeight();
    });
    
    const resizeObserver = new ResizeObserver(() => {
      updateScale();
      updateHeight();
    });

    if (containerRef.current) resizeObserver.observe(containerRef.current);
    if (contentRef.current) resizeObserver.observe(contentRef.current);

    return () => {
      window.removeEventListener('resize', updateScale);
      resizeObserver.disconnect();
    };
  }, [width]);

  return (
    <div ref={containerRef} className="w-full overflow-hidden bg-slate-200 rounded-lg shadow-inner relative">
      <div 
        ref={contentRef}
        className="shadow-2xl preview-content"
        style={{ 
          transform: `scale(${scale})`, 
          transformOrigin: 'top left',
          width: `${width}mm`,
          position: 'absolute',
          top: 0,
          left: 0,
        }}
      >
        {children}
      </div>
      {/* Spacer to maintain height after scaling */}
      <div style={{ height: `${scale * contentHeight}px` }} />
    </div>
  );
}
