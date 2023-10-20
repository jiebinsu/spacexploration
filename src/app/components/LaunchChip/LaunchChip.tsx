import { Chip } from '@prismane/core';

type LaunchChipProps = {
  success: boolean;
};

const LaunchChip = ({ success }: LaunchChipProps) => {
  return success ? (
    <Chip data-testid="launch-chip" bg={['green', 700]} cl="white" size="xs" fw="bold">
      Success
    </Chip>
  ) : (
    <Chip data-testid="launch-chip" bg="red" cl="white" size="xs" fw="bold">
      Failed
    </Chip>
  );
};

export default LaunchChip;
