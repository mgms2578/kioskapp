import AsyncStorage from '@react-native-async-storage/async-storage';
import { WebService, AdminSettings, VideoPosition } from '../types';

// 키 상수들
const KEYS = {
  WEB_SERVICES: 'web_services',
  ADMIN_SETTINGS: 'admin_settings',
  VIDEO_POSITIONS: 'video_positions',
  CURRENT_VIDEO_INDEX: 'current_video_index',
  LAST_ACTIVITY: 'last_activity',
};

// 기본 웹 서비스들
const DEFAULT_WEB_SERVICES: WebService[] = [
  {
    id: '1',
    name: 'ChatGPT',
    url: 'https://chat.openai.com',
    description: 'AI 대화 서비스',
    icon: 'fas fa-robot',
    backgroundColor: '#10a37f',
    textColor: '#ffffff',
  },
  {
    id: '2',
    name: 'Google',
    url: 'https://www.google.com',
    description: '검색 엔진',
    icon: 'fab fa-google',
    backgroundColor: '#4285f4',
    textColor: '#ffffff',
  },
  {
    id: '3',
    name: 'YouTube',
    url: 'https://www.youtube.com',
    description: '동영상 플랫폼',
    icon: 'fab fa-youtube',
    backgroundColor: '#ff0000',
    textColor: '#ffffff',
  },
  {
    id: '4',
    name: 'Naver',
    url: 'https://www.naver.com',
    description: '포털 사이트',
    icon: 'fas fa-search',
    backgroundColor: '#03c75a',
    textColor: '#ffffff',
  },
];

// 기본 관리자 설정
const DEFAULT_ADMIN_SETTINGS: AdminSettings = {
  password: '1212',
  inactivityTimeout: 30000, // 30초
  maxVideoFileSize: 100 * 1024 * 1024, // 100MB
  allowVideoUpload: true,
};

// 웹 서비스 관련 함수들
export async function getWebServices(): Promise<WebService[]> {
  try {
    const stored = await AsyncStorage.getItem(KEYS.WEB_SERVICES);
    if (stored) {
      return JSON.parse(stored);
    }
    // 기본값 저장 후 반환
    await saveWebServices(DEFAULT_WEB_SERVICES);
    return DEFAULT_WEB_SERVICES;
  } catch (error) {
    console.error('Error getting web services:', error);
    return DEFAULT_WEB_SERVICES;
  }
}

export async function saveWebServices(services: WebService[]): Promise<void> {
  try {
    await AsyncStorage.setItem(KEYS.WEB_SERVICES, JSON.stringify(services));
  } catch (error) {
    console.error('Error saving web services:', error);
  }
}

export async function addWebService(service: WebService): Promise<void> {
  const services = await getWebServices();
  services.push(service);
  await saveWebServices(services);
}

export async function updateWebService(updatedService: WebService): Promise<void> {
  const services = await getWebServices();
  const index = services.findIndex(s => s.id === updatedService.id);
  if (index !== -1) {
    services[index] = updatedService;
    await saveWebServices(services);
  }
}

export async function deleteWebService(id: string): Promise<void> {
  const services = await getWebServices();
  const filtered = services.filter(s => s.id !== id);
  await saveWebServices(filtered);
}

// 관리자 설정 관련 함수들
export async function getAdminSettings(): Promise<AdminSettings> {
  try {
    const stored = await AsyncStorage.getItem(KEYS.ADMIN_SETTINGS);
    if (stored) {
      return JSON.parse(stored);
    }
    // 기본값 저장 후 반환
    await saveAdminSettings(DEFAULT_ADMIN_SETTINGS);
    return DEFAULT_ADMIN_SETTINGS;
  } catch (error) {
    console.error('Error getting admin settings:', error);
    return DEFAULT_ADMIN_SETTINGS;
  }
}

export async function saveAdminSettings(settings: AdminSettings): Promise<void> {
  try {
    await AsyncStorage.setItem(KEYS.ADMIN_SETTINGS, JSON.stringify(settings));
  } catch (error) {
    console.error('Error saving admin settings:', error);
  }
}

// 비디오 재생 위치 관련 함수들
export async function getVideoPositions(): Promise<VideoPosition[]> {
  try {
    const stored = await AsyncStorage.getItem(KEYS.VIDEO_POSITIONS);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error getting video positions:', error);
    return [];
  }
}

export async function saveVideoPosition(videoName: string, position: number): Promise<void> {
  try {
    const positions = await getVideoPositions();
    const existing = positions.find(p => p.videoName === videoName);
    
    if (existing) {
      existing.position = position;
      existing.updatedAt = new Date().toISOString();
    } else {
      positions.push({
        videoName,
        position,
        updatedAt: new Date().toISOString(),
      });
    }
    
    await AsyncStorage.setItem(KEYS.VIDEO_POSITIONS, JSON.stringify(positions));
  } catch (error) {
    console.error('Error saving video position:', error);
  }
}

export async function getVideoPosition(videoName: string): Promise<number> {
  try {
    const positions = await getVideoPositions();
    const found = positions.find(p => p.videoName === videoName);
    return found ? found.position : 0;
  } catch (error) {
    console.error('Error getting video position:', error);
    return 0;
  }
}

// 기타 유틸리티 함수들
export async function getCurrentVideoIndex(): Promise<number> {
  try {
    const stored = await AsyncStorage.getItem(KEYS.CURRENT_VIDEO_INDEX);
    return stored ? parseInt(stored, 10) : 0;
  } catch (error) {
    console.error('Error getting current video index:', error);
    return 0;
  }
}

export async function setCurrentVideoIndex(index: number): Promise<void> {
  try {
    await AsyncStorage.setItem(KEYS.CURRENT_VIDEO_INDEX, index.toString());
  } catch (error) {
    console.error('Error setting current video index:', error);
  }
}

export async function updateLastActivity(): Promise<void> {
  try {
    await AsyncStorage.setItem(KEYS.LAST_ACTIVITY, Date.now().toString());
  } catch (error) {
    console.error('Error updating last activity:', error);
  }
}

export async function getLastActivity(): Promise<number> {
  try {
    const stored = await AsyncStorage.getItem(KEYS.LAST_ACTIVITY);
    return stored ? parseInt(stored, 10) : Date.now();
  } catch (error) {
    console.error('Error getting last activity:', error);
    return Date.now();
  }
}