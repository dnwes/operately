import React from 'react';

import { useEditor, EditorContent } from '@tiptap/react';

import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import BulletList from '@tiptap/extension-bullet-list';
import Mention from '@tiptap/extension-mention';

import MenuBar from './MenuBar';
import MentionPopup from './MentionPopup';

export type EditorMentionSearchFunc = ({query} : {query : string}) => Promise<Person[]> | any[];

interface Person {
  id: string;
  fullName: string;
}

interface EditorProps {
  placeholder: string,
  title: string,
  peopleSearch: EditorMentionSearchFunc
}

export default function Editor({placeholder, title, peopleSearch} : EditorProps) : JSX.Element {
  const editor = useEditor({
    editorProps: {
      attributes: {
        class: 'p-4 prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none'
      }
    },
    extensions: [
      BulletList,
      StarterKit.configure({
        bulletList: {
          keepMarks: true,
          keepAttributes: false,
        },
        orderedList: {
          keepMarks: true,
          keepAttributes: false,
        },
      }),
      Placeholder.configure({
        placeholder: placeholder
      }),
      Mention.configure({
        HTMLAttributes: {
          class: 'text-sky-500',
        },
        suggestion: {
          render: () => new MentionPopup(),
          items: peopleSearch,
        }
      }),
    ],
  })

  const header = <div className="p-4 py-2 border-b border-stone-200 text-sm">{title}</div>;

  return (
    <div className="mt-4 rounded bg-white shadow-sm border border-stone-200">
      {header}
      <MenuBar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
}
