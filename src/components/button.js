export function Button({ children, onClick, className, variant = 'default' }) {
	const baseStyles =
	  variant === 'default'
		? 'bg-blue-600 text-white hover:bg-blue-700'
		: 'border border-gray-400 text-gray-700 hover:bg-gray-100';
  
	return (
	  <button
		onClick={onClick}
		className={`rounded-2xl px-4 py-2 font-semibold ${baseStyles} ${className}`}
	  >
		{children}
	  </button>
	);
  }