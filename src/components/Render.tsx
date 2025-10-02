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
      readOnly: true, // safer than calling enable(false)
      modules: {
        toolbar: false,
      },
    });

    try {
      const contents = JSON.parse(value);
      quill.setContents(contents);

      const isEmpty = quill.getText().replace(/\n/g, '').trim().length === 0;
      setIsEmpty(isEmpty);

      if (renderRef.current) {
        renderRef.current.innerHTML = quill.root.innerHTML;
      }
    } catch (err) {
      console.error('Invalid content format:', err);
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
