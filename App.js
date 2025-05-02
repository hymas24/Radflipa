// App.js - RadFlip Main Entry Point

import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet } from 'react-native';
import firestore from '@react-native-firebase/firestore';

const App = () => {
  const [itemName, setItemName] = useState('');
  const [buyPrice, setBuyPrice] = useState('');
  const [sellPrice, setSellPrice] = useState('');
  const [flips, setFlips] = useState([]);

  useEffect(() => {
    const subscriber = firestore()
      .collection('flips')
      .onSnapshot(snapshot => {
        const all = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
        setFlips(all);
      });
    return () => subscriber();
  }, []);

  const addFlip = () => {
    const profit = parseFloat(sellPrice) - parseFloat(buyPrice);
    firestore().collection('flips').add({ itemName, buyPrice: parseFloat(buyPrice), sellPrice: parseFloat(sellPrice), profit });
    setItemName('');
    setBuyPrice('');
    setSellPrice('');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>RadFlip</Text>
      <TextInput style={styles.input} placeholder="Item Name" value={itemName} onChangeText={setItemName} />
      <TextInput style={styles.input} placeholder="Buy Price" keyboardType="numeric" value={buyPrice} onChangeText={setBuyPrice} />
      <TextInput style={styles.input} placeholder="Sell Price" keyboardType="numeric" value={sellPrice} onChangeText={setSellPrice} />
      <Button title="Add Flip" onPress={addFlip} />
      <FlatList data={flips} keyExtractor={item => item.id} renderItem={({ item }) => (
        <Text>{item.itemName} - £{item.buyPrice} > £{item.sellPrice} = Profit £{item.profit}</Text>
      )} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20, marginTop: 50 },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 20 },
  input: { borderWidth: 1, borderColor: '#ccc', marginBottom: 10, padding: 10, fontSize: 16 }
});

export default App;
