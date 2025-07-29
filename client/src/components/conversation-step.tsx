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
}

export function ConversationStep({ 
  stepData, 
  onNextStep, 
  onSelectAnswer
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
          {stepData.options.map((option: string, index: number) => {
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
          })}
        </div>
      )}
      {stepData.type === 'final' && (
        <>
          {/* Marker buttons */}
          <div className="flex flex-col gap-3">
            {stepData.markers && (() => {
              const markers = stepData.markers;
              const rows = [];
              for (let i = 0; i < markers.length; i += 2) {
                const rowMarkers = markers.slice(i, i + 2);
                rows.push(
                  <div key={i} className="flex flex-wrap gap-3 justify-center text-left text-[#fae0bc] font-normal">
                    {rowMarkers.map((marker: string, rowIndex: number) => (
                      <Button
                        key={i + rowIndex}
                        className="option-button text-gray-800 px-4 py-3 font-medium shadow-sm hover:scale-105 transition-all duration-200 flex-1 min-w-0 max-w-sm text-sm"
                        disabled
                      >
                        {i + rowIndex + 1}. {marker}
                      </Button>
                    ))}
                  </div>
                );
              }
              return rows;
            })()}
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
          
          <Card className="mt-4">
            <CardContent className="p-6">
              <div className="text-center space-y-4">
                <div className="flex justify-center">
                  <FileText className="w-16 h-16 text-blue-500" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-blue-700 mb-2">학습 완료!</h3>
                  <p className="text-gray-600">
                    AMC GI 상부 F2용 PBL 01 과정을 모두 완료하셨습니다.<br/>
                    과제 제출은 별도로 진행해 주세요.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
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


