// Import necessary components
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet, TouchableOpacity } from 'react-native';

import { BASE_URL } from '@env';

const OrdersScreen = () => {
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetch(`${BASE_URL}api/orders/`)
      .then(response => response.json())
      .then(data => {
        setOrders(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching orders:', error);
        setLoading(false);
      });
  }, []);

  const viewInvoice = async (orderId) => {
    // try {
    //   // Fetch PDF invoice from the API endpoint
    //   const response = await fetch(`${BASE_URL}${orderId}api/invoice/`, {
    //     method: 'GET',
    //     headers: {
          
    //     },
    //   });
  
    //   if (!response.ok) {
    //     throw new Error('Failed to fetch invoice');
    //   }
  
    //   const invoicePdf = await response.text(); // Assuming the response contains the base64 encoded PDF content
  
    //   // Decode base64 encoded PDF content
    //   const decodedPdf = atob(invoicePdf);
  
    //   // Open the PDF in the app's browser
    //   Linking.openURL(`data:application/pdf;base64,${decodedPdf}`);
    // } catch (error) {
    //   console.error('Error viewing invoice:', error.message);
    //   // Handle error
    // }
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
