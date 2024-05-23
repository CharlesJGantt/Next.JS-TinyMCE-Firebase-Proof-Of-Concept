import React, { useState } from 'react';
import { CustomEditor } from 'components/editor/CustomEditor';
import { firestore } from '../firebase.js';

export default function EditPage() {
  // State to store the content
  const [content, setContent] = useState('<p>This is the initial content of the editor.</p>');

  // Handler function to update the content when the editor content changes
  const handleEditorChange = (newContent) => {
    setContent(newContent);
  };

  // Function to save the content to Firestore
  const saveContent = async () => {
    try {
      // Save content to Firestore
      await firestore.collection('contents').add({
        content: content,
        createdAt: new Date()
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
      {/* Render the CustomEditor component */}
      <CustomEditor content={content} handleOnEditorChange={handleEditorChange} />
      
      {/* Display the content below the editor */}
      <div className="mt-8 border-t pt-8">
        <h3 className="text-lg font-semibold mb-2">Preview:</h3>
        <div dangerouslySetInnerHTML={{ __html: content }} />
      </div>
      
      {/* Add a button to save the content */}
      <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded" onClick={saveContent}>
        Save Content
      </button>
    </main>
  );
}
