import { PickedImage } from '@/components/form/ImagePickerButton';
import { apiSlice } from '@/redux/api/apiSlice';
import {
  User,
  GetCurrentUserResponse,
  UpdateProfilePictureResponse,
  UpdatePasswordResponse,
  CompleteOnboardingResponse,
  RequestAccountVerificationResponse,
  UpdateUserPasswordDto,
  CompleteOnboardingDto,
} from '@/types/user';

export interface UpdateProfilePictureDto {
  profile_picture: string;
}

export const userApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCurrentUser: builder.query<GetCurrentUserResponse, void>({
      query: () => '/users/account/current-user',
      providesTags: (result) =>
        result && result.data.data
          ? [
              { type: 'User' as const, id: result.data.data.id },
              { type: 'User' as const, id: 'ME' },
            ]
          : [{ type: 'User' as const, id: 'ME' }],
    }),

    updateProfilePicture: builder.mutation<
      UpdateProfilePictureResponse,
      UpdateProfilePictureDto // Or FormData if uploading a file
    >({
      query: (body) => {
        return {
          url: '/users/account/profile-picture',
          method: 'PATCH',
          body: body,
        };
      },
      invalidatesTags: (result) =>
        result && result.data.data
          ? [
              { type: 'User' as const, id: result.data.data.id },
              { type: 'User' as const, id: 'ME' },
            ]
          : [{ type: 'User' as const, id: 'ME' }],
      // Optimistic update could update the user object in cache immediately
      async onQueryStarted(
        { profile_picture },
        { dispatch, queryFulfilled, getState }
      ) {
        // Example optimistic update for profile picture URL
        const patchResult = dispatch(
          userApi.util.updateQueryData('getCurrentUser', undefined, (draft) => {
            if (draft.data.data && typeof profile_picture === 'string') {
              // Check if it's a string URL
              draft.data.data.profile_picture = profile_picture;
            }
          })
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
    }),

    // PATCH /users/account/password - Update user's password
    updateUserPassword: builder.mutation<
      UpdatePasswordResponse,
      UpdateUserPasswordDto
    >({
      query: (passwordData) => ({
        url: '/users/account/password',
        method: 'PATCH',
        body: passwordData,
      }),
      // No specific tag invalidation needed unless it affects 'User' details directly,
      // but usually password updates don't change the user object returned by getCurrentUser.
      // If it does (e.g., updates 'need_reset_password' flag), invalidate 'ME'.
      invalidatesTags: [{ type: 'User' as const, id: 'ME' }],
    }),

    completeOnboarding: builder.mutation<
      CompleteOnboardingResponse,
      CompleteOnboardingDto
    >({
      query: (onboardingData) => {
        const formData = new FormData();

        // Append text fields
        formData.append('first_name', onboardingData.first_name);
        formData.append('last_name', onboardingData.last_name);
        formData.append('date_of_birth', onboardingData.date_of_birth);
        formData.append('gender', onboardingData.gender);

        // Helper to append file to FormData (can be kept as is)
        const appendFileToFormData = (
          fieldKey: string,
          pickedImage: PickedImage | null | undefined
        ) => {
          if (pickedImage && pickedImage.uri) {
            const uriParts = pickedImage.uri.split('.');
            const fileTypeExtension = uriParts.pop() || 'jpeg'; // Default extension if pop fails
            const fileName =
              pickedImage.name || `photo_${Date.now()}.${fileTypeExtension}`;
            const mimeType = pickedImage.type || `image/${fileTypeExtension}`;

            formData.append(fieldKey, {
              uri: pickedImage.uri,
              name: fileName,
              type: mimeType,
            } as any);
          }
        };

        appendFileToFormData('profile_picture', onboardingData.profile_picture);
        appendFileToFormData('idPhoto_front', onboardingData.idPhoto_front);
        appendFileToFormData('idPhoto_back', onboardingData.idPhoto_back);

        return {
          url: '/users/account/complete-onboarding',
          method: 'PATCH',
          body: formData,
          formData: true, // Let RTK Query set Content-Type to multipart/form-data
        };
      },
      invalidatesTags: (result) =>
        result && result.data.data // Assuming result.data.data is the User object
          ? [
              { type: 'User' as const, id: result.data.data.id },
              { type: 'User' as const, id: 'ME' },
            ]
          : [{ type: 'User' as const, id: 'ME' }],
      async onQueryStarted(onboardingData, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          userApi.util.updateQueryData('getCurrentUser', undefined, (draft) => {
            if (draft.data.data) {
              // Ensure draft.data.data exists
              draft.data.data.is_onboarding = false;
              draft.data.data.first_name = onboardingData.first_name;
              draft.data.data.last_name = onboardingData.last_name;
              draft.data.data.date_of_birth = onboardingData.date_of_birth;
              draft.data.data.gender = onboardingData.gender;
            }
          })
        );
        try {
          const { data: responseData } = await queryFulfilled;
          // If you want to update the cache with the *actual* server-generated image URLs:
          if (responseData && responseData.data && responseData.data.data) {
            const updatedUserFromServer = responseData.data.data as User;
            dispatch(
              userApi.util.updateQueryData(
                'getCurrentUser',
                undefined,
                (draft) => {
                  if (draft.data.data) {
                    draft.data.data.profile_picture =
                      updatedUserFromServer.profile_picture;
                    draft.data.data.idPhoto_front =
                      updatedUserFromServer.idPhoto_front;
                    draft.data.data.idPhoto_back =
                      updatedUserFromServer.idPhoto_back;
                  }
                }
              )
            );
          }
        } catch {
          patchResult.undo();
        }
      },
    }),

    requestAccountVerification: builder.mutation<
      RequestAccountVerificationResponse,
      void
    >({
      query: () => ({
        url: '/users/account/request-account-verification',
        method: 'PATCH',
      }),
      invalidatesTags: [{ type: 'User' as const, id: 'ME' }],
    }),
  }),
});

export const {
  useGetCurrentUserQuery,
  useUpdateProfilePictureMutation,
  useUpdateUserPasswordMutation,
  useCompleteOnboardingMutation,
  useRequestAccountVerificationMutation,
  // useUpdateUserProfileMutation, // If you add the general update
} = userApi;
