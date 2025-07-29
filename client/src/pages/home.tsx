import { useState, useEffect } from 'react';
import { ConversationStep } from '@/components/conversation-step';
import { ProgressIndicator } from '@/components/progress-indicator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

const conversationSteps = {
  1: {
    step: 1,
    type: 'message',
    content: '로딩이 완료 되었습니다. 환자에 대해 말씀 드릴까요?',
    buttonText: '예'
  },
  2: {
    step: 2,
    type: 'message',
    content: '환자에 대해 설명드리겠습니다.<br><br>29세 남자로, 지속되는 심와부 통증으로 타병원에 방문하였고, 상부 위장관 내시경에서 이상 소견이 발견되어 본원으로 전원 되었습니다. 심와부의 중등도 통증 외에 다른 증상은 없습니다.<br><br>EGD image를 보여드릴까요?',
    buttonText: '예'
  },
  3: {
    step: 3,
    type: 'image',
    imageSrc: 'EGD.png',
    imageAlt: 'EGD 내시경 이미지',
    content: '당연히 EGD 검사 중에 이런 병변이 관찰되었다면 조직생검을 시행합니다. 조직생검 결과를 보여드릴까요?',
    buttonText: '예'
  },
  4: {
    step: 4,
    type: 'image',
    imageSrc: 'Biopsy report.png',
    imageAlt: '조직생검 리포트',
    content: '다음으로 이 병변은 조기위암보다는 진행성 위암으로 판단되므로 위암의 stage를 알기 위해 복부 CT 뿐 아니라, 전신 PET 검사도 시행해야 합니다. 두 검사의 이미지와 결과를 보여드릴까요?',
    buttonText: '예'
  },
  5: {
    step: 5,
    type: 'multipleImages',
    images: [
      { fileName: 'Abdominal CT.png', alt: '복부 CT 이미지' },
      { fileName: 'PET.png', alt: 'PET 스캔 이미지' }
    ],
    content: '이 환자의 위선암의 clinical stage는 무엇입니까?',
    options: ['stage I', 'stage II', 'stage III', 'stage IV'],
    correctAnswer: 3
  },
  6: {
    step: 6,
    type: 'multipleChoice',
    content: '예 맞습니다. 그럼 이 환자에서 선택할 수 있는 치료 전략은 무엇일까요?',
    options: [
      'surgical radical dissection for curative intent',
      'palliative surgery',
      'neoadjuvant chemoTx. and surgery',
      'palliative chemoTx'
    ],
    correctAnswer: 3
  },
  7: {
    step: 7,
    type: 'multipleChoice',
    content: '예 맞습니다. 이 환자의 경우 원칙적으로, 원격전이에 해당하는 paraaortic lymph node로의 전이가 관찰되므로 palliative chemotherapy가 표준 치료 전략입니다. 그런데, 이 환자에서 palliative chemotherapy 후 추적 검사에서 paraaortic node 및 regional lymph node들에 관해가 나타나, R0 resection을 목적으로 surgical resection을 시행하였습니다. 그럼 이와 같이 palliative chemo후 원격전이에 완전 관해가 되어, R0 resection을 목적으로 surgical resection 경우의 수술을 일컫는 용어는 무엇일까요?',
    options: ['R0 resection', 'conversion surgery', 'radical surgery', 'palliative surgery'],
    correctAnswer: 1
  },
  8: {
    step: 8,
    type: 'final',
    content: '예 맞습니다. 그럼 이 환자에서 효과적인 표적항암제를 찾기 위해 내시경 조직 생검에 대해 추가로 요청할 면역화학염색 검사 다섯 가지는 다음과 같습니다.',
    markers: ['c-ERB B2', 'PD-L1', 'EBV', 'MSI', 'Claudin 18'],
    finalContent: '2024년 현재 우리나라에서 보험 적용을 받을 수 있는 위암 4기 표적치료 항암제는 HER2 양성일 경우 trastuzumab 혹은 herceptin, PD-L1 28-8의 CPS 값이 5이상일 경우 nivolumab 이렇게 두 가지입니다. 그럼 이 환자의 IHC report를 보여드릴까요?',
    buttonText: '예'
  },
  9: {
    step: 9,
    type: 'final_assignment',
    content: '마지막으로 과제입니다. 제시되는 실제 환자의 IHC의 결과를 보여주는 병리 report에서 그 5가지 항목의 유무를 해석하고, 이 결과에 따라 사용되는 흔한 chemo regimen 한 가지를 약자로 기술하고, 이 치료를 받은 후 기대할 수 있는 기대 여명을 적어 PBS_amc_F2_01_이름.docx 파일로 제출해 주세요.<br><br>수고하셨습니다.'
  }
};

export default function Home() {
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const totalSteps = Object.keys(conversationSteps).length;

  useEffect(() => {
    // Auto-scroll to bottom when new content is added
    const timer = setTimeout(() => {
      window.scrollTo({
        top: document.body.scrollHeight,
        behavior: 'smooth'
      });
    }, 100);

    return () => clearTimeout(timer);
  }, [completedSteps, errorMessage]);

  const handleNextStep = (step: number) => {
    if (step <= totalSteps) {
      setCurrentStep(step);
      setCompletedSteps(prev => [...prev, currentStep]);
      setErrorMessage(null);
    }
  };

  const handleSelectAnswer = (stepNumber: number, selectedIndex: number) => {
    const stepData = conversationSteps[stepNumber as keyof typeof conversationSteps];
    
    if ('correctAnswer' in stepData && selectedIndex === stepData.correctAnswer) {
      handleNextStep(stepNumber + 1);
    } else {
      setErrorMessage('기대한 대답이 아닙니다. 다시 생각해보고 대답해 주세요.');
    }
  };



  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="material-blue text-white py-6 shadow-lg">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-2xl md:text-3xl font-bold mb-2">
            AMC GI 상부 F2용 PBL 01
          </h1>
          <p className="text-lg opacity-90">
            stage IV AGC 환자의 검사와 치료
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6 max-w-4xl">
        <ProgressIndicator currentStep={currentStep} totalSteps={totalSteps} />

        {/* Conversation Container */}
        <div className="conversation-container">
          {/* Show completed steps */}
          {completedSteps.map(step => (
            <ConversationStep
              key={`completed-${step}`}
              stepData={conversationSteps[step as keyof typeof conversationSteps]}
              onNextStep={handleNextStep}
              onSelectAnswer={handleSelectAnswer}
            />
          ))}

          {/* Show current step */}
          <ConversationStep
            key={`current-${currentStep}`}
            stepData={conversationSteps[currentStep as keyof typeof conversationSteps]}
            onNextStep={handleNextStep}
            onSelectAnswer={handleSelectAnswer}
          />

          {/* Show error message if any */}
          {errorMessage && (
            <Alert className="mb-6 border-red-200 bg-red-50">
              <AlertCircle className="h-4 w-4 text-red-500" />
              <AlertDescription className="text-red-800">
                {errorMessage}
              </AlertDescription>
            </Alert>
          )}
        </div>
      </main>
    </div>
  );
}
