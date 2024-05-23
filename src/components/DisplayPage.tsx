import React, { useEffect, useState } from 'react';
import { firestore } from '../../firebase.js';

export default function DisplayPage() {
  const [content, setContent] = useState('');

  useEffect(() => {
    // Fetch latest content from Firestore
    const fetchContent = async () => {
      try {
        const contentRef = firestore.collection('contents');
        const querySnapshot = await contentRef.orderBy('createdAt', 'desc').limit(1).get(); // Get latest document
        if (!querySnapshot.empty) {
          // Get content from the latest document
          const latestDocument = querySnapshot.docs[0];
          const latestContent = latestDocument.data().content;
          console.log('Latest Content:', latestContent); // Log the latest content
          setContent(latestContent);
        } else {
          console.warn('No content found in Firestore.');
        }
      } catch (error) {
        console.error('Error fetching content from Firestore:', error);
      }
    };

    fetchContent(); // Call the fetchContent function when the component mounts
  }, []);

  console.log('Rendered Content:', content); // Log the content being rendered

  return (
    <main className="p-8">
      <h2 className="text-2xl font-semibold mb-6">Display Content</h2>
      <div dangerouslySetInnerHTML={{ __html: content }} className="border p-4 rounded-md bg-gray-50" />
    </main>
  );
}
