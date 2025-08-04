import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useSupabaseImage } from "@/hooks/use-supabase-image";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, FileText } from "lucide-react";

interface ConversationStepProps {
  stepData: any;
  onNextStep: (step: number) => void;
  onSelectAnswer: (stepNumber: number, selectedIndex: number) => void;
  selectedAnswer?: number;
}

export function ConversationStep({ 
  stepData, 
  onNextStep, 
  onSelectAnswer,
  selectedAnswer
}: ConversationStepProps) {
  if (!stepData) return null;

  return (
    <div className="message-group mb-6">
      {/* Image Display */}
      {stepData.type === 'image' && (
        <ImageDisplay 
          bucketName="pbl01" 
          fileName={stepData.imageSrc} 
          alt={stepData.imageAlt}
        />
      )}
      {stepData.type === 'multipleImages' && stepData.images && (
        <>
          {stepData.images.map((img: any, index: number) => (
            <ImageDisplay 
              key={index}
              bucketName="pbl01" 
              fileName={img.fileName} 
              alt={img.alt}
            />
          ))}
        </>
      )}
      {/* Message Content */}
      {stepData.content && (
        <div className="conversation-message rounded-lg p-4 mb-4 shadow-sm">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 material-blue rounded-full flex items-center justify-center flex-shrink-0">
              <FileText className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1">
              <p 
                className="text-gray-800 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: stepData.content }}
              />
            </div>
          </div>
        </div>
      )}
      {/* Buttons based on type */}
      {(stepData.type === 'message' || stepData.type === 'image') && (
        <div className="flex justify-center">
          <Button 
            className="option-button text-gray-800 px-6 py-3 font-medium shadow-sm hover:scale-105 transition-all duration-200"
            onClick={() => onNextStep(stepData.step + 1)}
          >
            {stepData.buttonText}
          </Button>
        </div>
      )}
      {(stepData.type === 'multipleChoice' || stepData.type === 'multipleImages') && (
        <div className="flex flex-col gap-3">
          {selectedAnswer !== undefined ? (
            // 선택된 답변이 있으면 해당 버튼만 오른쪽 정렬로 표시
            <div className="flex justify-end">
              <Button
                className="option-button text-gray-800 px-4 py-3 font-medium shadow-sm hover:scale-105 transition-all duration-200 flex-1 min-w-0 max-w-sm text-sm"
              >
                {selectedAnswer + 1}. {stepData.options[selectedAnswer]}
              </Button>
            </div>
          ) : (
            // 선택된 답변이 없으면 모든 버튼 표시
            stepData.options.map((option: string, index: number) => {
              const isLongText = option.length > 30;
              const buttonsPerRow = isLongText ? 2 : 4;
              
              if (index % buttonsPerRow === 0) {
                const rowOptions = stepData.options.slice(index, index + buttonsPerRow);
                return (
                  <div key={index} className="flex flex-wrap gap-3 justify-center">
                    {rowOptions.map((rowOption: string, rowIndex: number) => (
                      <Button
                        key={index + rowIndex}
                        className="option-button text-gray-800 px-4 py-3 font-medium shadow-sm hover:scale-105 transition-all duration-200 flex-1 min-w-0 max-w-sm text-sm"
                        onClick={() => onSelectAnswer(stepData.step, index + rowIndex)}
                      >
                        {index + rowIndex + 1}. {rowOption}
                      </Button>
                    ))}
                  </div>
                );
              }
              return null;
            })
          )}
        </div>
      )}
      {stepData.type === 'final' && (
        <>
          {/* Marker buttons in single row */}
          <div className="flex flex-wrap gap-3 justify-center mb-4">
            {stepData.markers?.map((marker: string, index: number) => (
              <Button
                key={`marker-${index}`}
                className="option-button text-gray-800 px-4 py-3 font-medium shadow-sm hover:scale-105 transition-all duration-200 text-sm"
              >
                {index + 1}. {marker}
              </Button>
            ))}
          </div>

          {/* Final content message */}
          <div className="conversation-message rounded-lg p-4 mb-4 shadow-sm">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 material-blue rounded-full flex items-center justify-center flex-shrink-0">
                <FileText className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-gray-800 leading-relaxed">
                  {stepData.finalContent}
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-center">
            <Button 
              className="option-button text-gray-800 px-6 py-3 font-medium shadow-sm hover:scale-105 transition-all duration-200"
              onClick={() => onNextStep(stepData.step + 1)}
            >
              {stepData.buttonText}
            </Button>
          </div>
        </>
      )}
      {stepData.type === 'final_assignment' && (
        <>
          <ImageDisplay 
            bucketName="pbl01" 
            fileName="IHC report.png" 
            alt="IHC 리포트"
          />
          
          <div className="conversation-message rounded-lg p-4 mb-4 shadow-sm">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 material-blue rounded-full flex items-center justify-center flex-shrink-0">
                <FileText className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-gray-800 leading-relaxed">
                  마지막으로 과제입니다. 제시되는 실제 환자의 IHC의 결과를 보여주는 병리 report에서 그 5가지 항목의 유무를 해석하고, 이 결과에 따라 사용되는 흔한 chemo regimen 한 가지를 약자로 기술하고, 이 치료를 받은 후 기대할 수 있는 기대 여명을 적어 PBS_amc_F2_01_이름.docx 파일로 제출해 주세요.<br/><br/>수고하셨습니다.
                </p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function ImageDisplay({ bucketName, fileName, alt }: { 
  bucketName: string; 
  fileName: string; 
  alt: string; 
}) {
  const { imageUrl, loading, error } = useSupabaseImage(bucketName, fileName);

  if (loading) {
    return (
      <Card className="mb-4">
        <CardContent className="p-4">
          <Skeleton className="w-full h-64 rounded-lg" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Alert className="mb-4">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          이미지를 불러올 수 없습니다: {error}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Card className="mb-4">
      <CardContent className="p-4">
        <img 
          src={imageUrl} 
          alt={alt} 
          className="rounded-lg shadow-md max-w-full h-auto" 
        />
      </CardContent>
    </Card>
  );
}


