'use client'

import {
  BuildingIcon,
  CheckIcon,
  FileIcon,
  MailIcon,
  PhoneIcon,
  UserIcon,
} from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface ReviewSubmitProps {
  form: any
}

export function ReviewSubmit({ form }: ReviewSubmitProps) {
  const formData = form.state.values

  const getCollegeTypeLabel = (type: string) => {
    const typeMap: Record<string, string> = {
      public: 'Public University',
      private: 'Private University',
      community: 'Community College',
      technical: 'Technical Institute',
      'liberal-arts': 'Liberal Arts College',
      research: 'Research University',
      online: 'Online University',
      other: 'Other',
    }
    return typeMap[type] || type
  }

  return (
    <div className='space-y-6 animate-in slide-in-from-right-4 duration-300'>
      <div className='space-y-4'>
        <h3 className='text-lg font-medium'>Review Your Information</h3>
        <p className='text-sm text-muted-foreground'>
          Please review all the information below before submitting your college
          registration.
        </p>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
        {/* College Basic Information */}
        <Card>
          <CardHeader className='pb-3'>
            <CardTitle className='text-base flex items-center space-x-2'>
              <BuildingIcon size={18} />
              <span>College Information</span>
            </CardTitle>
          </CardHeader>
          <CardContent className='space-y-3'>
            <div>
              <label className='text-xs font-medium text-muted-foreground'>
                College Name
              </label>
              <p className='text-sm font-medium'>{formData.collegeName}</p>
            </div>
            <div>
              <label className='text-xs font-medium text-muted-foreground'>
                Type
              </label>
              <p className='text-sm font-medium'>
                {getCollegeTypeLabel(formData.collegeType)}
              </p>
            </div>
            <div>
              <label className='text-xs font-medium text-muted-foreground'>
                Location
              </label>
              <p className='text-sm font-medium'>{formData.location}</p>
            </div>
          </CardContent>
        </Card>

        {/* Contact Details */}
        <Card>
          <CardHeader className='pb-3'>
            <CardTitle className='text-base flex items-center space-x-2'>
              <UserIcon size={18} />
              <span>Contact Information</span>
            </CardTitle>
          </CardHeader>
          <CardContent className='space-y-3'>
            <div>
              <label className='text-xs font-medium text-muted-foreground'>
                Administrator
              </label>
              <p className='text-sm font-medium'>{formData.adminName}</p>
            </div>
            <div>
              <label className='text-xs font-medium text-muted-foreground'>
                Phone
              </label>
              <p className='text-sm font-medium flex items-center space-x-1'>
                <PhoneIcon size={14} />
                <span>{formData.adminPhone}</span>
              </p>
            </div>
            <div>
              <label className='text-xs font-medium text-muted-foreground'>
                Email
              </label>
              <p className='text-sm font-medium flex items-center space-x-1'>
                <MailIcon size={14} />
                <span>{formData.adminEmail}</span>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* College Details */}
      <Card>
        <CardHeader className='pb-3'>
          <CardTitle className='text-base flex items-center space-x-2'>
            <CheckIcon size={18} />
            <span>College Details</span>
          </CardTitle>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div>
              <label className='text-xs font-medium text-muted-foreground'>
                Accreditation
              </label>
              <p className='text-sm font-medium'>{formData.accreditation}</p>
            </div>
            <div>
              <label className='text-xs font-medium text-muted-foreground'>
                Student Count
              </label>
              <p className='text-sm font-medium'>
                {formData.studentCount.toLocaleString()}
              </p>
            </div>
          </div>

          <div>
            <label className='text-xs font-medium text-muted-foreground mb-2 block'>
              Departments
            </label>
            <div className='flex flex-wrap gap-2'>
              {formData.departments.map((department: string, index: number) => (
                <Badge key={index} variant='secondary'>
                  {department}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Verification Documents */}
      <Card>
        <CardHeader className='pb-3'>
          <CardTitle className='text-base flex items-center space-x-2'>
            <FileIcon size={18} />
            <span>Verification Documents</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='space-y-2'>
            {formData.documents.map((document: string, index: number) => (
              <div key={index} className='flex items-center space-x-2 text-sm'>
                <CheckIcon size={16} className='text-green-600' />
                <span>{document}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Terms and Conditions */}
      <Card className='border-dashed'>
        <CardContent className='pt-6'>
          <div className='space-y-4'>
            <div className='flex items-start space-x-3'>
              <input type='checkbox' id='terms' className='mt-1' required />
              <label htmlFor='terms' className='text-sm text-muted-foreground'>
                I confirm that all the information provided is accurate and
                complete. I understand that false information may result in
                account suspension or termination.
              </label>
            </div>

            <div className='flex items-start space-x-3'>
              <input type='checkbox' id='privacy' className='mt-1' required />
              <label
                htmlFor='privacy'
                className='text-sm text-muted-foreground'>
                I agree to the Terms of Service and Privacy Policy, and consent
                to the processing of my data for account management and
                verification purposes.
              </label>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className='bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg'>
        <h4 className='text-sm font-medium mb-2 text-blue-900 dark:text-blue-100'>
          What happens next?
        </h4>
        <ul className='text-xs text-blue-800 dark:text-blue-200 space-y-1'>
          <li>• Your registration will be reviewed within 2-3 business days</li>
          <li>• You'll receive an email confirmation once approved</li>
          <li>
            • Access to your college dashboard will be provided upon approval
          </li>
          <li>
            • Our support team will contact you if additional information is
            needed
          </li>
        </ul>
      </div>
    </div>
  )
}
