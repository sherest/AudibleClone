import { FlatList } from 'react-native';
import books from '@/dummyBooks';
import DiscoveryBookListItem from '@/components/DiscoveryBookListItem';

export default function Discover() {
  return (
    <FlatList
      data={books}
      contentContainerClassName='gap-4 p-2'
      renderItem={({ item }) => <DiscoveryBookListItem book={item} />}
    />
  );
} 