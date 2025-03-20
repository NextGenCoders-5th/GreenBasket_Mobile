import { Text } from 'react-native';

type ErrorMessageProp = {
  message: string;
};

export default function ErrorMessage({ message }: ErrorMessageProp) {
  return (
    <Text style={{ color: 'red', fontSize: 12, paddingLeft: 3 }}>
      {message}
    </Text>
  );
}
