/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Download, FileCode, Folder, FolderOpen, Terminal, CheckCircle2, Server, Database } from 'lucide-react';
import { getSpringCodebase } from '../javaCodebaseGenerator';

export default function ZipExportPanel() {
  const javaFiles = getSpringCodebase();
  const [selectedFile, setSelectedFile] = useState<string>("pom.xml");
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);

  // Find active file content
  const activeFile = javaFiles.find(f => f.path === selectedFile) || {
    path: "pom.xml",
    content: `<!-- Select a file from the explorer on the left to inspect -->`
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(activeFile.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadZip = async () => {
    setDownloading(true);
    try {
      const response = await fetch('/api/export-zip');
      if (!response.ok) {
        throw new Error(`Failed to download project ZIP: status ${response.status}`);
      }
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'Student_Management_System_Enterprise.zip';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      console.error("Download failed", err);
      // Fallback to direct navigation if AJAX is blocked
      window.open('/api/export-zip', '_blank');
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden" id="zip-exporter">
      {/* Exporter Hero Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 px-6 py-8 text-white">
        <div className="max-w-4xl">
          <div className="flex items-center gap-2 mb-3">
            <span className="px-2.5 py-1 text-xs font-mono bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded-full">
              Java 21 + Spring Boot 3 + React 19
            </span>
            <span className="px-2.5 py-1 text-xs font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full">
              MySQL 8
            </span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight mb-2">Enterprise Project Archiver & Exporter</h2>
          <p className="text-slate-300 text-sm max-w-2xl leading-relaxed">
            Download the production-ready full-stack Student Management System. This packages the complete Spring Boot 3 REST backend with JWT security filters and a multi-dashboard React 19 client setup.
          </p>
          
          <button
            onClick={handleDownloadZip}
            disabled={downloading}
            className="mt-6 inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-lg shadow-lg shadow-indigo-600/20 transition-all duration-150 disabled:opacity-50"
          >
            <Download className="w-5 h-5" />
            {downloading ? "Preparing Enterprise ZIP Bundle..." : "Download Full Project ZIP Folder"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 border-t border-slate-200">
        {/* Left Side: Folder structure list */}
        <div className="lg:col-span-4 bg-slate-50 p-4 border-r border-slate-200">
          <div className="flex items-center gap-2 mb-3 text-xs font-semibold text-slate-500 tracking-wider uppercase px-2">
            <Terminal className="w-3.5 h-3.5 text-slate-400" />
            <span>Generated File Explorer</span>
          </div>

          <div className="space-y-1 text-sm">
            {/* Root files */}
            <div className="px-2 py-1 text-xs font-semibold text-slate-400 flex items-center gap-1.5">
              <FolderOpen className="w-3.5 h-3.5" /> root/
            </div>
            <div className="pl-4 space-y-0.5">
              <button
                onClick={() => setSelectedFile("pom.xml")}
                className={`w-full flex items-center gap-2 px-2 py-1.5 rounded text-left transition-colors ${
                  selectedFile === "pom.xml" ? "bg-indigo-50 text-indigo-600 font-medium" : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                <FileCode className="w-4 h-4 text-slate-400" />
                pom.xml
              </button>
              <button
                onClick={() => setSelectedFile("docker-compose.yml")}
                className={`w-full flex items-center gap-2 px-2 py-1.5 rounded text-left transition-colors ${
                  selectedFile === "docker-compose.yml" ? "bg-indigo-50 text-indigo-600 font-medium" : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                <FileCode className="w-4 h-4 text-slate-400" />
                docker-compose.yml
              </button>
              <button
                onClick={() => setSelectedFile("README.md")}
                className={`w-full flex items-center gap-2 px-2 py-1.5 rounded text-left transition-colors ${
                  selectedFile === "README.md" ? "bg-indigo-50 text-indigo-600 font-medium" : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                <FileCode className="w-4 h-4 text-slate-400" />
                README.md
              </button>
            </div>

            {/* Resources folder */}
            <div className="px-2 pt-2 py-1 text-xs font-semibold text-slate-400 flex items-center gap-1.5">
              <FolderOpen className="w-3.5 h-3.5" /> src/main/resources/
            </div>
            <div className="pl-4 space-y-0.5">
              <button
                onClick={() => setSelectedFile("src/main/resources/application.yml")}
                className={`w-full flex items-center gap-2 px-2 py-1.5 rounded text-left transition-colors ${
                  selectedFile === "src/main/resources/application.yml" ? "bg-indigo-50 text-indigo-600 font-medium" : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                <FileCode className="w-4 h-4 text-slate-400" />
                application.yml
              </button>
              <button
                onClick={() => setSelectedFile("src/main/resources/schema.sql")}
                className={`w-full flex items-center gap-2 px-2 py-1.5 rounded text-left transition-colors ${
                  selectedFile === "src/main/resources/schema.sql" ? "bg-indigo-50 text-indigo-600 font-medium" : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                <Database className="w-4 h-4 text-amber-500" />
                schema.sql (MySQL)
              </button>
              <button
                onClick={() => setSelectedFile("src/main/resources/data.sql")}
                className={`w-full flex items-center gap-2 px-2 py-1.5 rounded text-left transition-colors ${
                  selectedFile === "src/main/resources/data.sql" ? "bg-indigo-50 text-indigo-600 font-medium" : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                <Database className="w-4 h-4 text-amber-500" />
                data.sql (Seeds)
              </button>
            </div>

            {/* Config & Security Java folder */}
            <div className="px-2 pt-2 py-1 text-xs font-semibold text-slate-400 flex items-center gap-1.5">
              <Server className="w-3.5 h-3.5" /> Java Modules/
            </div>
            <div className="pl-4 space-y-0.5">
              <button
                onClick={() => setSelectedFile("src/main/java/com/school/management/StudentManagementApplication.java")}
                className={`w-full flex items-center gap-2 px-2 py-1.5 rounded text-left transition-colors ${
                  selectedFile === "src/main/java/com/school/management/StudentManagementApplication.java" ? "bg-indigo-50 text-indigo-600 font-medium" : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                <FileCode className="w-4 h-4 text-indigo-400" />
                Application.java
              </button>
              <button
                onClick={() => setSelectedFile("src/main/java/com/school/management/config/SecurityConfig.java")}
                className={`w-full flex items-center gap-2 px-2 py-1.5 rounded text-left transition-colors ${
                  selectedFile === "src/main/java/com/school/management/config/SecurityConfig.java" ? "bg-indigo-50 text-indigo-600 font-medium" : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                <FileCode className="w-4 h-4 text-indigo-400" />
                SecurityConfig.java
              </button>
              <button
                onClick={() => setSelectedFile("src/main/java/com/school/management/security/JwtTokenProvider.java")}
                className={`w-full flex items-center gap-2 px-2 py-1.5 rounded text-left transition-colors ${
                  selectedFile === "src/main/java/com/school/management/security/JwtTokenProvider.java" ? "bg-indigo-50 text-indigo-600 font-medium" : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                <FileCode className="w-4 h-4 text-indigo-400" />
                JwtTokenProvider.java
              </button>
              <button
                onClick={() => setSelectedFile("src/main/java/com/school/management/security/JwtAuthenticationFilter.java")}
                className={`w-full flex items-center gap-2 px-2 py-1.5 rounded text-left transition-colors ${
                  selectedFile === "src/main/java/com/school/management/security/JwtAuthenticationFilter.java" ? "bg-indigo-50 text-indigo-600 font-medium" : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                <FileCode className="w-4 h-4 text-indigo-400" />
                JwtFilter.java
              </button>
              <button
                onClick={() => setSelectedFile("src/main/java/com/school/management/entity/Student.java")}
                className={`w-full flex items-center gap-2 px-2 py-1.5 rounded text-left transition-colors ${
                  selectedFile === "src/main/java/com/school/management/entity/Student.java" ? "bg-indigo-50 text-indigo-600 font-medium" : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                <FileCode className="w-4 h-4 text-indigo-400" />
                StudentEntity.java
              </button>
              <button
                onClick={() => setSelectedFile("src/main/java/com/school/management/controller/StudentController.java")}
                className={`w-full flex items-center gap-2 px-2 py-1.5 rounded text-left transition-colors ${
                  selectedFile === "src/main/java/com/school/management/controller/StudentController.java" ? "bg-indigo-50 text-indigo-600 font-medium" : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                <FileCode className="w-4 h-4 text-indigo-400" />
                StudentController.java
              </button>
              <button
                onClick={() => setSelectedFile("src/main/java/com/school/management/exception/GlobalExceptionHandler.java")}
                className={`w-full flex items-center gap-2 px-2 py-1.5 rounded text-left transition-colors ${
                  selectedFile === "src/main/java/com/school/management/exception/GlobalExceptionHandler.java" ? "bg-indigo-50 text-indigo-600 font-medium" : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                <FileCode className="w-4 h-4 text-indigo-400" />
                GlobalExceptionHandler.java
              </button>
            </div>
          </div>
        </div>

        {/* Right Side: File code viewer */}
        <div className="lg:col-span-8 bg-slate-950 p-4 flex flex-col min-h-[480px]">
          <div className="flex justify-between items-center pb-3 border-b border-slate-800 mb-3">
            <span className="font-mono text-xs text-slate-400 flex items-center gap-1.5">
              <FileCode className="w-4 h-4 text-indigo-400" />
              {activeFile.path}
            </span>
            <button
              onClick={handleCopy}
              className="text-xs text-slate-400 hover:text-white px-2.5 py-1 rounded bg-slate-900 border border-slate-800 hover:bg-slate-800 transition-all flex items-center gap-1"
            >
              {copied ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  Copied!
                </>
              ) : (
                "Copy Code"
              )}
            </button>
          </div>
          <div className="flex-1 overflow-auto max-h-[400px]">
            <pre className="font-mono text-xs text-slate-300 leading-relaxed whitespace-pre p-2">
              <code>{activeFile.content}</code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
