import type { Express } from "express";
import { createServer, type Server } from "http";
import multer from "multer";
import path from "path";

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  fileFilter: (req, file, cb) => {
    // Only allow .docx files
    if (path.extname(file.originalname).toLowerCase() === '.docx') {
      cb(null, true);
    } else {
      cb(new Error('Only .docx files are allowed'));
    }
  },
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

export async function registerRoutes(app: Express): Promise<Server> {
  // File upload endpoint for assignment submission
  app.post("/api/submit-assignment", upload.single('assignment'), (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
      }

      const submissionData = {
        originalName: req.file.originalname,
        filename: req.file.filename,
        path: req.file.path,
        size: req.file.size,
        timestamp: new Date().toISOString(),
        studentInfo: req.body.studentName || 'Unknown Student',
        submissionEmail: 'jhlee409@gmail.com'
      };

      // Log file submission with detailed information
      console.log('=== 과제 제출 알림 ===');
      console.log(`제출 시간: ${submissionData.timestamp}`);
      console.log(`학생 정보: ${submissionData.studentInfo}`);
      console.log(`파일명: ${submissionData.originalName}`);
      console.log(`파일 크기: ${(submissionData.size / 1024).toFixed(2)} KB`);
      console.log(`저장 위치: ${submissionData.path}`);
      console.log(`담당자 이메일: ${submissionData.submissionEmail}`);
      console.log('================');

      // Save submission info to a log file for easy tracking
      const fs = require('fs');
      const logEntry = `${submissionData.timestamp},${submissionData.studentInfo},${submissionData.originalName},${submissionData.filename},${submissionData.size}\n`;
      fs.appendFileSync('submissions.log', logEntry);

      res.json({ 
        message: '과제가 성공적으로 제출되었습니다. 담당자에게 알림이 전송되었습니다.',
        filename: req.file.filename,
        submissionId: Date.now().toString(),
        instructorEmail: submissionData.submissionEmail
      });
    } catch (error) {
      console.error('File upload error:', error);
      res.status(500).json({ message: 'File upload failed' });
    }
  });

  // Get submission log for instructor
  app.get("/api/submissions", (req, res) => {
    try {
      const fs = require('fs');
      if (fs.existsSync('submissions.log')) {
        const logContent = fs.readFileSync('submissions.log', 'utf8');
        const submissions = logContent.trim().split('\n').filter((line: string) => line).map((line: string) => {
          const [timestamp, student, originalName, filename, size] = line.split(',');
          return { timestamp, student, originalName, filename, size: parseInt(size) };
        });
        res.json({ submissions });
      } else {
        res.json({ submissions: [] });
      }
    } catch (error) {
      console.error('Error reading submissions:', error);
      res.status(500).json({ message: 'Failed to read submissions' });
    }
  });

  // Health check endpoint
  app.get("/api/health", (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  const httpServer = createServer(app);
  return httpServer;
}
