'use client';

import React, { useRef, useEffect, useState } from 'react';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';

interface QuillEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const QuillEditor: React.FC<QuillEditorProps> = ({ value, onChange, placeholder }) => {
  const quillRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<Quill | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient && quillRef.current && !editorRef.current) {
      editorRef.current = new Quill(quillRef.current, {
        theme: 'snow',
        placeholder: placeholder,
        modules: {
          toolbar: [
            [{ 'header': [1, 2, false] }],
            ['bold', 'italic', 'underline', 'strike'],
            ['link', 'image'],
            [{ 'color': [] }, { 'background': [] }],
            [{ 'font': [] }],
          ],
        },
      });

      editorRef.current.on('text-change', () => {
        if (editorRef.current) {
          onChange(editorRef.current.root.innerHTML);
        }
      });
    }
  }, [isClient, onChange, placeholder]);

  useEffect(() => {
    if (editorRef.current && value !== editorRef.current.root.innerHTML) {
      const selection = editorRef.current.getSelection(); // Save current selection
      editorRef.current.clipboard.dangerouslyPasteHTML(value);
      if (selection) { // Restore selection
        editorRef.current.setSelection(selection);
      }
    }
  }, [value]);

  return <div ref={quillRef} style={{ height: '300px' }} />;
};

export default QuillEditor; 