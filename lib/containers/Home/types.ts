import type { RecordProps } from '@/lib/components/Records/Records';
import type { TRecord } from '@/types/Records';
import type { SummaryMonth } from '@/types/Summary';

export type HomeViewProps = {
  summary: SummaryMonth;
  records: TRecord[] | undefined;
  recordProps: RecordProps;
};
