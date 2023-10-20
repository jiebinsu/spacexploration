import { Card, Flex, Text, fr } from '@prismane/core';
import Image from 'next/image';
import LaunchChip from '../LaunchChip';

const DEFAULT_IMG = 'https://picsum.photos/id/537/521';

type LaunchCardProps = {
  data: Launch;
};

const LaunchCard = ({ data }: LaunchCardProps) => {
  const { launchName, rocketName, launchpadName, details, date, success } = data;
  const dateOptions = {
    hour12: true,
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
  } as Intl.DateTimeFormatOptions;

  const formattedDate = new Intl.DateTimeFormat('en-US', dateOptions).format(new Date(date));

  return (
    <Card data-testid="launch-card" className="bg-white text-black shadow-lg" p={0} mb={fr(6)}>
      <Flex w={fr(152)}>
        <Image
          loader={() => DEFAULT_IMG}
          src={DEFAULT_IMG}
          alt="Placeholder image"
          width={200}
          height={180}
          priority
          unoptimized
        />
        <Flex p={fr(4)} direction="column" w="100%">
          <Flex gap={fr(2)}>
            <Flex direction="column" w="100%">
              <Text fs="md" fw="bold" as="h3">
                {launchName}
              </Text>
              <Text data-testid="launch-date" className="text-gray-500">
                {formattedDate}
              </Text>
            </Flex>
            <Flex className="justify-end" w={fr(16)}>
              <LaunchChip success={success} />
            </Flex>
          </Flex>
          <Flex mt={fr(4)} direction="column">
            <Text fw="bold">Details</Text>
            <Text>Rocket Name: {rocketName}</Text>
            <Text>Launchpad Name: {launchpadName}</Text>
            <Text className="launch-card__line-clamp">{details ?? 'N/A'}</Text>
          </Flex>
        </Flex>
      </Flex>
    </Card>
  );
};

export default LaunchCard;
