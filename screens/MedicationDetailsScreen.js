import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Alert, Image } from 'react-native';
import BottomTab from '../components/BottomTab';
import { BASE_URL } from '@env';

export default function MedicationDetailsScreen({ route, navigation }) {
  const { medicationId } = route.params;
  const [medication, setMedication] = useState(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchMedicationDetails = async () => {
      try {
        const response = await fetch(`${BASE_URL}medication_details/${medicationId}/`);
        if (!response.ok) {
          throw new Error('Failed to fetch medication details');
        }
        const data = await response.json();
        setMedication(data);
      } catch (error) {
        console.error('Error fetching medication details:', error);
      }
    };

    fetchMedicationDetails();
  }, [medicationId]);

  async function getCsrfToken() {
    try {
      const response = await fetch(`${BASE_URL}csrf_token/`);
      if (!response.ok) {
        throw new Error('Failed to fetch CSRF token');
      }
      const data = await response.json();
      return data.csrfToken;
    } catch (error) {
      console.error('Error fetching CSRF token:', error.message);
      throw error;
    }
  }

  const calculateTotalPrice = () => {
    if (medication) {
      return medication.price * quantity;
    }
    return 0;
  };

  const handleOrderNow = async () => {
    try {
      const totalPrice = calculateTotalPrice();

      const requestBody = {
        medication: medicationId,
        quantity: quantity,
        totalPrice: totalPrice,
      };

      console.log('Request Body:', requestBody);

      const csrfToken = await getCsrfToken();
      const response = await fetch(`${BASE_URL}medication_details/${medicationId}/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': csrfToken,
          'Referer': BASE_URL,
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.log(errorData)
        throw new Error(errorData.error || 'Failed to submit order');
      }

      const responseData = await response.json();
      console.log('Order submitted successfully:', responseData);
      Alert.alert('Success', 'Order submitted successfully');
    } catch (error) {
      console.error('Error submitting order:', error.message);
      Alert.alert('Error', 'Failed to submit order');
    }
  };

  const handleIncreaseQuantity = () => {
    // Increase the quantity by 1
    setQuantity(quantity + 1);
  };

  const handleDecreaseQuantity = () => {
    // Decrease the quantity by 1, ensuring it's not less than 1
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  if (!medication) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Image source={{ uri: `data:image/jpeg;base64,${medication.image_data}` }} style={styles.image} />
      <Text style={styles.title}>{medication.name}</Text>
      <Text style={styles.description}>{medication.description}</Text>
      <Text style={styles.price}>Unit Price: {medication.price}</Text>
      <Text style={styles.price}>Total Price: {calculateTotalPrice()}</Text>
      <View style={styles.quantityContainer}>
        <Text>Quantity: {quantity}</Text>
        <TouchableOpacity style={styles.quantityButton} onPress={handleIncreaseQuantity}>
          <Text>+</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.quantityButton} onPress={handleDecreaseQuantity}>
          <Text>-</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleOrderNow}>
        <Text style={styles.buttonText}>Order Now</Text>
      </TouchableOpacity>
      <BottomTab navigation={navigation} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 10,
  },
  image: {
    width: '100%',
    height: 200,
    marginBottom: 10,
    borderRadius: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    marginBottom: 10,
  },
  price: {
    fontSize: 16,
    marginBottom: 10,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  quantityButton: {
    backgroundColor: 'lightblue',
    padding: 5,
    borderRadius: 5,
    marginHorizontal: 5,
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
