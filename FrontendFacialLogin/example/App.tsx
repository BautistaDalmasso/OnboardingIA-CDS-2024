import { StyleSheet, SafeAreaView, View, Text } from 'react-native';
import { FacialLoginView, OnChangeEvent } from 'facial-login';
import Border from './Border';
import { useEffect, useState } from 'react';

export default function App() {
  const [embedding, setEmbedding] = useState<number[]>([])
  const [error, setError] = useState('')

  useEffect(() => {
    console.log('Prueba')
  }, [])

  const onChange = ({ nativeEvent: { embedding, error } }: { nativeEvent: OnChangeEvent }) => {
    setEmbedding(embedding);
    setError(error);
  }

  return (
    <SafeAreaView style={styles.container}>
      <FacialLoginView style={{ flex: 1, width: '100%' }} onChangeEvent={onChange} />
      <View style={styles.border} >
        <Border />
        <View style={styles.text}>
          <Text>{error}</Text>
          <Text>{embedding.length}</Text>
        </View>
      </View>
    </SafeAreaView>
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
  text: {
    position: 'absolute',
    zIndex: 2,
    top: 0,
    color: 'black',
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center'
  }
});
