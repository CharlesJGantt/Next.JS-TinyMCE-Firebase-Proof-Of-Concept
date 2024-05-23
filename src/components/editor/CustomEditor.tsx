import { Editor } from "@tinymce/tinymce-react";
import React, { useRef } from "react";

export function CustomEditor(props) {
  const editorRef = useRef(null);
  const log = () => {
    if (editorRef.current) {
      console.log(editorRef.current.getContent());
    }
  };

  // Static ID for the editor component
  const editorId = "custom_editor";

  return (
    <Editor
      tinymceScriptSrc={"/assets/libs/tinymce/tinymce.min.js"}
      id={editorId} // Set a static ID for the editor component
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
