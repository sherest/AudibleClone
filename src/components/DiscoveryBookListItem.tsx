import { Text, View, Image, Pressable } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
// TODO: Replace with Firebase imports when implementing Firebase integration
// import { db, auth } from '@/lib/firebase';
// import { addDoc, collection } from 'firebase/firestore';

type Book = {
  id: string;
  title: string;
  author: string;
  audio_url: string;
  thumbnail_url?: string;
};

type DiscoveryBookListItemProps = {
  book: Book;
};

export default function DiscoveryBookListItem({
  book,
}: DiscoveryBookListItemProps) {
  // TODO: Replace with Firebase auth and firestore logic
  // const auth = getAuth();
  // const currentUser = auth.currentUser;
  
  // DUMMY CODE: For now, just show an alert or console log
  const handleAddToLibrary = async () => {
    try {
      // TODO: Replace with Firebase Firestore logic
      // const userBooksRef = collection(db, 'user-books');
      // await addDoc(userBooksRef, {
      //   user_id: currentUser?.uid,
      //   book_id: book.id,
      //   position: 0,
      //   created_at: new Date().toISOString(),
      // });
      
      // DUMMY CODE: For now, just log the action
      console.log(`Adding book "${book.title}" to library`);
      console.log('Book added to library (dummy action)');
      
      // TODO: Update local state or refetch data when Firebase is implemented
      // queryClient.invalidateQueries({ queryKey: ['my-books'] });
    } catch (error) {
      console.error('Error adding book to library:', error);
    }
  };

  return (
    <Pressable onPress={() => {}} className='flex-row gap-4 items-center'>
      <Image
        source={{ uri: book.thumbnail_url }}
        className='w-16 aspect-square rounded-md'
      />
      <View className='gap-1 flex-1'>
        <Text className='text-2xl text-gray-100 font-bold'>{book.title}</Text>
        <Text className='text-gray-400'>{book.author}</Text>
      </View>

      <AntDesign
        onPress={handleAddToLibrary}
        name='plus'
        size={24}
        color='gainsboro'
      />
    </Pressable>
  );
}
