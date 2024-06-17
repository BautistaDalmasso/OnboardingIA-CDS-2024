import { useEffect, useState } from 'react';
import { StyleSheet, SafeAreaView, View, Text, Dimensions } from 'react-native';
import { FacialRecognitionView, OnChangeEvent } from 'expo-facial-recognition';
import Border from './Border';

const { height, width } = Dimensions.get('window')

export default function App() {
  const [embedding, setEmbedding] = useState<number[]>([])
  const [error, setError] = useState('')
  const [counter, setCounter] = useState(-1)

  useEffect(() => {
    console.log(Dimensions.get('window'))
    console.log(Dimensions.get('screen'))
  }, [])

  const onChange = ({ nativeEvent: { embedding, error } }: { nativeEvent: OnChangeEvent }) => {
    if (counter !== 0) {
      setEmbedding(embedding);
      setError(error);
    }
    if (!error.length && embedding.length) {
      if (counter === 0) return;
      setCounter(num => counter === -1 ? 6 : num - 1)
    } else {
      setCounter(-1)
    }
  }

  return (
    counter === 0 ? (
      <View style={styles.textContainer}><Text>Pantalla cargando</Text></View>
    ) : (
      <SafeAreaView style={styles.container}>
        <FacialRecognitionView style={{ flex: 1, width: '100%' }} onChangeEvent={onChange} />
        <View style={styles.border} >
          <Border error={error?.length || !embedding.length} />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.text}>{error?.length ? error : "Manten el rostro en la cámara"}</Text>
        </View>
        {
          counter !== -1 ?
            <View style={styles.counterContainer}>
              <Text style={styles.counter}>{Math.ceil(counter / 2)}</Text>
            </View> : null
        }
      </SafeAreaView >
    )
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  border: {
    position: 'absolute',
    opacity: 0.9,
    zIndex: 1
  },
  textContainer: {
    position: 'absolute',
    zIndex: 2,
    top: 0,
    color: 'black',
    width,
    height,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: height / 6
  },
  text: {
    fontSize: 22,
    textAlign: 'center',
    fontWeight: 'bold'
  },
  counterContainer: {
    position: 'absolute',
    zIndex: 2,
    top: 0,
    color: 'black',
    width,
    height,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: height / 2
  },
  counter: {
    fontSize: 150,
    textAlign: 'center',
    fontWeight: 'bold',
    opacity: .6,
  }
});
