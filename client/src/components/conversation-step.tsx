import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useSupabaseImage } from "@/hooks/use-supabase-image";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, FileText, Upload } from "lucide-react";

interface ConversationStepProps {
  stepData: any;
  onNextStep: (step: number) => void;
  onSelectAnswer: (stepNumber: number, selectedIndex: number) => void;
  onFileSubmit?: (file: File) => void;
}

export function ConversationStep({ 
  stepData, 
  onNextStep, 
  onSelectAnswer,
  onFileSubmit 
}: ConversationStepProps) {
  if (!stepData) return null;

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && onFileSubmit) {
      onFileSubmit(file);
    }
  };

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
          <div className="flex flex-wrap gap-3 justify-center mb-4">
            {stepData.markers?.map((marker: string, index: number) => (
              <Button
                key={index}
                className="option-button text-gray-800 px-4 py-2 font-medium shadow-sm text-sm"
                disabled
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

      {stepData.type === 'assignment' && (
        <>
          <ImageDisplay 
            bucketName="pbl01" 
            fileName="IHC report.png" 
            alt="IHC 리포트"
          />
          
          <Card className="mt-4">
            <CardContent className="p-4">
              <div className="flex items-center gap-3 mb-3">
                <Upload className="w-5 h-5 text-blue-600" />
                <h3 className="text-lg font-semibold text-gray-800">과제 제출</h3>
              </div>
              <div className="space-y-3">
                <input 
                  type="file" 
                  accept=".docx" 
                  onChange={handleFileChange}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-600 file:text-white hover:file:bg-blue-700" 
                />
                <Button className="material-blue text-white w-full">
                  과제 제출하기
                </Button>
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
