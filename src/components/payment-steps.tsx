"use client";
import { CheckCircle, Circle, Clock } from "lucide-react";

interface PaymentStep {
  id: number;
  date: string;
  time: string;
  amount: string;
  bidNumber: string;
  status: 'completed' | 'current' | 'pending';
  label: string;
}

interface PaymentStepsProps {
  steps?: PaymentStep[];
}

export function PaymentSteps({ steps }: PaymentStepsProps) {
  const defaultSteps: PaymentStep[] = [
    {
      id: 1,
      date: '14/09/2022',
      time: '06:00pm',
      amount: '$60,000',
      bidNumber: '379831',
      status: 'completed',
      label: 'Ready For Shipping'
    },
    {
      id: 2,
      date: '21/04/2022',
      time: '',
      amount: '',
      bidNumber: '',
      status: 'current',
      label: 'Ready For Shipping'
    },
    {
      id: 3,
      date: '23/04/2022',
      time: '',
      amount: '',
      bidNumber: '',
      status: 'pending',
      label: 'Delivered'
    }
  ];

  const paymentSteps = steps || defaultSteps;

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <h3 className="text-lg font-semibold text-[#4A5FBF] mb-6">
        Steps of Payment (Just update the component)
      </h3>
      
      <div className="space-y-6">
        {paymentSteps.map((step, index) => (
          <div key={step.id} className="relative">
            {/* Timeline line */}
            {index < paymentSteps.length - 1 && (
              <div className="absolute left-4 top-8 w-0.5 h-16 bg-gray-200"></div>
            )}
            
            <div className="flex items-start gap-4">
              {/* Status Icon */}
              <div className="flex-shrink-0 mt-1">
                {step.status === 'completed' ? (
                  <CheckCircle className="w-8 h-8 text-green-500 fill-current" />
                ) : step.status === 'current' ? (
                  <div className="w-8 h-8 rounded-full border-4 border-green-500 bg-white flex items-center justify-center">
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  </div>
                ) : (
                  <Circle className="w-8 h-8 text-gray-300" />
                )}
              </div>
              
              {/* Step Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-medium text-gray-900">
                      {step.date}
                    </span>
                    {step.time && (
                      <span className="text-sm text-gray-500">
                        {step.time}
                      </span>
                    )}
                    {step.amount && (
                      <span className="text-sm font-semibold text-green-600">
                        {step.amount}
                      </span>
                    )}
                    {step.bidNumber && (
                      <span className="text-sm text-gray-500">
                        {step.bidNumber}
                      </span>
                    )}
                  </div>
                  
                  {step.status === 'current' && (
                    <span className="text-sm text-orange-500 font-medium">
                      In Progress
                    </span>
                  )}
                </div>
                
                <p className="text-sm text-gray-600 mb-2">
                  {step.label}
                </p>
                
                {/* Progress line for current step */}
                {step.status === 'current' && (
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                    <div className="bg-green-500 h-2 rounded-full w-3/4"></div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
        
        {/* Final status */}
        <div className="text-center py-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg">
            <Clock className="w-4 h-4" />
            <span className="text-sm font-medium">Bidding has ended</span>
          </div>
        </div>
      </div>
    </div>
  );
}