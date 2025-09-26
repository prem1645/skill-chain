'use client'

import { useState } from 'react'

import { CheckIcon, FileIcon, UploadIcon, XIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Form,
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'

interface VerificationDocumentsProps {
  form: any
}

export function VerificationDocuments({ form }: VerificationDocumentsProps) {
  const [dragActive, setDragActive] = useState(false)

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files)
    }
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(e.target.files)
    }
  }

  const handleFiles = (files: FileList) => {
    const currentDocuments = form.getFieldValue('documents')
    const newDocuments = Array.from(files).map((file) => file.name)
    form.setFieldValue('documents', [...currentDocuments, ...newDocuments])
  }

  const removeDocument = (documentToRemove: string) => {
    const currentDocuments = form.getFieldValue('documents')
    form.setFieldValue(
      'documents',
      currentDocuments.filter((doc: string) => doc !== documentToRemove)
    )
  }

  const requiredDocuments = [
    'College License/Certificate',
    'Accreditation Certificate',
    'Administrative Authorization Letter',
    'Tax Exemption Certificate (if applicable)',
  ]

  return (
    <div className='space-y-6 animate-in slide-in-from-right-4 duration-300'>
      <div className='space-y-4'>
        <h3 className='text-lg font-medium'>Verification Documents</h3>
        <p className='text-sm text-muted-foreground'>
          Upload the required documents to verify your college's credentials and
          authorization.
        </p>
      </div>

      <div className='space-y-4'>
        <h4 className='text-sm font-medium'>Required Documents</h4>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
          {requiredDocuments.map((doc, index) => (
            <div key={index} className='flex items-center space-x-2 text-sm'>
              <CheckIcon size={16} className='text-green-600' />
              <span>{doc}</span>
            </div>
          ))}
        </div>
      </div>

      <Form className='space-y-6'>
        <form.AppField name='documents'>
          {(field) => (
            <FormItem>
              <FormLabel>Upload Documents *</FormLabel>
              <FormControl>
                <div
                  className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                    dragActive
                      ? 'border-primary bg-primary/5'
                      : 'border-muted-foreground/25 hover:border-muted-foreground/50'
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}>
                  <input
                    type='file'
                    multiple
                    accept='.pdf,.doc,.docx,.jpg,.jpeg,.png'
                    onChange={handleFileInput}
                    className='absolute inset-0 w-full h-full opacity-0 cursor-pointer'
                  />
                  <div className='space-y-4'>
                    <UploadIcon
                      size={48}
                      className='mx-auto text-muted-foreground'
                    />
                    <div>
                      <p className='text-sm font-medium'>
                        Drag & drop files here, or click to browse
                      </p>
                      <p className='text-xs text-muted-foreground mt-1'>
                        PDF, DOC, DOCX, JPG, PNG up to 10MB each
                      </p>
                    </div>
                  </div>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        </form.AppField>

        <form.AppField name='documents'>
          {(field) => (
            <div className='space-y-3'>
              {field.state.value.length > 0 && (
                <>
                  <h4 className='text-sm font-medium'>Uploaded Documents</h4>
                  <div className='space-y-2'>
                    {field.state.value.map(
                      (document: string, index: number) => (
                        <Card key={index} className='p-3'>
                          <CardContent className='p-0'>
                            <div className='flex items-center justify-between'>
                              <div className='flex items-center space-x-3'>
                                <FileIcon
                                  size={20}
                                  className='text-muted-foreground'
                                />
                                <span className='text-sm font-medium'>
                                  {document}
                                </span>
                              </div>
                              <Button
                                type='button'
                                variant='ghost'
                                size='sm'
                                onClick={() => removeDocument(document)}
                                className='text-destructive hover:text-destructive'>
                                <XIcon size={16} />
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      )
                    )}
                  </div>
                </>
              )}
            </div>
          )}
        </form.AppField>
      </Form>

      <div className='bg-muted/50 p-4 rounded-lg'>
        <h4 className='text-sm font-medium mb-2'>Document Guidelines</h4>
        <ul className='text-xs text-muted-foreground space-y-1'>
          <li>• All documents must be clear and legible</li>
          <li>• Accepted formats: PDF, DOC, DOCX, JPG, PNG</li>
          <li>• Maximum file size: 10MB per document</li>
          <li>• Documents will be reviewed within 2-3 business days</li>
        </ul>
      </div>
    </div>
  )
}
