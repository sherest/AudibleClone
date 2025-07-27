import React, { Fragment } from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';

const SatprasangaScreen = () => {
  return (
    <Fragment>
      <SafeAreaView style={{flex: 0, backgroundColor: '#1a1a2e'}}></SafeAreaView>
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <FontAwesome5 name="book-open" size={22} color="#e94560" />
          <Text style={styles.headerTitle}>
            Satprasanga
          </Text>
        </View>
        
        {/* Content */}
        <View style={styles.content}>
          <Text style={styles.placeholderText}>Coming Soon</Text>
        </View>
      </SafeAreaView>
    </Fragment>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f3460',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#1a1a2e',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#ffffff',
    marginLeft: 10,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 18,
    color: '#8b8b8b',
    fontStyle: 'italic',
  },
});

export default SatprasangaScreen; 