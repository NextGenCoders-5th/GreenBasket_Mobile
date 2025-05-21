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
  UpdateProfilePictureDto,
} from '@/types/user';

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
      UpdateProfilePictureDto // Use the frontend DTO type
    >({
      query: (data) => {
        const formData = new FormData();
        const pickedImage = data.profile_picture;

        if (pickedImage && pickedImage.uri) {
          const { uri, name, type } = pickedImage;

          const uriParts = uri.split('.');
          const fileTypeExtension =
            uriParts.length > 1 ? uriParts.pop() : 'jpeg';

          const fileName = name || `profile_${Date.now()}.${fileTypeExtension}`;
          const mimeType = type || `image/${fileTypeExtension}`;

          // Create a clean file object with only the necessary properties
          const fileData: any = {
            // Explicitly type as any for RN compatibility
            uri: uri,
            name: fileName,
            type: mimeType,
          };

          console.log(
            'Constructed fileData object for FormData (in updateProfilePicture):',
            fileData
          );
          console.log('Appending file with key:', 'profilePicture');

          // --- Use the clean fileData object ---
          formData.append('profilePicture', fileData); // Match backend's FileInterceptor key

          console.log(
            'FormData keys after appending file (in updateProfilePicture):',
            Array.from(formData.keys())
          );
        } else {
          console.error(
            'updateProfilePicture mutation called without a valid profile picture URI.'
          );
        }

        return {
          url: '/users/account/profile-picture',
          method: 'PATCH',
          body: formData,
          formData: true,
        };
      },
      invalidatesTags: (result) =>
        result && result.data.data
          ? [
              { type: 'User' as const, id: result.data.data.id },
              { type: 'User' as const, id: 'ME' },
            ]
          : [{ type: 'User' as const, id: 'ME' }],
      async onQueryStarted(args, { dispatch, queryFulfilled, getState }) {
        try {
          const { data: responseData } = await queryFulfilled;
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
                  }
                }
              )
            );
          }
        } catch (err) {
          console.error(
            'Optimistic update for profile picture failed or API call failed:',
            err
          );
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
