// src/pages/EditPage.tsx

import React, { useState } from 'react';
import { CustomEditor } from 'components/editor/CustomEditor';
import { firestore } from '../../../firebase.js';

export default function EditPage() {
  const [content, setContent] = useState('<p>This is the initial content of the editor.</p>');

  const handleEditorChange = (newContent: string) => {
    setContent(newContent);
  };

  const saveContent = async () => {
    try {
      // Save content to Firestore with createdAt timestamp
      await firestore.collection('content').add({
        content: content,
        createdAt: new Date() // Include the current timestamp as 'createdAt'
      });
      alert('Content saved to Firestore!');
    } catch (error) {
      console.error('Error saving content to Firestore:', error);
      alert('Failed to save content to Firestore. Please try again later.');
    }
  };

  return (
    <main className="p-8">
      <h2 className="text-2xl font-semibold mb-6">Edit Content</h2>
      <CustomEditor content={content} handleOnEditorChange={handleEditorChange} />
      <button onClick={saveContent} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded">
        Save Content
      </button>
    </main>
  );
}
