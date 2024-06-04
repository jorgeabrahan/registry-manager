import { ArrowUpCircleSolidIcon } from "@/assets/icons";

export const SurplusTag = () => {
  return (
    <span className='text-xs flex items-center gap-1 border-mantis-300 bg-mantis-600 px-2 py-1 rounded-xl'>
      Superávit <ArrowUpCircleSolidIcon size='18px' />
    </span>
  );
}
