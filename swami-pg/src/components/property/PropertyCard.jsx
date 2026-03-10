import { Link } from 'react-router-dom';
import { formatCurrency, getCallLink } from '../../utils/helpers';

export default function PropertyCard({ property }) {
  const {
    id,
    name,
    area,
    default_rent,
    rules_text
  } = property;

  // Get first 2 rules for preview
  const rulesPreview = rules_text
    ? rules_text.split('\n').slice(0, 2).join(' • ').replace(/^- /gm, '')
    : '';

  return (
    <div className="bg-white rounded-lg border border-[#E0E0E0] overflow-hidden hover:shadow-lg transition-shadow card-shadow">
      {/* Property Image Placeholder */}
      <div className="h-48 bg-gradient-to-br from-[#1E88E5] to-[#1565C0] flex items-center justify-center">
        <span className="text-white text-4xl font-bold">{name?.charAt(0) || 'P'}</span>
      </div>

      {/* Property Info */}
      <div className="p-5">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold text-[#212121]">{name}</h3>
        </div>

        <p className="text-[#757575] text-sm mb-3">{area}</p>

        <div className="flex items-baseline mb-3">
          <span className="text-xl font-bold text-[#1E88E5]">
            {formatCurrency(default_rent)}
          </span>
          <span className="text-[#757575] text-sm ml-1">/ month</span>
        </div>

        {rulesPreview && (
          <p className="text-[#757575] text-sm mb-4 line-clamp-2">
            {rulesPreview}
          </p>
        )}

        <div className="flex gap-2">
          <Link
            to={`/property/${id}`}
            className="flex-1 px-4 py-2.5 text-center text-sm font-medium text-white bg-[#1E88E5] rounded-md hover:bg-[#1565C0] transition-colors"
          >
            View Details
          </Link>
          <a
            href={getCallLink('7575866048')}
            className="px-4 py-2.5 text-sm font-medium text-[#1E88E5] border border-[#1E88E5] rounded-md hover:bg-[#E3F2FD] transition-colors"
          >
            Call
          </a>
        </div>
      </div>
    </div>
  );
}
