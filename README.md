# Next.JS + TinyMCE + Firestorm: Proof Of Concept

This project demonstrates how to integrate TinyMCE into a Next.js website and use Firebase for content storage. We'll create two pages: /edit and /display. On the /edit page, users can create content using the TinyMCE editor and save it by clicking a save button. This action sends the content to a Firebase Firestore Collection, where each saved entry is assigned a unique ID. When users visit the /display page, the most recently saved content is loaded and displayed.

## **Prerequisites**

### Install Node.js

- If you don’t have **NVM**, **Node.js, and NPM **installed, install it using [NVM For Windows](https://github.com/coreybutler/nvm-windows). You’ll need Node.js version **18** or higher. 

### Install Yarn

- npm install --global yarn

### Install TinyMCE

- yarn add tinymce @tinymce/tinymce-react copy-webpack-plugin

### Prepare Firebase

- Run the following code in the command prompt

- npm install firebase

- Go to [https://firebase.google.com/](https://firebase.google.com/) and create a new project 

- Add A Firestore Database

- Create a new collection named contents

- Add a content: Field

- Add a createdAt: field

### Create a new directory where your Next.js where will be stored.** **

- ~/Tiny”

- Navigate to this directory in the terminal

- cd myTiny

### Create a new Next App

- In the terminal run the following command:

- npx create-next-app@latest

- You will be prompted to answer several questions about your Next install. Provide the answers highlighted below.

- What is your project named? tiny

- Would you like to use TypeScript? No / Yes

- Would you like to use ESLint? No / Yes

- Would you like to use Tailwind CSS? No / Yes

- Would you like to use <code>src/</code> directory? No / Yes

- Would you like to use App Router? (recommended) No / Yes

- Would you like to customize the default import alias (@/*)? No / Yes

- What import alias would you like configured? @/*

- After the prompts, `create-next-app` will create a folder with your project name and install the required dependencies. \


- Now change into the directory that was just created

- Cd /tiny

- Start the Next Dev Server

- npm run dev

- This starts your Next.js app’s "development server" on port **3000**

- Open [http://localhost:3000](http://localhost:3000) from your browser to view your app. \


- If port 3000 is already in use, you can change to a new port, say 3080. You can open the package.json and update the dev script as follows:

- "dev": "next dev -p 3080",

- Now if you run npm run dev, you should be able to access the app at [http://localhost:8090](http://localhost:8090). \


- Open the /tiny directory in your IDE of choice

## Integrating TinyMCE

### Copy TinyMCE files to public folder as self hosted

- Copy static files(tinymce files) to public folder. Edit file `next.config.js`

```
// /next.config.mjs

/** @type {import('next').NextConfig} */

const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  future: {
    webpack5: true,
  },
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    config.plugins.push(
      new CopyPlugin({
        patterns: [
          {
            from: path.join(__dirname, "node_modules/tinymce"),
            to: path.join(__dirname, "public/assets/libs/tinymce"),
          },
        ],
      })
    );
    return config;
  },
  webpackDevMiddleware: (config) => {
    return config;
  },
};

module.exports = nextConfig;
```
### Create the editor component

- Create a new file at  tiny/components/editor and name it CustomEditor.jsx

- Paste the following code into the CustomEditor.tsx file

```
// src/components/editor/EditPage.tsx

import { Editor } from "@tinymce/tinymce-react";
import React, { useRef } from "react";

export function CustomEditor(props) {
  const editorRef = useRef(null);
  const log = () => {
    if (editorRef.current) {
      console.log(editorRef.current.getContent());
    }
  };
  return (
    <Editor
      tinymceScriptSrc={"/assets/libs/tinymce/tinymce.min.js"}
      onInit={(evt, editor) => (editorRef.current = editor)}
      value={props.content}
      init={{
        height: 500,
        menubar: true,
        plugins: [
          "advlist",
          "autolink",
          "lists",
          "link",
          "image",
          "charmap",
          "preview",
          "anchor",
          "searchreplace",
          "visualblocks",
          "code",
          "fullscreen",
          "insertdatetime",
          "media",
          "table",
          "code",
          "help",
          "wordcount",
        ],
        toolbar:
          "undo redo | blocks | " +
          "bold italic forecolor | alignleft aligncenter " +
          "alignright alignjustify | bullist numlist outdent indent | " +
          "removeformat | help",
        content_style:
          "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
      }}
      onEditorChange={props.handleOnEditorChange}
    />
  );
}
```
## Integrating Google Firebase

- Create a new file in the apps root directory named firebase.js then paste the following code into the file you just created.

```
// firebase.js

// Import the Firebase core module and any specific services you need
import firebase from 'firebase/compat/app'; // Use 'compat/app' for Firebase v9 (Modular SDK) backward compatibility
import 'firebase/compat/firestore'; // Use 'compat/firestore' for Firebase v9 (Modular SDK) backward compatibility


const firebaseConfig = {
  apiKey: "apikey",
  authDomain: "authDomain",
  projectId: "projectID",
  storageBucket: "storageBucket",
  messagingSenderId: "messagingSenderId",
  appId: "appId"
};

// Initialize Firebase
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

// Export Firestore
export const firestore = firebase.firestore();
```
Change the default placeholders in the firebaseConfig section with your project's information. You can find this information in your project’s settings on Firebase.

```
const firebaseConfig = {
  apiKey: "apikey",
  authDomain: "authDomain",
  projectId: "projectID",
  storageBucket: "storageBucket",
  messagingSenderId: "messagingSenderId",
  appId: "appId"
};
```
## Build the EditPage.tsx and DisplayPage.tsx components

Create the files needed to build out the Edit and Display functionality

### Create a new file named EditPage.tsx in the tiny/src/components/editor directory then paste the following code:

```
// src/components/editor/EditPage.tsx

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
```
### Create another new file named DisplayPage.tsx in the tiny/src directory then paste the following code:

```
// src/components/editor/DisplayPage.tsx

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
```
## Build the edit.tsx and display.tsx pages

Create the files needed to build out the Edit and Display pages

If it does not already exist, create a new directory in the root directory named Pages

### Create a new file named edit.tsx in the /pages directory then paste the following code:

```
// pages/edit.tsx

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
```
### Create a new file named display.tsx in the /pages directory then paste the following code:

```
// pages/display.tsx

import DisplayPage from '../src/components/DisplayPage';

export default function Display() {
  return <DisplayPage />;
}
```


### Edit the file named page.tsx that is located in the tiny/src/app directory then paste the following code:

- This will add a TinyMCE editor to the home page for demonstration purposes

```
tiny/src/app/page.tsx

'use client';

import React, { useState } from 'react';
import { CustomEditor } from '../components/editor/CustomEditor';
import Image from "next/image";

export default function Home() {
  const [content, setContent] = useState('<p>This is the initial content of the editor.</p>');

  const handleEditorChange = (newContent: string) => {
    setContent(newContent);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">
        <p className="fixed left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
          Get started by editing&nbsp;
          <code className="font-mono font-bold">src/app/page.tsx</code>
        </p>
        <div className="fixed bottom-0 left-0 flex h-48 w-full items-end justify-center bg-gradient-to-t from-white via-white dark:from-black dark:via-black lg:static lg:size-auto lg:bg-none">
          <a
            className="pointer-events-none flex place-items-center gap-2 p-8 lg:pointer-events-auto lg:p-0"
            href="https://vercel.com?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            By{" "}
            <Image
              src="/vercel.svg"
              alt="Vercel Logo"
              className="dark:invert"
              width={100}
              height={24}
              priority
            />
          </a>
        </div>
      </div>

      <div className="relative z-[-1] flex place-items-center before:absolute before:h-[300px] before:w-full before:-translate-x-1/2 before:rounded-full before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl before:content-[''] after:absolute after:-z-20 after:h-[180px] after:w-full after:translate-x-1/3 after:bg-gradient-conic after:from-sky-200 after:via-blue-200 after:blur-2xl after:content-[''] before:dark:bg-gradient-to-br before:dark:from-transparent before:dark:to-blue-700 before:dark:opacity-10 after:dark:from-sky-900 after:dark:via-[#0141ff] after:dark:opacity-40 sm:before:w-[480px] sm:after:w-[240px] before:lg:h-[360px]">
        <Image
          className="relative dark:drop-shadow-[0_0_0.3rem_#ffffff70] dark:invert"
          src="/next.svg"
          alt="Next.js Logo"
          width={180}
          height={37}
          priority
        />
      </div>

      <div className="mb-32 grid text-center lg:mb-0 lg:w-full lg:max-w-5xl lg:grid-cols-4 lg:text-left">
        <a
          href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
          target="_blank"
          rel="noopener noreferrer"
        >
          <h2 className="mb-3 text-2xl font-semibold">
            Docs{" "}
            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              -&gt;
            </span>
          </h2>
          <p className="m-0 max-w-[30ch] text-sm opacity-50">
            Find in-depth information about Next.js features and API.
          </p>
        </a>

        <a
          href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
          target="_blank"
          rel="noopener noreferrer"
        >
          <h2 className="mb-3 text-2xl font-semibold">
            Learn{" "}
            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              -&gt;
            </span>
          </h2>
          <p className="m-0 max-w-[30ch] text-sm opacity-50">
            Learn about Next.js in an interactive course with&nbsp;quizzes!
          </p>
        </a>

        <a
          href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
          target="_blank"
          rel="noopener noreferrer"
        >
          <h2 className="mb-3 text-2xl font-semibold">
            Templates{" "}
            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              -&gt;
            </span>
          </h2>
          <p className="m-0 max-w-[30ch] text-sm opacity-50">
            Explore starter templates for Next.js.
          </p>
        </a>

        <a
          href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
          target="_blank"
          rel="noopener noreferrer"
        >
          <h2 className="mb-3 text-2xl font-semibold">
            Deploy{" "}
            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              -&gt;
            </span>
          </h2>
          <p className="m-0 max-w-[30ch] text-sm opacity-50">
            Instantly deploy your Next.js site to a shareable URL with Vercel.
          </p>
        </a>
      </div>

      <div className="my-16 w-full max-w-4xl">
        <h2 className="text-2xl font-semibold mb-6">TinyMCE Editor</h2>
        <CustomEditor content={content} handleOnEditorChange={handleEditorChange} />
        <div className="mt-6">
          <h3 className="text-xl font-semibold">Editor Content:</h3>
          <div dangerouslySetInnerHTML={{ __html: content }} className="border p-4 rounded-md mt-2 bg-gray-50" />
        </div>
      </div>
    </main>
  );
}
```
## Ensure File Structure Is Compliant

If you encounter errors, ensure your project’s file structure is correct.

```

/tiny
.next
node_modules
pages
├── display.tsx
├── edit.tsx
public
└── assets
    ├── next.svg
    └── vercel.svg
src
├── app
│   ├── favicon.ico
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
└── components
    └── editor
        └── DisplayPage.tsx
.eslintrc.json
.gitignore
firebase.js
next-env.d.ts
next.config.mjs
package-lock.json
package.json
postcss.config.mjs
README.md
tailwind.config.ts
tsconfig.json
yarn.lock
```

## How to create and view content

- This is just a proof of concept, and the functionality is very crude at this point, but you should now be able to open [http://localhost:3000](http://localhost:3000) from your browser to view your app. (Change the port number if needed) \


- Open [http://localhost:3000/edit](http://localhost:3000) to create content (Change the port number if needed)

- Open [http://localhost:3000/display](http://localhost:3000) to see the last piece of content that was saved in the Firestore Database (Change the port number if needed)

## How it works

When you create content in the TinyMCE editor located at /edit, and then click the save button, the content is assigned a unique ID and is then sent to Firebase and stored in the Firestore Database collection we created earlier. Firebase logs the date and time this data was stored.  \
 \
When you visit /display, the last data stored in the collection is recalled and displayed on the page.  \
 \
Future Development

- Create different collections for different pages

- Add a dropdown that will select the collection to store content in

- Create corresponding page displays that pull from each collection

- Add local storage functionality to temporarily store unsaved content to the browser’s local storage  in the event of a page refresh which currently results in complete loss of the unsaved data.

As a concept, these features will allow me to edit every page on the website from the /edit page.
