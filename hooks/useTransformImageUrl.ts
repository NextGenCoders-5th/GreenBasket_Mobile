import { LOCAL_HOST, LOCAL_HOST_IP } from '@/config/env';

export const useTransformImageUrl = ({ imageUrl }: { imageUrl?: string }) => {
  if (!imageUrl) return null;
  const transformedImageUrl = imageUrl?.replace(
    `${LOCAL_HOST}`,
    `${LOCAL_HOST_IP}`
  );
  return transformedImageUrl;
};
