import React, { useEffect, useRef, useState } from 'react';
import Quill from 'quill';

interface RenderProps {
  value: any;
}

function Render({ value }: RenderProps) {
  const [isEmpty, setIsEmpty] = useState(false);
  const renderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tempDiv = document.createElement('div');

    const quill = new Quill(tempDiv, {
      theme: 'snow',
      readOnly: true,
      modules: {
        toolbar: false,
      },
    });

    try {
      if (!value) {
        setIsEmpty(true);
        return;
      }

      const parsed =
        typeof value === 'string' ? JSON.parse(value) : value;

      quill.setContents(parsed);

      const empty =
        quill.getText().replace(/\n/g, '').trim().length === 0;
      setIsEmpty(empty);

      if (renderRef.current) {
        renderRef.current.innerHTML = quill.root.innerHTML;
      }
    } catch (err) {
      console.error('Invalid content format:', err);
      setIsEmpty(true);
    }

    return () => {
      if (renderRef.current) {
        renderRef.current.innerHTML = '';
      }
    };
  }, [value]);

  if (isEmpty) return null;

  return <div ref={renderRef} className="prose prose-sm max-w-none" />;
}

export default Render;
