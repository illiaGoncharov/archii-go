// Экран карты с точками интереса

import { useEffect, useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { useMapStore } from '../../stores/mapStore';
import { getCurrentLocation } from '../../utils/geolocation';
import POIMarkerComponent from '../../components/map/POIMarker';
import POIDetailModal from '../../components/map/POIDetailModal';

export default function MapScreen() {
  const { pois, selectedPOI, userLocation, fetchPOI, setSelectedPOI, setUserLocation } = useMapStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadMapData();
  }, []);

  const loadMapData = async () => {
    try {
      // Загружаем POI
      await fetchPOI();
      
      // Получаем геолокацию пользователя
      const location = await getCurrentLocation();
      if (location) {
        setUserLocation(location);
      } else {
        Alert.alert('Геолокация недоступна', 'Пожалуйста, разрешите доступ к местоположению');
      }
    } catch (error) {
      Alert.alert('Ошибка', 'Не удалось загрузить данные карты');
    } finally {
      setIsLoading(false);
    }
  };

  // Начальный регион карты (Москва, центр)
  const initialRegion = {
    latitude: userLocation?.latitude || 55.7612,
    longitude: userLocation?.longitude || 37.6089,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01
  };

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        initialRegion={initialRegion}
        showsUserLocation
        showsMyLocationButton
      >
        {/* Маркеры POI */}
        {pois.map((poi) => (
          <Marker
            key={poi.id}
            coordinate={{
              latitude: poi.location.latitude,
              longitude: poi.location.longitude
            }}
            onPress={() => setSelectedPOI(poi)}
          >
            <POIMarkerComponent poi={poi} />
          </Marker>
        ))}
      </MapView>

      {/* Модальное окно с деталями POI */}
      <POIDetailModal
        poi={selectedPOI}
        visible={selectedPOI !== null}
        onClose={() => setSelectedPOI(null)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  map: {
    width: '100%',
    height: '100%'
  }
});

