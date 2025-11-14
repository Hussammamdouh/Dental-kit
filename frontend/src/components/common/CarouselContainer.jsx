import React from 'react';

/**
 * CarouselContainer - A fixed-width container that prevents horizontal overflow
 * while allowing carousels to scroll within it
 */
const CarouselContainer = ({ children, className = '' }) => {
	return (
		<div 
			className={`w-full mx-auto px-4 sm:px-6 lg:px-8 ${className}`}
			style={{ 
				maxWidth: '100vw',
				overflowX: 'hidden',
				boxSizing: 'border-box'
			}}
		>
			<div 
				className="w-full mx-auto"
				style={{
					maxWidth: '1400px',
					width: '100%'
				}}
			>
				{children}
			</div>
		</div>
	);
};

export default CarouselContainer;

