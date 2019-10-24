
import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Button,
  StatusBar,
  TextInput,
  FlatList,
  View,
  Text,
  ActivityIndicator
} from 'react-native';

import RNPickerSelect from 'react-native-picker-select';
import axios from 'axios'
import MyContext from './MyContext'

const API_URL = 'https://us-central1-geohash-2f8fb.cloudfunctions.net/getBasedOnGeoLocation'
const UOMS = [
  { label: 'Kilometer', value: 'km' },
  { label: 'Miles', value: 'mi' }
]

function Item({ name, price }) {
  return (
    <View style={styles.item}>
      <Text style={styles.name}>Name: {name}</Text>
      <Text style={styles.price}>Price: {price}</Text>
    </View>
  );
}


function MainPage() {

  const mycontext = React.useContext(MyContext)
  const [latitude, setLatitude] = React.useState('');
  const [longitude, setLongitude] = React.useState('');
  const [radius, setRadius] = React.useState('');
  const [shifts, setShifts] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [uom, setUom] = React.useState(mycontext);

  filterData = () => {
    console.log(uom)
    setLoading(true)
    const filters = `{"area" : {"radius": ${radius}, "uom": "${uom}", "point": [${latitude}, ${longitude}]}`
    axios
      .get(`${API_URL}?$filters=${filters}}`)
      .then(res => {
        setShifts(res.data.map(d => {
          return {
            id: d.id,
            name: d.data.name,
            price: d.data.price
          }
        }))
        setLoading(false)
      })
      .catch(err => {
        setLoading(false)
        console.log('error is', err)
      })
  }

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={styles.container}>
        {
          loading &&
          <ActivityIndicator
            size="large"
            color="#0000ff"
            style={styles.indicator}
          />
        }
        <TextInput
          style={styles.textInput}
          onChangeText={text => setLatitude(text)}
          value={latitude}
          placeholder='Enter Latitude'
        />
        <TextInput
          style={styles.textInput}
          onChangeText={text => setLongitude(text)}
          value={longitude}
          placeholder='Enter Longitude'
        />
        <TextInput
          style={styles.textInput}
          onChangeText={text => setRadius(text)}
          value={radius}
          placeholder='Enter Radius'
        />
        <RNPickerSelect
            style={styles}
            value={uom}
            onValueChange={(value) => setUom(value)}
            items={UOMS}
        />
        <Button
          style={styles.button}
          title="Search"
          color="#f194ff"
          onPress={filterData}
        />
        {
          shifts.length ?
          <>
            <Text style={styles.text}>Results:</Text>
            <FlatList
              data={shifts}
              renderItem={({ item }) => <Item name={item.name} price={item.price} />}
              keyExtractor={item => item.id}
            />
          </> 
          :
          <Text style={styles.text}>No results for the following filter</Text>
        }
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  textInput: {
    height: 40,
    width: 300,
    marginVertical: 10,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: 'gray',
    alignSelf: 'center',
    alignItems: 'center'
  },
  button: {
    marginVertical: 10,
  },
  inputIOS: {
    fontSize: 15,
    paddingVertical: 8,
    paddingHorizontal: 10,
    marginVertical: 10,
    height: 40,
    width: 300,
    borderColor: 'gray',
    borderWidth: 1,
    alignSelf: 'center',
  },
  inputAndroid: {
    height: 40,
    width: 300,
    fontSize: 15,
    paddingVertical: 8,
    paddingHorizontal: 10,
    marginVertical: 10,
    borderColor: 'gray',
    borderWidth: 1,
    alignSelf: 'center',
  },
  item: {
    margin: 10,
    borderColor: 'gray',
    borderWidth: 1,
    padding: 10
  },
  name: {
    fontSize: 14
  },
  price: {
    fontSize: 12
  },
  text: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
    marginLeft: 10
  },
  indicator: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 300
  }
});


export default MainPage;