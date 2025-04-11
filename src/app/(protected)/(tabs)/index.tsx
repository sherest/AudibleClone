import { FlatList } from 'react-native';

import books from '@/dummyBooks';
import BookListItem from '@/components/BookListItem';
import FloatingPlayer from '@/components/FloatingPlayer';

export default function App() {
  return (
    <FlatList
      data={books}
      contentContainerClassName='gap-4 p-2'
      renderItem={({ item }) => <BookListItem book={item} />}
    />
  );
}
