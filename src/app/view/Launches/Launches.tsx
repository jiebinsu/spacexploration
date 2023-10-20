import { Skeleton, fr } from '@prismane/core';
import LaunchCard from '@/app/components/LaunchCard';
import useSWRImmutable from 'swr/immutable';
import axios from 'axios';

const fetcher = (url: string) => axios.get(url).then((res) => res.data);

export default function Launches() {
  const { data, error, isLoading } = useSWRImmutable('/api/launches', fetcher);
  const launches = data?.results ?? [];

  if (error) return <div>Error loading data...</div>;
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      {!isLoading && launches.length === 0 && <div>No launch data...</div>}
      {isLoading
        ? new Array(5)
            .fill(undefined)
            .map((_, i) => (
              <Skeleton
                data-testid="skeleton-card"
                className="my-4"
                key={`dummy_${i}`}
                w={fr(124)}
                h={180}
                variant="rounded"
              />
            ))
        : launches.map((launch: Launch) => <LaunchCard key={launch.id} data={launch} />)}
    </main>
  );
}
