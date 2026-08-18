'use client'

import { useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { UploadCloud, File, X, CheckCircle2, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface FileUploaderProps {
  bucket: string
  folder?: string
  accept?: string
  maxSizeMB?: number
  onUploadSuccess: (url: string) => void
  onUploadError?: (error: Error) => void
  existingUrl?: string
}

export function FileUploader({
  bucket,
  folder = '',
  accept,
  maxSizeMB = 50,
  onUploadSuccess,
  onUploadError,
  existingUrl
}: FileUploaderProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(existingUrl || null)
  const [error, setError] = useState<string | null>(null)

  const supabase = createClient()

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault()
      e.stopPropagation()
      setIsDragging(false)

      const files = Array.from(e.dataTransfer.files)
      if (files && files.length > 0) {
        uploadFile(files[0])
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      uploadFile(e.target.files[0])
    }
  }

  const uploadFile = async (file: globalThis.File) => {
    setError(null)

    // Validate size
    if (file.size > maxSizeMB * 1024 * 1024) {
      const err = new Error(`File is too large. Maximum size is ${maxSizeMB}MB.`)
      setError(err.message)
      if (onUploadError) onUploadError(err)
      return
    }

    try {
      setIsUploading(true)
      setProgress(10) // Initial progress

      const fileExt = file.name.split('.').pop()
      const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`
      const filePath = folder ? `${folder}/${fileName}` : fileName

      const { data, error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
        })

      setProgress(80)

      if (uploadError) {
        throw uploadError
      }

      // If it's a public bucket, get the public URL. Otherwise, just store the path.
      let finalUrl = data.path
      
      if (bucket === 'public-assets') {
        const { data: publicUrlData } = supabase.storage
          .from(bucket)
          .getPublicUrl(data.path)
        finalUrl = publicUrlData.publicUrl
      }

      setProgress(100)
      setUploadedUrl(finalUrl)
      onUploadSuccess(finalUrl)

    } catch (err: any) {
      console.error('Upload error:', err)
      setError(err.message || 'An error occurred during upload')
      if (onUploadError) onUploadError(err)
    } finally {
      setIsUploading(false)
      setTimeout(() => setProgress(0), 1000)
    }
  }

  const clearUpload = () => {
    setUploadedUrl(null)
    onUploadSuccess('')
  }

  if (uploadedUrl) {
    return (
      <div className="relative border rounded-lg p-4 bg-muted/30 flex items-center justify-between">
        <div className="flex items-center gap-3 overflow-hidden">
          <CheckCircle2 className="w-8 h-8 text-green-500 shrink-0" />
          <div className="truncate">
            <p className="font-medium text-sm truncate">{uploadedUrl.split('/').pop()}</p>
            <p className="text-xs text-muted-foreground">Upload complete</p>
          </div>
        </div>
        <Button variant="ghost" size="icon" onClick={clearUpload} className="shrink-0">
          <X className="w-4 h-4" />
        </Button>
      </div>
    )
  }

  return (
    <div className="w-full">
      <div
        className={`relative border-2 border-dashed rounded-lg p-8 transition-colors flex flex-col items-center justify-center gap-4 text-center cursor-pointer ${
          isDragging 
            ? 'border-primary bg-primary/5' 
            : 'border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/50'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => document.getElementById(`file-upload-${bucket}`)?.click()}
      >
        <input
          id={`file-upload-${bucket}`}
          type="file"
          className="hidden"
          accept={accept}
          onChange={handleFileSelect}
          disabled={isUploading}
        />
        
        {isUploading ? (
          <>
            <Loader2 className="w-10 h-10 text-primary animate-spin" />
            <div className="space-y-1">
              <p className="text-sm font-medium">Uploading... {progress}%</p>
              <p className="text-xs text-muted-foreground">Please wait while your file uploads.</p>
            </div>
          </>
        ) : (
          <>
            <div className="p-4 bg-muted rounded-full">
              <UploadCloud className="w-8 h-8 text-muted-foreground" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium">
                Drag & drop your file here, or click to browse
              </p>
              <p className="text-xs text-muted-foreground">
                Supports {accept || 'all files'} (max {maxSizeMB}MB)
              </p>
            </div>
          </>
        )}
      </div>
      
      {error && (
        <p className="text-sm text-destructive mt-2 font-medium">{error}</p>
      )}
    </div>
  )
}
