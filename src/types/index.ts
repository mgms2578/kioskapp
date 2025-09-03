// Web Service 타입 정의
export interface WebService {
  id: string;
  name: string;
  url: string;
  description: string;
  icon: string;
  backgroundColor: string;
  textColor: string;
}

// 관리자 설정 타입
export interface AdminSettings {
  password: string;
  inactivityTimeout: number;
  maxVideoFileSize: number;
  allowVideoUpload: boolean;
}

// 비디오 파일 타입
export interface VideoFile {
  name: string;
  uri: string;
  size: number;
  type: string;
  uploadedAt: string;
}

// 비디오 재생 위치 타입
export interface VideoPosition {
  videoName: string;
  position: number;
  updatedAt: string;
}

// 앱 상태 타입
export interface AppState {
  currentService: WebService | null;
  isScreensaver: boolean;
  isAdminMode: boolean;
}