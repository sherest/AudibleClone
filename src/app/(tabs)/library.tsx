import { FlatList } from 'react-native';

import books from '@/dummyBooks';
import BookListItem from '@/components/BookListItem';

export default function App() {
  return (
    <FlatList
      data={books}
      contentContainerClassName='gap-4 p-2'
      renderItem={({ item }) => <BookListItem book={item} />}
    />
  );
} 