import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet, TouchableOpacity } from 'react-native';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import { Alert } from 'react-native';
import * as Permissions from 'expo-permissions';

import { BASE_URL } from '@env';

const OrdersScreen = () => {
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await fetch(`${BASE_URL}api/orders/`);
      const data = await response.json();
      setOrders(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setLoading(false);
    }
  };

  const getPermission = async () => {
    try {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      return status === 'granted';
    } catch (error) {
      console.error('Error requesting permission:', error);
      return false;
    }
  };
  

const viewInvoice = async (orderId) => {
  try {
    const permissionGranted = await getPermission();
    
    if (!permissionGranted) {
      throw new Error('Permission to save files was denied');
    }

    const response = await fetch(`${BASE_URL}api/invoice/${orderId}/`);
    const blob = await response.blob();

    const reader = new FileReader();
    reader.readAsDataURL(blob);
    reader.onloadend = async () => {
      const base64String = reader.result.split(',')[1]; 
      
      const fileName = `invoice_${orderId}.pdf`;
      const fileUri = FileSystem.cacheDirectory + fileName;

      // Write the base64 string to a
      await FileSystem.writeAsStringAsync(fileUri, base64String, { encoding: FileSystem.EncodingType.Base64 });

      // Save the file to the device's media library
      const asset = await MediaLibrary.createAssetAsync(fileUri);
      await MediaLibrary.createAlbumAsync('Downloads', asset, false);

      const message = 'Invoice downloaded successfully!';
      const filePath = `File saved to: ${fileUri}`;
      Alert.alert(message, filePath);
    };
  } catch (error) {
    console.error('Error downloading invoice:', error);
    alert('Failed to download invoice.');
  }
};

  
  

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Orders</Text>
      <View style={styles.card}>
        <FlatList
          data={orders}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={styles.orderCard}>
              <Text style={styles.orderText}>Order ID: {item.id}</Text>
              <Text style={styles.orderText}>Medication: {item.medication}</Text>
              <Text style={styles.orderText}>Category: {item.medication.category}</Text>
              <Text style={styles.orderText}>Order Quantity: {item.quantity}</Text>
              <Text style={styles.orderText}>Total price: {item.totalPrice}</Text>
              <TouchableOpacity style={styles.button} onPress={() => viewInvoice(item.id)}>
                <Text style={styles.buttonText}>View Invoice</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#f0f0f0',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
    fontWeight: 'bold',
  },
  card: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 16,
  },
  orderCard: {
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 12,
  },
  orderText: {
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: 'blue',
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default OrdersScreen;
