import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, TextInput, View, FlatList, Button } from 'react-native';
import React, { useEffect, useState } from 'react';
import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('shoppingcart.db');

export default function App() {
  const [product, setProduct] = useState('');
  const [amount, setAmount] = useState('');
  const [items, setItems] = useState([]);

  useEffect(() => {
    db.transaction(tx => {
      tx.executeSql('CREATE TABLE IF NOT EXISTS items (id INTEGER PRIMARY KEY AUTOINCREMENT, product TEXT, amount INTEGER);');
    }, (error) => console.error("Error creating table", error), updateList);
  }, []);

  const updateList = () => {
    db.transaction(tx => {
      tx.executeSql('SELECT * FROM items;', [], (_, { rows }) => {
        setItems(rows._array);
      });
    });
  };

  const addItem = () => {
    db.transaction(tx => {
      tx.executeSql('INSERT INTO items (product, amount) VALUES (?, ?);', [product, amount]);
    }, (error) => console.error("Error adding item", error), updateList);

    setProduct('');
    setAmount('');
  };

  const deleteItem = (id) => {
    db.transaction(tx => {
      tx.executeSql('DELETE FROM items WHERE id = ?;', [id]);
    }, (error) => console.error("Error deleting item", error), updateList);
  };

 

  return (
    <View style={styles.container}>
      <View style={styles.inputs}>
        <TextInput
          style={styles.input}
          placeholder='Product'
          value={product}
          onChangeText={text => setProduct(text)} />
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          placeholder='Amount'
          value={amount}
          onChangeText={text => setAmount(parseInt(text))} />
      </View>
      <View>
        <Button title="Add Item" onPress={addItem} />
      </View>

      <FlatList 
        data={items}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) =>
          <View style={styles.itemlist}>
            <Text style={styles.listrow}>{item.id}:   {item.product}, {item.amount}   </Text>
            <Text style={{color: '#0000ff'}} onPress={() => deleteItem(item.id)}>bought</Text>
          </View>}
      />

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop:100
  },
  inputs:{
    width:200,
    height:150,
    justifyContent:'space-between',
    paddingTop:20
  },
  input:{
    borderColor:'black',
    borderWidth:1,
    height:60
  },
  itemlist:{
    flexDirection:'row',
  },
  listrow:{
    fontStyle:'italic',
    fontSize:18
  }
});
