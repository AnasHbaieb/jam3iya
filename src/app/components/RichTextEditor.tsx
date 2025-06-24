'use client';

import { useState, useEffect, useRef } from 'react';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';
import BlotFormatter2 from '@enzedonline/quill-blot-formatter2';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({ value, onChange }) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const quillRef = useRef<Quill | null>(null);
  const [mounted, setMounted] = useState(false);
  const onChangeRef = useRef(onChange);

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (editorRef.current && mounted && !quillRef.current) {
      Quill.register('modules/blotFormatter2', BlotFormatter2);

      const toolbarOptions = [
        [{ 'header': [1, 2, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ 'color': [] }, { 'background': [] }],
        [{ 'align': [] }],
        ['image']
      ];

      quillRef.current = new Quill(editorRef.current, {
        theme: 'snow',
        modules: {
          toolbar: toolbarOptions,
          blotFormatter2: {
            align: {
              allowAligning: false,
              alignments: ['left', 'center', 'right']
            },
            image: {
              allowAltTitleEdit: false
            }
          },
        },
        formats: [
          'header', 'bold', 'italic', 'underline', 'strike', 'blockquote',
          'list', 'indent', 'image', 'color', 'background',
          'align', 'code-block',
        ],
      });

      const toolbar: any = quillRef.current.getModule('toolbar'); // eslint-disable-line @typescript-eslint/no-explicit-any
      if (toolbar) {
        toolbar.addHandler('image', () => {
          const input = document.createElement('input');
          input.setAttribute('type', 'file');
          input.setAttribute('accept', 'image/*');
          input.click();

          input.onchange = async () => {
            if (input.files && input.files.length > 0) {
              const file = input.files[0];
              const formData = new FormData();
              formData.append('image', file);

              try {
                const res = await fetch('/api/upload', {
                  method: 'POST',
                  body: formData,
                });

                if (res.ok) {
                  const data = await res.json();
                  const imageUrl = data.url;

                  const range = quillRef.current?.getSelection(true);
                  if (range) {
                    quillRef.current?.insertEmbed(range.index, 'image', imageUrl, Quill.sources.USER);
                    quillRef.current?.setSelection(range.index + 1, Quill.sources.SILENT);
                  }
                } else {
                  console.error('Image upload failed:', res.statusText);
                  alert('فشل رفع الصورة.');
                }
              } catch (error) {
                console.error('Error uploading image:', error);
                alert('حدث خطأ أثناء رفع الصورة.');
              }
            }
          };
        });
      }

      quillRef.current.on('text-change', () => {
        if (quillRef.current) {
          onChangeRef.current(quillRef.current.root.innerHTML);
        }
      });

      if (value) {
        quillRef.current.clipboard.dangerouslyPasteHTML(value);
      }
    }

    return () => {
      if (quillRef.current) {
        quillRef.current.off('text-change');
        quillRef.current = null;
      }
    };
  }, [mounted]);

  useEffect(() => {
    if (quillRef.current && value !== quillRef.current.root.innerHTML) {
      quillRef.current.clipboard.dangerouslyPasteHTML(value);
    }
  }, [value]);

  if (!mounted) {
    return null;
  }

  return <div ref={editorRef} className="h-64 mb-12" style={{ direction: 'rtl' }} />;
};

export default RichTextEditor; 