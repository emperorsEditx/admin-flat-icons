"use client";

import Alert from "@/components/ui/alert/Alert";
import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import axios from "axios";
import Link from "next/link";
import { useSession } from "next-auth/react";

interface UploadedFile {
  name: string;
  size: string;
  status: string;
  progress: number; // NEW
}

const DropzoneComponent: React.FC = () => {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const { data: session } = useSession();

  const formatBytes = (bytes: number) => {
    if (bytes < 1024) return `${bytes} Bytes`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const uploadFile = (file: File) => {
    if (!session?.user?.id) {
      alert("You must be logged in to upload files.");
      return;
    }

    const formData = new FormData();
    formData.append("files", file);
    formData.append("createdBy", session.user.id.toString());

    // Add initial file record with 0% progress
    setUploadedFiles((prev) => [
      ...prev,
      {
        name: file.name,
        size: formatBytes(file.size),
        status: "Uploading...",
        progress: 0,
      },
    ]);

    axios
      .post("http://localhost:8000/icons/temp-upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (event) => {
          const total = event.total ?? 0;
          const loaded = event.loaded ?? 0;
          const progress = total ? Math.round((loaded / total) * 100) : 0;

          setUploadedFiles((prev) =>
            prev.map((f) =>
              f.name === file.name ? { ...f, status: "Uploading...", progress } : f
            )
          );
        },
      })
      .then(() => {
        setUploadedFiles((prev) =>
          prev.map((f) =>
            f.name === file.name
              ? { ...f, status: "Uploaded Successfully", progress: 100 }
              : f
          )
        );
        setShowSuccessMessage(true);
      })
      .catch(() => {
        setUploadedFiles((prev) =>
          prev.map((f) =>
            f.name === file.name
              ? { ...f, status: "Upload Failed", progress: 0 }
              : f
          )
        );
      });
  };

  const onDrop = (acceptedFiles: File[]) => {
    setShowSuccessMessage(false);
    acceptedFiles.forEach((file) => uploadFile(file));
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/png": [],
      "image/jpeg": [],
      "image/webp": [],
      "image/svg+xml": [],
    },
  });

  return (
    <>
      {/* Show dropzone only if no files uploaded */}
      {!showSuccessMessage && uploadedFiles.length === 0 && (
        <div className="transition border-5 border-[#2CB88B] border-dashed cursor-pointer dark:hover:border-brand-500 dark:border-gray-700 rounded-xl hover:border-gray-200">
          <form
            {...getRootProps()}
            className={`dropzone rounded-xl border-dashed border-gray-300 p-7 lg:p-10 
              ${isDragActive
                ? "border-brand-500 bg-gray-100 dark:bg-gray-800"
                : "border-gray-300 bg-gray-50 dark:border-gray-700 dark:bg-gray-900"
              }
            `}
            id="demo-upload"
          >
            <input {...getInputProps()} />

            <div className="dz-message flex flex-col items-center">
              <div className="mb-5.5 flex justify-center">
                <div className="flex h-17 w-17 items-center justify-center rounded-full bg-[#2CB88B] text-white">
                  <svg
                    className="fill-current"
                    width="29"
                    height="28"
                    viewBox="0 0 29 28"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M14.5019 3.91699C14.2852 3.91699 14.0899 4.00891 13.953 4.15589L8.57363 9.53186C8.28065 9.82466 8.2805 10.2995 8.5733 10.5925C8.8661 10.8855 9.34097 10.8857 9.63396 10.5929L13.7519 6.47752V18.667C13.7519 19.0812 14.0877 19.417 14.5019 19.417C14.9161 19.417 15.2519 19.0812 15.2519 18.667V6.48234L19.3653 10.5929C19.6583 10.8857 20.1332 10.8855 20.426 10.5925C20.7188 10.2995 20.7186 9.82463 20.4256 9.53184L15.0838 4.19378C14.9463 4.02488 14.7367 3.91699 14.5019 3.91699ZM5.91626 18.667C5.91626 18.2528 5.58047 17.917 5.16626 17.917C4.75205 17.917 4.41626 18.2528 4.41626 18.667V21.8337C4.41626 23.0763 5.42362 24.0837 6.66626 24.0837H22.3339C23.5766 24.0837 24.5839 23.0763 24.5839 21.8337V18.667C24.5839 18.2528 24.2482 17.917 23.8339 17.917C23.4197 17.917 23.0839 18.2528 23.0839 18.667V21.8337C23.0839 22.2479 22.7482 22.5837 22.3339 22.5837H6.66626C6.25205 22.5837 5.91626 22.2479 5.91626 21.8337V18.667Z"
                    />
                  </svg>
                </div>
              </div>

              <h4 className="mb-3 font-semibold text-gray-800 text-theme-xl dark:text-white/90">
                {isDragActive ? "Drop Files Here" : "Drag & Drop Files Here"}
              </h4>

              <span className="text-center mb-5 block w-full max-w-[290px] text-sm text-gray-700 dark:text-gray-400">
                Drag and drop your PNG, JPG, WebP, SVG images here or browse
              </span>

              <span className="font-medium underline text-theme-sm text-brand-500">
                Browse File
              </span>
            </div>
          </form>
        </div>
      )}

      {/* Success Message */}
      {showSuccessMessage && (
        <div className="text-left mt-6 p-4 rounded-lg">
          <Alert variant="success" title={`${uploadedFiles.length} icons saved to draft successfully!`} message="" />
        </div>
      )}

      {/* Uploaded Files Table */}
      {uploadedFiles.length > 0 && (
        <div className="mt-8 overflow-x-auto">
          <table className="w-full table-fixed bg-white dark:bg-gray-800 shadow-md rounded-lg">
            <thead>
              <tr className="bg-gray-100 dark:bg-gray-700">
                <th className="w-1/4 p-3 text-left dark:text-white">Status</th>
                <th className="w-1/2 p-3 text-left dark:text-white">File Name</th>
                <th className="w-1/4 p-3 text-left dark:text-white">Size</th>
              </tr>
            </thead>
            <tbody>
              {uploadedFiles.map((file, index) => (
                <tr
                  key={index}
                  className={`border-b dark:border-gray-700
          ${index % 2 === 0
                      ? "bg-white dark:bg-gray-800"
                      : "bg-gray-100 dark:bg-gray-700"
                    }
          hover:bg-gray-200 dark:hover:bg-gray-600
        `}
                >
                  <td className="w-1/4 p-3 text-left dark:text-white">
                    <div className="flex items-center gap-2">
                      <span
                        className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-white ${file.status === "Uploaded Successfully"
                            ? "bg-[#2CB88B]"
                            : file.status === "Upload Failed"
                              ? "bg-red-500"
                              : "bg-blue-500"
                          }`}
                      >
                        {file.status === "Uploaded Successfully"
                          ? "✔"
                          : file.status === "Upload Failed"
                            ? "✖"
                            : "⏳"}
                      </span>
                      {file.status}
                    </div>
                  </td>

                  <td className="w-1/2 p-3 text-left dark:text-white truncate">
                    {file.name}
                  </td>

                  <td className="w-1/4 p-3 text-left dark:text-white">
                    {file.size}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
};

export default DropzoneComponent;
