import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Alert,
  Linking,
} from 'react-native';
import { WebView } from 'react-native-webview';
import { WebService } from '../types';

interface WebViewScreenProps {
  service: WebService;
  onClose: () => void;
}

const { width: screenWidth } = Dimensions.get('window');

export default function WebViewScreen({ service, onClose }: WebViewScreenProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const handleLoadStart = () => {
    setIsLoading(true);
    setHasError(false);
  };

  const handleLoadEnd = () => {
    setIsLoading(false);
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  const handleOpenExternal = () => {
    Alert.alert(
      '외부 브라우저에서 열기',
      `${service.name}을(를) 기본 브라우저에서 열까요?`,
      [
        { text: '취소', style: 'cancel' },
        {
          text: '열기',
          onPress: () => {
            Linking.openURL(service.url).catch(() => {
              Alert.alert('오류', '브라우저를 열 수 없습니다.');
            });
          },
        },
      ]
    );
  };

  const getCurrentTime = () => {
    return new Date().toLocaleTimeString('ko-KR', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <View style={styles.container}>
      {/* 상단 헤더 */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity style={styles.backButton} onPress={onClose}>
            <Text style={styles.backButtonText}>🏠 체험 서비스 목록</Text>
          </TouchableOpacity>
          
          {hasError && (
            <TouchableOpacity style={styles.externalButton} onPress={handleOpenExternal}>
              <Text style={styles.externalButtonText}>🔗 외부에서 열기</Text>
            </TouchableOpacity>
          )}
        </View>
        
        <View style={styles.headerRight}>
          <Text style={styles.timeText}>{getCurrentTime()}</Text>
        </View>
      </View>

      {/* 웹뷰 영역 */}
      <View style={styles.webViewContainer}>
        {hasError ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorIcon}>🚫</Text>
            <Text style={styles.errorTitle}>웹사이트 보안 정책</Text>
            <Text style={styles.errorDescription}>
              이 웹사이트는 보안상 앱 내에서 표시할 수 없습니다.
            </Text>
            <TouchableOpacity style={styles.retryButton} onPress={handleOpenExternal}>
              <Text style={styles.retryButtonText}>🔗 외부 브라우저에서 열기</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <WebView
              source={{ uri: service.url }}
              style={styles.webView}
              onLoadStart={handleLoadStart}
              onLoadEnd={handleLoadEnd}
              onError={handleError}
              onHttpError={handleError}
              javaScriptEnabled={true}
              domStorageEnabled={true}
              startInLoadingState={true}
              allowsInlineMediaPlayback={true}
              mediaPlaybackRequiresUserAction={false}
              allowsBackForwardNavigationGestures={true}
            />
            
            {isLoading && (
              <View style={styles.loadingContainer}>
                <Text style={styles.loadingText}>로딩 중...</Text>
              </View>
            )}
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#f8f9fa',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  headerRight: {
    alignItems: 'flex-end',
  },
  backButton: {
    backgroundColor: '#007bff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    marginRight: 8,
  },
  backButtonText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 14,
  },
  externalButton: {
    backgroundColor: '#6c757d',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  externalButtonText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 14,
  },
  timeText: {
    fontSize: 14,
    color: '#6c757d',
    fontWeight: '500',
  },
  webViewContainer: {
    flex: 1,
  },
  webView: {
    flex: 1,
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    color: '#007bff',
    fontWeight: '600',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
    backgroundColor: '#f8f9fa',
  },
  errorIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  errorTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#343a40',
    marginBottom: 12,
    textAlign: 'center',
  },
  errorDescription: {
    fontSize: 16,
    color: '#6c757d',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  retryButton: {
    backgroundColor: '#007bff',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});