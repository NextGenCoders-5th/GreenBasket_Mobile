import { View, Text, StyleSheet, TextInput } from 'react-native'; // Import TextInput
import React, { useState } from 'react'; // Import useState
import { AntDesign } from '@expo/vector-icons';
import { useColorTheme } from '@/hooks/useColorTheme';
import ProductsList from '@/components/product/productsList'; // Assuming this is correct path

export default function ExploreScreen() {
  const colors = useColorTheme();
  const [searchText, setSearchText] = useState(''); // State to hold search input value

  // Function to handle text input changes
  const handleSearchTextChange = (text: string) => {
    setSearchText(text);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors['gray-50'] }]}>
      <View
        style={[
          styles.searchInputContainer,
          {
            borderColor: colors['gray-300'],
            backgroundColor: colors.background,
          },
        ]}
      >
        <AntDesign
          name='search1'
          size={22}
          color={colors['gray-300']}
          style={styles.searchIcon}
        />
        <TextInput
          placeholder='Search products...' // More descriptive placeholder
          placeholderTextColor={colors['gray-500']} // Use a color from your theme
          style={[
            styles.searchInput,
            {
              color: colors['gray-700'],
              fontFamily: 'Inter-Regular', // Use Regular for input text
              fontWeight: 'normal', // Reset fontWeight if Inter is variable font
            },
          ]}
          value={searchText} // Bind the input value to state
          onChangeText={handleSearchTextChange} // Update state on text change
          // Optional: Add onSubmitEditing to trigger search explicitly (e.g., on keyboard 'Done')
          // onSubmitEditing={() => {
          //    // If you want search to only trigger on hitting 'Enter'/'Done',
          //    // you'd manage another state here (e.g., submittedSearchText)
          //    // and pass that to ProductsList instead of searchText.
          //    console.log('Search submitted:', searchText);
          //    // This might trigger an immediate refetch if ProductsList reacts to the prop change
          // }}
        />
      </View>
      {/* Pass the search text to the ProductsList component */}
      <ProductsList searchText={searchText} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 10,
  },
  searchInputContainer: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
    height: 50,
    borderRadius: 25,
    borderWidth: 1,
    marginHorizontal: 15,
    marginBottom: 10,
  },
  searchIcon: {
    paddingLeft: 15,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 25,
    fontSize: 16,
    // fontFamily: 'Inter-Regular', // Already in style
    // fontWeight: 'normal', // Already in style
    // outline: 'none', // Web only
  },
});
