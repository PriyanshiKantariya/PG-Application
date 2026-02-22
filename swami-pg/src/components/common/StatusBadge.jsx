import { getStatusBadgeClass } from '../../utils/helpers';

export default function StatusBadge({ status }) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClass(status)}`}>
      {status === 'InProgress' ? 'In Progress' : status}
    </span>
  );
}
