'use client'

import { useState } from 'react'

import { CheckIcon, ChevronLeftIcon, ChevronRightIcon } from 'lucide-react'
import { toast } from 'sonner'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useAppForm } from '@/hooks/use-form'

// Step components
import { CollegeBasicInfo } from './steps/college-basic-info'
import { CollegeDetails } from './steps/college-details'
import { ContactDetails } from './steps/contact-details'
import { ReviewSubmit } from './steps/review-submit'
import { VerificationDocuments } from './steps/verification-documents'

// Form validation schema
const collegeRegistrationSchema = z.object({
  // College Basic Information
  collegeName: z.string().min(1, 'College name is required'),
  collegeType: z.string().min(1, 'College type is required'),
  location: z.string().min(1, 'Location is required'),

  // Contact Details
  adminName: z.string().min(1, 'Admin name is required'),
  adminPhone: z.string().min(1, 'Admin phone is required'),
  adminEmail: z.string().email('Please enter a valid email address'),

  // College Details
  accreditation: z.string().min(1, 'Accreditation is required'),
  departments: z
    .array(z.string())
    .min(1, 'At least one department is required'),
  studentCount: z.number().min(1, 'Student count must be at least 1'),

  // Verification Documents
  documents: z.array(z.string()).min(1, 'At least one document is required'),
})

type CollegeRegistrationData = z.infer<typeof collegeRegistrationSchema>

const steps = [
  {
    id: 'basic-info',
    title: 'College Basic Information',
    description: 'Name, type, location',
    component: CollegeBasicInfo,
  },
  {
    id: 'contact-details',
    title: 'Contact Details',
    description: 'Admin contact, phone, email',
    component: ContactDetails,
  },
  {
    id: 'college-details',
    title: 'College Details',
    description: 'Accreditation, departments, student count',
    component: CollegeDetails,
  },
  {
    id: 'verification-documents',
    title: 'Verification Documents',
    description: 'Upload required documents',
    component: VerificationDocuments,
  },
  {
    id: 'review-submit',
    title: 'Review & Submit',
    description: 'Final review before submission',
    component: ReviewSubmit,
  },
]

export default function OnboardingForm() {
  const [currentStep, setCurrentStep] = useState(0)
  const [completedSteps, setCompletedSteps] = useState<number[]>([])

  const form = useAppForm({
    defaultValues: {
      collegeName: '',
      collegeType: '',
      location: '',
      adminName: '',
      adminPhone: '',
      adminEmail: '',
      accreditation: '',
      departments: [],
      studentCount: 0,
      documents: [],
    } as CollegeRegistrationData,
    validators: {
      onSubmit: collegeRegistrationSchema,
    },
    onSubmit: async ({ value }) => {
      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 2000))
        toast.success('College registration submitted successfully!')
        console.log('Form data:', value)
      } catch (error) {
        toast.error('Failed to submit registration. Please try again.')
      }
    },
  })

  // Step validation schemas
  const stepValidationSchemas = [
    // Step 1: College Basic Information
    z.object({
      collegeName: z.string().min(1, 'College name is required'),
      collegeType: z.string().min(1, 'College type is required'),
      location: z.string().min(1, 'Location is required'),
    }),
    // Step 2: Contact Details
    z.object({
      adminName: z.string().min(1, 'Admin name is required'),
      adminPhone: z.string().min(1, 'Admin phone is required'),
      adminEmail: z.string().email('Please enter a valid email address'),
    }),
    // Step 3: College Details
    z.object({
      accreditation: z.string().min(1, 'Accreditation is required'),
      departments: z
        .array(z.string())
        .min(1, 'At least one department is required'),
      studentCount: z.number().min(1, 'Student count must be at least 1'),
    }),
    // Step 4: Verification Documents
    z.object({
      documents: z
        .array(z.string())
        .min(1, 'At least one document is required'),
    }),
    // Step 5: Review & Submit (no validation needed)
    z.object({}),
  ]

  const validateCurrentStep = async () => {
    const currentSchema = stepValidationSchemas[currentStep]
    const formData = form.state.values

    try {
      await currentSchema.parseAsync(formData)
      return true
    } catch (error) {
      if (error instanceof z.ZodError) {
        // Set field errors directly in the form instead of showing toasts
        error.issues.forEach((err: z.ZodIssue) => {
          if (err.path.length > 0) {
            const fieldName = err.path[0] as string
            form.setFieldMeta(fieldName, 'error', err.message)
          }
        })
      }
      return false
    }
  }

  const nextStep = async () => {
    if (currentStep < steps.length - 1) {
      const isValid = await validateCurrentStep()
      if (isValid) {
        setCurrentStep(currentStep + 1)
        if (!completedSteps.includes(currentStep)) {
          setCompletedSteps([...completedSteps, currentStep])
        }
      }
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const goToStep = async (stepIndex: number) => {
    if (stepIndex <= completedSteps.length || stepIndex === 0) {
      setCurrentStep(stepIndex)
    }
  }

  const isStepCompleted = (stepIndex: number) =>
    completedSteps.includes(stepIndex)
  const isStepActive = (stepIndex: number) => stepIndex === currentStep
  const canGoToStep = (stepIndex: number) =>
    stepIndex <= completedSteps.length || stepIndex === 0

  const CurrentStepComponent = steps[currentStep].component

  return (
    <div className='min-h-screen bg-background flex items-center justify-center p-4'>
      <div className='w-full max-w-4xl'>
        <Card className='rounded-xl shadow-lg border-0 bg-white dark:bg-gray-900'>
          <CardContent className='p-8'>
            {/* Progress Indicator */}
            <div className='mb-8'>
              <div className='relative flex items-center justify-between mb-4'>
                {/* Progress Line Background */}
                <div className='absolute top-4 left-4 right-4 h-0.5 bg-gray-300 dark:bg-gray-600'></div>

                {/* Progress Line Fill */}
                <div
                  className='absolute top-4 left-4 h-0.5 bg-blue-600 transition-all duration-500'
                  style={{
                    width: `${(completedSteps.length / (steps.length - 1)) * 100}%`,
                  }}></div>

                {steps.map((step, index) => (
                  <div
                    key={step.id}
                    className='flex flex-col items-center flex-1 relative z-10'>
                    {/* Step Circle */}
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300 ${
                        isStepCompleted(index)
                          ? 'bg-blue-600 text-white'
                          : isStepActive(index)
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-300 text-gray-600 dark:bg-gray-600 dark:text-gray-400'
                      }`}>
                      {isStepCompleted(index) ? (
                        <CheckIcon size={16} />
                      ) : (
                        index + 1
                      )}
                    </div>
                    {/* Step Label */}
                    <div className='mt-3 text-center'>
                      <p
                        className={`text-xs font-medium transition-colors duration-300 ${
                          isStepCompleted(index) || isStepActive(index)
                            ? 'text-blue-600'
                            : 'text-gray-500 dark:text-gray-400'
                        }`}>
                        {step.title}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Form Content */}
            <div className='space-y-6'>
              <div className='text-center mb-8'>
                <h1 className='text-2xl font-bold text-gray-900 dark:text-white mb-2'>
                  {steps[currentStep].title}
                </h1>
                <p className='text-gray-600 dark:text-gray-400'>
                  {steps[currentStep].description}
                </p>
              </div>

              <form.AppForm>
                <div className='min-h-[400px] transition-all duration-300 ease-in-out'>
                  <CurrentStepComponent form={form} />
                </div>
              </form.AppForm>

              {/* Navigation Buttons */}
              <div className='flex items-center justify-between pt-8 border-t border-gray-200 dark:border-gray-700'>
                <Button
                  type='button'
                  variant='outline'
                  onClick={prevStep}
                  disabled={currentStep === 0}
                  className='flex items-center space-x-2 px-6 py-2 rounded-lg transition-all duration-200 hover:scale-105'>
                  <ChevronLeftIcon size={16} />
                  <span>Previous</span>
                </Button>

                <div className='flex space-x-2'>
                  {currentStep === steps.length - 1 ? (
                    <form.Subscribe
                      selector={(state) => [
                        state.canSubmit,
                        state.isSubmitting,
                      ]}>
                      {([canSubmit, isSubmitting]) => (
                        <Button
                          type='button'
                          onClick={() => form.handleSubmit()}
                          disabled={!canSubmit || isSubmitting}
                          className='flex items-center space-x-2 px-6 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 transition-all duration-200 hover:scale-105'>
                          {isSubmitting ? (
                            <>
                              <div className='w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin' />
                              <span>Submitting...</span>
                            </>
                          ) : (
                            <>
                              <span>Submit Registration</span>
                              <CheckIcon size={16} />
                            </>
                          )}
                        </Button>
                      )}
                    </form.Subscribe>
                  ) : (
                    <Button
                      type='button'
                      onClick={nextStep}
                      className='flex items-center space-x-2 px-6 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 transition-all duration-200 hover:scale-105'>
                      <span>Next</span>
                      <ChevronRightIcon size={16} />
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
