import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { WebService } from '../types';

interface ServiceGridProps {
  webServices: WebService[];
  onServiceClick: (service: WebService) => void;
}

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export default function ServiceGrid({ webServices, onServiceClick }: ServiceGridProps) {
  // FHD 세로/가로 화면에 따른 그리드 설정
  const isLandscape = screenWidth > screenHeight;
  const columnsCount = isLandscape ? 4 : 2;
  const itemWidth = (screenWidth - 64 - (columnsCount - 1) * 16) / columnsCount;
  const itemHeight = itemWidth * 0.8;

  // 폰트 크기 계산 (화면 크기에 따라 동적 조정)
  const getFontSize = (baseSize: number) => {
    const scale = Math.min(screenWidth, screenHeight) / 1080;
    return Math.max(baseSize * scale, baseSize * 0.7);
  };

  const renderServiceItem = (service: WebService, index: number) => {
    return (
      <TouchableOpacity
        key={service.id}
        style={[
          styles.serviceItem,
          {
            width: itemWidth,
            height: itemHeight,
            backgroundColor: service.backgroundColor,
            marginBottom: 16,
            marginRight: (index + 1) % columnsCount === 0 ? 0 : 16,
          },
        ]}
        onPress={() => onServiceClick(service)}
        activeOpacity={0.8}
      >
        <View style={styles.serviceContent}>
          {/* 아이콘 영역 - Font Awesome 대신 이모지나 간단한 텍스트 사용 */}
          <View style={styles.iconContainer}>
            <Text style={[
              styles.iconText,
              { 
                color: service.textColor,
                fontSize: getFontSize(48),
              }
            ]}>
              {getServiceIcon(service.icon)}
            </Text>
          </View>
          
          {/* 서비스 이름 */}
          <Text
            style={[
              styles.serviceName,
              {
                color: service.textColor,
                fontSize: getFontSize(20),
              },
            ]}
            numberOfLines={2}
          >
            {service.name}
          </Text>
          
          {/* 서비스 설명 */}
          <Text
            style={[
              styles.serviceDescription,
              {
                color: service.textColor,
                fontSize: getFontSize(14),
              },
            ]}
            numberOfLines={2}
          >
            {service.description}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.grid}>
        {webServices.map((service, index) => renderServiceItem(service, index))}
      </View>
    </ScrollView>
  );
}

// Font Awesome 아이콘을 이모지나 심볼로 변환하는 함수
function getServiceIcon(iconClass: string): string {
  const iconMap: { [key: string]: string } = {
    'fas fa-robot': '🤖',
    'fab fa-google': '🔍',
    'fab fa-youtube': '📹',
    'fas fa-search': '🔎',
    'fas fa-globe': '🌐',
    'fas fa-chat': '💬',
    'fas fa-brain': '🧠',
    'fas fa-code': '💻',
    'fas fa-book': '📚',
    'fas fa-music': '🎵',
    'fas fa-camera': '📷',
    'fas fa-gamepad': '🎮',
    'fas fa-shopping-cart': '🛒',
    'fas fa-heart': '❤️',
    'fas fa-star': '⭐',
  };

  return iconMap[iconClass] || '📱';
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 32,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  serviceItem: {
    borderRadius: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  serviceContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  iconContainer: {
    marginBottom: 12,
  },
  iconText: {
    textAlign: 'center',
  },
  serviceName: {
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
    lineHeight: 24,
  },
  serviceDescription: {
    textAlign: 'center',
    opacity: 0.9,
    lineHeight: 18,
  },
});