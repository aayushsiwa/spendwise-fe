import { useMutation } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';

import { QueryKeys } from '@/constants/QueryKeys';
import { PrivateAxios, queryClient } from '@/pages/api/index';

type UploadCSVAPIResponse = {
  message: string;
};

type UploadCSVResponse = AxiosResponse<UploadCSVAPIResponse>;

type UploadCSVRequest = {
  file: File;
};

export const uploadCSVAPI = async ({
  file,
}: UploadCSVRequest): Promise<UploadCSVResponse> => {
  const formData = new FormData();
  formData.append('file', file);

  const res = await PrivateAxios.post<UploadCSVAPIResponse>(
    `/api/import/csv`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );

  return res;
};

export const useUploadCSVAPI = () => {
  return useMutation({
    mutationFn: uploadCSVAPI,

    onMutate: async () => {
      // Optional: cancel ongoing queries (same pattern as yours)
      await queryClient.cancelQueries({
        queryKey: [QueryKeys.RECORDS],
      });
    },

    onError: () => {
      // You can show toast/snackbar here
    },

    onSuccess: () => {
      // CSV upload changes records → refresh everything
      queryClient.invalidateQueries({ queryKey: [QueryKeys.RECORDS] });
      queryClient.invalidateQueries({ queryKey: [QueryKeys.SUMMARY] });
      queryClient.invalidateQueries({
        queryKey: [QueryKeys.SUMMARY_FILTER],
      });
    },
  });
};
