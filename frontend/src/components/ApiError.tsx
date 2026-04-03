interface Props {
  message: string;
}

export default function ApiError({ message }: Props) {
  return (
    <div className="bg-rose-50 dark:bg-rose-900/20 border-b border-rose-200 dark:border-rose-800/50 px-6 py-2 text-center">
      <p className="text-xs font-medium text-rose-600 dark:text-rose-400">
        ⚠&nbsp;{message}
      </p>
    </div>
  );
}
