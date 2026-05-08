import { useEffect, useState } from 'react'
import { StyleSheet, View, FlatList, Text } from 'react-native'
import { supabase } from './lib/supabase'

import { GluestackUIProvider } from '@/components/ui/gluestack-ui-provider';
import '@/global.css';

export default function App() {
  const [instruments, setInstruments] = useState([])

  useEffect(() => {
    getInstruments()
  }, [])

  async function getInstruments() {
    const { data } = await supabase.from('instruments').select()
    // @ts-ignore
    setInstruments(data)
  }

  return (
      
    <GluestackUIProvider mode="dark">
      <View style={styles.container}>
        <FlatList
            data={instruments}
            keyExtractor={(item) => item.id.toString(
    </GluestackUIProvider>
  )}
            renderItem={({ item }) => (
                <Text style={styles.item}>{item.id} {item.name}</Text>
            )}
        />
      </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 50,
    paddingHorizontal: 16,
  },
  item: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
})