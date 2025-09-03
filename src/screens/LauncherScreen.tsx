import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ScreenOrientation from 'expo-screen-orientation';
import { useKeepAwake } from 'expo-keep-awake';

import ServiceGrid from '../components/ServiceGrid';
import WebViewScreen from '../components/WebViewScreen';
import { WebService } from '../types';
import { getWebServices, updateLastActivity } from '../lib/storage';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export default function LauncherScreen() {
  const [webServices, setWebServices] = useState<WebService[]>([]);
  const [currentService, setCurrentService] = useState<WebService | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [adminTouchCount, setAdminTouchCount] = useState(0);

  // 화면 항상 켜두기
  useKeepAwake();

  useEffect(() => {
    // 화면 회전 허용
    ScreenOrientation.unlockAsync();
    
    // 웹 서비스 로드
    loadWebServices();
    
    // 시계 업데이트
    const timeInterval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => {
      clearInterval(timeInterval);
    };
  }, []);

  const loadWebServices = async () => {
    try {
      const services = await getWebServices();
      setWebServices(services);
    } catch (error) {
      console.error('Error loading web services:', error);
    }
  };

  const handleServiceClick = (service: WebService) => {
    setCurrentService(service);
    updateLastActivity();
  };

  const handleCloseService = () => {
    setCurrentService(null);
    updateLastActivity();
  };

  // 관리자 모드 진입 (우측 하단 코너 5회 터치)
  const handleAdminTouch = () => {
    const newCount = adminTouchCount + 1;
    setAdminTouchCount(newCount);
    
    if (newCount >= 5) {
      setAdminTouchCount(0);
      // TODO: 관리자 모드 구현
      console.log('Admin mode triggered');
    }
    
    // 3초 후 카운트 리셋
    setTimeout(() => {
      setAdminTouchCount(0);
    }, 3000);
  };

  // 폰트 크기 계산
  const isLandscape = screenWidth > screenHeight;
  const baseFontScale = Math.min(screenWidth, screenHeight) / 1080;
  
  const getHeaderTitleFontSize = () => Math.max(48 * baseFontScale, 36);
  const getHeaderSubtitleFontSize = () => Math.max(24 * baseFontScale, 18);
  const getTimeFontSize = () => Math.max(36 * baseFontScale, 28);
  const getDateFontSize = () => Math.max(20 * baseFontScale, 16);

  // 웹뷰 화면이 열려있으면 표시
  if (currentService) {
    return (
      <WebViewScreen
        service={currentService}
        onClose={handleCloseService}
      />
    );
  }

  // 메인 런처 화면
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar hidden={true} />
      
      <View style={styles.content}>
        {/* 헤더 */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text
              style={[
                styles.title,
                { fontSize: getHeaderTitleFontSize() }
              ]}
            >
              AI 체험 프로그램
            </Text>
            <Text
              style={[
                styles.subtitle,
                { fontSize: getHeaderSubtitleFontSize() }
              ]}
            >
              원하는 서비스를 선택해주세요
            </Text>
          </View>
          
          <View style={styles.headerRight}>
            <Text
              style={[
                styles.timeText,
                { fontSize: getTimeFontSize() }
              ]}
            >
              {currentTime.toLocaleTimeString('ko-KR', {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </Text>
            <Text
              style={[
                styles.dateText,
                { fontSize: getDateFontSize() }
              ]}
            >
              {currentTime.toLocaleDateString('ko-KR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </Text>
          </View>
        </View>

        {/* 서비스 그리드 */}
        <View style={styles.gridContainer}>
          <ServiceGrid
            webServices={webServices}
            onServiceClick={handleServiceClick}
          />
        </View>

        {/* 관리자 모드 숨김 버튼 (우측 하단) */}
        <TouchableOpacity
          style={styles.adminTouchArea}
          onPress={handleAdminTouch}
          activeOpacity={1}
        >
          {adminTouchCount > 0 && (
            <View style={styles.adminIndicator}>
              <Text style={styles.adminIndicatorText}>
                {adminTouchCount}/5
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  content: {
    flex: 1,
    padding: 32,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 32,
  },
  headerLeft: {
    flex: 1,
  },
  headerRight: {
    alignItems: 'flex-end',
  },
  title: {
    fontWeight: 'bold',
    color: '#2c3e50',
    lineHeight: 1.1,
    marginBottom: 8,
  },
  subtitle: {
    color: '#7f8c8d',
    lineHeight: 1.2,
  },
  timeText: {
    fontWeight: '600',
    color: '#3498db',
    lineHeight: 1.1,
    marginBottom: 4,
  },
  dateText: {
    color: '#7f8c8d',
    lineHeight: 1.2,
  },
  gridContainer: {
    flex: 1,
    marginBottom: 32,
  },
  adminTouchArea: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },
  adminIndicator: {
    backgroundColor: 'rgba(52, 152, 219, 0.8)',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  adminIndicatorText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
  },
});