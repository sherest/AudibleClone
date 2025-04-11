import './global.css';
import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';

import books from './src/dummyBooks';
import BookListItem from './src/components/BookListItem';

export default function App() {
  return (
    <View className='bg-slate-800 flex-1 justify-center p-4'>
      {/* Book Row */}
      <BookListItem book={books[0]} />
      <BookListItem book={books[1]} />

      <StatusBar style='auto' />
    </View>
  );
}
