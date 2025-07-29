import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, FileText, Calendar, User } from 'lucide-react';
import { Link } from 'wouter';

interface Submission {
  timestamp: string;
  student: string;
  originalName: string;
  filename: string;
  size: number;
}

export default function Submissions() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    try {
      const response = await fetch('/api/submissions');
      if (response.ok) {
        const data = await response.json();
        setSubmissions(data.submissions);
      }
    } catch (error) {
      console.error('Error fetching submissions:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('ko-KR');
  };

  const formatFileSize = (bytes: number) => {
    return (bytes / 1024).toFixed(2) + ' KB';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="material-blue text-white py-6 shadow-lg">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold mb-2">
                과제 제출 현황
              </h1>
              <p className="text-lg opacity-90">
                AMC GI 상부 F2용 PBL 01 - 담당자: jhlee409@gmail.com
              </p>
            </div>
            <Link href="/">
              <Button variant="outline" className="bg-white text-blue-600 hover:bg-gray-100">
                학습 페이지로 돌아가기
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 max-w-6xl">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              제출된 과제 목록 ({submissions.length}건)
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">
                <p className="text-gray-500">로딩 중...</p>
              </div>
            ) : submissions.length === 0 ? (
              <div className="text-center py-8">
                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">아직 제출된 과제가 없습니다.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {submissions.map((submission, index) => (
                  <Card key={index} className="border-l-4 border-l-blue-500">
                    <CardContent className="p-4">
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-blue-600" />
                          <span className="font-medium">{submission.student}</span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-gray-500" />
                          <span className="text-sm text-gray-600">
                            {formatDate(submission.timestamp)}
                          </span>
                        </div>
                        
                        <div>
                          <p className="text-sm font-medium">{submission.originalName}</p>
                          <p className="text-xs text-gray-500">
                            {formatFileSize(submission.size)}
                          </p>
                        </div>
                        
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              // In a real application, you would implement file download
                              window.open(`/uploads/${submission.filename}`, '_blank');
                            }}
                            className="flex items-center gap-1"
                          >
                            <Download className="w-4 h-4" />
                            다운로드
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>알림 방법</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm text-gray-600">
              <p>현재 과제 제출 알림은 다음 방법으로 제공됩니다:</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li><strong>서버 콘솔 로그:</strong> 실시간으로 제출 정보가 콘솔에 출력됩니다</li>
                <li><strong>제출 로그 파일:</strong> submissions.log 파일에 모든 제출 기록이 저장됩니다</li>
                <li><strong>이 대시보드:</strong> /submissions 페이지에서 제출 현황을 확인할 수 있습니다</li>
              </ul>
              <p className="mt-4 p-3 bg-blue-50 rounded-lg">
                💡 <strong>팁:</strong> 이메일 알림을 원하시면 SendGrid API 키를 설정하여 
                jhlee409@gmail.com으로 자동 알림을 받을 수 있습니다.
              </p>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}