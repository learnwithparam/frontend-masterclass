/**
 * Multi-Step Progress Indicator
 *
 * Shows which step the user is on and what's coming next.
 * Uses aria-current="step" for accessibility.
 */

interface FormProgressProps {
  currentStep: number;
  steps: string[];
}

export function FormProgress({ currentStep, steps }: FormProgressProps) {
  return (
    <nav aria-label="Form progress" className="mb-8">
      <ol className="flex items-center gap-2">
        {steps.map((step, index) => {
          const isActive = index === currentStep;
          const isComplete = index < currentStep;

          return (
            <li key={step} className="flex items-center gap-2">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  isComplete
                    ? 'bg-green-600 text-white'
                    : isActive
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-500'
                }`}
                aria-current={isActive ? 'step' : undefined}
              >
                {isComplete ? '\u2713' : index + 1}
              </div>
              <span className={`text-sm ${isActive ? 'font-medium text-gray-900' : 'text-gray-500'}`}>
                {step}
              </span>
              {index < steps.length - 1 && (
                <div className={`w-8 h-0.5 ${isComplete ? 'bg-green-600' : 'bg-gray-200'}`} />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
