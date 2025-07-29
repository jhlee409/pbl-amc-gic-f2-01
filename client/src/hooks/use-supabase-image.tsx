import { useState, useEffect } from 'react';
import { getImageUrl } from '@/lib/supabase';

export function useSupabaseImage(bucketName: string, fileName: string) {
  const [imageUrl, setImageUrl] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchImage() {
      try {
        setLoading(true);
        const url = await getImageUrl(bucketName, fileName);
        setImageUrl(url);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load image');
      } finally {
        setLoading(false);
      }
    }

    if (bucketName && fileName) {
      fetchImage();
    }
  }, [bucketName, fileName]);

  return { imageUrl, loading, error };
}
