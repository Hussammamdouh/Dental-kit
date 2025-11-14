import React, { useRef } from 'react';

/**
 * HorizontalCarousel - A reusable horizontal scrolling carousel component
 * with custom styled scrollbar and snap scrolling
 */
const HorizontalCarousel = ({ 
	children, 
	className = '',
	gap = 'gap-3 sm:gap-4 md:gap-6',
	itemClassName = ''
}) => {
	const carouselRef = useRef(null);

	return (
		<div 
			className="w-full overflow-x-auto carousel-wrapper"
			style={{ 
				WebkitOverflowScrolling: 'touch',
				overscrollBehaviorX: 'contain',
				scrollbarWidth: 'thin'
			}}
		>
			<div 
				ref={carouselRef}
				className={`flex ${gap} snap-x snap-mandatory pb-4 ${className}`}
				style={{ 
					WebkitOverflowScrolling: 'touch'
				}}
			>
				{children}
			</div>
		</div>
	);
};

export default HorizontalCarousel;

